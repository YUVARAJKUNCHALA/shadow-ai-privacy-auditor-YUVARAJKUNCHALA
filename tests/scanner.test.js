import assert from "node:assert/strict";
import test from "node:test";
import { evaluationCases } from "../src/evaluationData.js";
import { redactText, scanText } from "../src/scanner.js";
import { evaluate } from "../scripts/evaluate.js";

test("safe text is left unchanged", () => {
  const text = "The project meeting is scheduled for 3:00 PM.";
  const findings = scanText(text);

  assert.equal(findings.length, 0);
  assert.equal(redactText(text, findings), text);
});

test("risky example detects and redacts multiple categories", () => {
  const text = "Volunteer ID VOL-4821 (Maria Lopez) missed her shift; SSN 123-45-6789.";
  const findings = scanText(text);
  const categories = findings.map((finding) => finding.category);

  assert.ok(categories.includes("workforce"));
  assert.ok(categories.includes("contact"));
  assert.ok(categories.includes("identifier"));
  assert.equal(redactText(text, findings), "[WORKFORCE ID] ([CONTACT]) missed her shift; SSN [IDENTIFIER].");
});

test("evaluation set has at least 10 synthetic cases including safe examples", () => {
  assert.ok(evaluationCases.length >= 10);
  assert.ok(evaluationCases.some((testCase) => testCase.expected.length === 0));
});

test("evaluation metrics meet prototype target", () => {
  const results = evaluate();

  assert.ok(results.precision >= 0.85);
  assert.ok(results.recall >= 0.85);
  assert.ok(results.f1 >= 0.85);
});

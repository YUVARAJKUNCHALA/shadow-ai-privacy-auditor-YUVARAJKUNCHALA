import { evaluationCases } from "../src/evaluationData.js";
import { scanText } from "../src/scanner.js";

const results = evaluate();
console.table(results.rows);
console.log(`Precision: ${results.precision.toFixed(2)}`);
console.log(`Recall: ${results.recall.toFixed(2)}`);
console.log(`F1: ${results.f1.toFixed(2)}`);

export function evaluate() {
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  const rows = [];

  for (const testCase of evaluationCases) {
    const predicted = scanText(testCase.text).map((finding) => finding.category);
    const matched = matchCategories(predicted, testCase.expected);
    truePositive += matched.truePositive;
    falsePositive += matched.falsePositive;
    falseNegative += matched.falseNegative;
    rows.push({
      case: testCase.name,
      expected: testCase.expected.join(", ") || "safe",
      predicted: predicted.join(", ") || "safe"
    });
  }

  const precision = truePositive / Math.max(truePositive + falsePositive, 1);
  const recall = truePositive / Math.max(truePositive + falseNegative, 1);
  const f1 = (2 * precision * recall) / Math.max(precision + recall, Number.EPSILON);

  return { precision, recall, f1, rows, truePositive, falsePositive, falseNegative };
}

function matchCategories(predicted, expected) {
  const remaining = [...expected];
  let truePositive = 0;
  let falsePositive = 0;

  for (const category of predicted) {
    const index = remaining.indexOf(category);
    if (index >= 0) {
      truePositive += 1;
      remaining.splice(index, 1);
    } else {
      falsePositive += 1;
    }
  }

  return {
    truePositive,
    falsePositive,
    falseNegative: remaining.length
  };
}

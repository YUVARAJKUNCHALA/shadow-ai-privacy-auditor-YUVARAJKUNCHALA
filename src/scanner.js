import { NaiveBayesTextModel } from "./model.js";
import { trainingExamples } from "./trainingData.js";

export const categories = {
  contact: {
    label: "Name or contact information",
    redaction: "CONTACT",
    risk: "Personal contact details can identify or expose a person outside approved systems."
  },
  identifier: {
    label: "Government or financial identifier",
    redaction: "IDENTIFIER",
    risk: "Government and financial IDs can enable fraud, account takeover, or identity misuse."
  },
  credential: {
    label: "Password, API key, or credential",
    redaction: "CREDENTIAL",
    risk: "Credentials can grant direct access to accounts, systems, or data."
  },
  medical: {
    label: "Medical or sensitive personal information",
    redaction: "MEDICAL INFO",
    risk: "Medical details are sensitive personal data and often require stricter handling."
  },
  workforce: {
    label: "Employee, client, or volunteer information",
    redaction: "WORKFORCE ID",
    risk: "Internal person IDs can expose private organizational records or case history."
  },
  confidential: {
    label: "Confidential organizational or project information",
    redaction: "CONFIDENTIAL INFO",
    risk: "Internal strategy, roadmap, acquisition, or contract details may harm the organization if shared."
  }
};

const model = new NaiveBayesTextModel().train(trainingExamples);
const minConfidence = 0.32;

export function scanText(text) {
  const candidates = buildCandidates(text);
  const accepted = [];

  for (const candidate of candidates) {
    const context = contextWindow(text, candidate.start, candidate.end);
    const prediction = model.predict(`${candidate.text} ${context} ${candidate.hint}`);
    const modelAgrees = prediction.label === candidate.category || prediction.confidence >= minConfidence;
    if (!modelAgrees || prediction.label === "safe") continue;

    accepted.push({
      ...candidate,
      category: candidate.category,
      categoryLabel: categories[candidate.category].label,
      explanation: categories[candidate.category].risk,
      redaction: categories[candidate.category].redaction,
      confidence: Number(prediction.confidence.toFixed(3)),
      modelLabel: prediction.label
    });
  }

  return mergeFindings(accepted).sort((left, right) => left.start - right.start);
}

export function redactText(text, findings, decisions = {}) {
  let cursor = 0;
  let output = "";

  for (const finding of findings.toSorted((left, right) => left.start - right.start)) {
    if (decisions[finding.id] === "keep") continue;
    output += text.slice(cursor, finding.start);
    output += `[${finding.redaction}]`;
    cursor = finding.end;
  }

  return output + text.slice(cursor);
}

function buildCandidates(text) {
  const candidates = [];
  const add = (category, pattern, hint) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const start = match.index;
      candidates.push({
        id: `${category}-${start}-${value.length}`,
        category,
        text: value,
        start,
        end: start + value.length,
        hint
      });
    }
  };

  add("contact", /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g, "person name contact identity");
  add("contact", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "email address contact");
  add("contact", /(?:\+1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g, "phone contact");
  add("contact", /\b\d{2,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/g, "street address contact");

  add("identifier", /\b\d{3}-\d{2}-\d{4}\b/g, "ssn government identifier");
  add("identifier", /\b(?:driver'?s?\s+license|license|DL)\s*#?\s*[A-Z]?\d{6,10}\b/gi, "driver license government identifier");
  add("identifier", /\b(?:bank\s+account|account\s+number|acct)\s*#?\s*\d{6,17}\b/gi, "bank account financial identifier");
  add("identifier", /\b(?:\d[ -]?){13,16}\b/g, "payment card financial identifier");
  add("identifier", /\brouting\s+number\s+\d{9}\b/gi, "routing number financial identifier");

  add("credential", /\b(?:password|passcode|secret)\s*(?:is|=|:)\s*\S+/gi, "password credential secret");
  add("credential", /\b(?:api[_ -]?key|access[_ -]?token|token)\s*(?:is|=|:)?\s*[A-Za-z0-9._-]{12,}\b/gi, "api key token credential");
  add("credential", /\b(?:sk|ak|pk)_(?:live|test|prod)?_?[A-Za-z0-9]{12,}\b/g, "api key credential");
  add("credential", /-----BEGIN [A-Z ]*PRIVATE KEY-----/g, "private key credential");
  add("credential", /\bBearer\s+[A-Za-z0-9._-]{16,}\b/g, "bearer token credential");

  add("medical", /\b(?:diagnosis|diagnosed with|prescription|prescribed|blood type|therapy|medical record|MRN|patient ID)\b[^.;\n]*/gi, "medical patient prescription diagnosis");
  add("medical", /\b(?:diabetes|asthma|anxiety|depression|metformin|amoxicillin|insulin)\b[^.;\n]*/gi, "medical condition prescription");
  add("medical", /\b(?:PAT|MRN)-\d{4,8}\b/g, "patient id medical record");

  add("workforce", /\b(?:EMP|VOL|CLI|INT|EID|BADGE)-?\d{3,8}\b/g, "employee volunteer client id workforce");
  add("workforce", /\b(?:employee|volunteer|client|staff|intern)\s+(?:id|number|badge)\s*#?\s*[A-Z-]*\d{3,8}\b/gi, "employee volunteer client id workforce");

  add("confidential", /\b(?:strictly confidential|confidential|do not share|internal only|under NDA)\b[^.;\n]*/gi, "confidential internal organizational");
  add("confidential", /\b(?:acquisition|merger|roadmap|layoff|pricing strategy|contract negotiation|embargoed|Project\s+[A-Z][A-Za-z0-9-]+)\b[^.;\n]*/g, "roadmap acquisition strategy confidential");

  return candidates.filter((candidate) => candidate.text.trim().length > 0 && !isBenignPublicReference(candidate));
}

function contextWindow(text, start, end) {
  return text.slice(Math.max(0, start - 80), Math.min(text.length, end + 80));
}

function isBenignPublicReference(candidate) {
  if (candidate.category !== "confidential") return false;
  const value = candidate.text.toLowerCase();
  const publicContext = /\b(public|published|press release|website|page)\b/.test(value);
  const explicitSecret = /\b(confidential|strictly confidential|do not share|internal only|under nda|acquisition|merger|layoff|contract negotiation|embargoed)\b/.test(value);

  return publicContext && !explicitSecret;
}

function mergeFindings(findings) {
  const sorted = findings.toSorted((left, right) => {
    if (left.start !== right.start) return left.start - right.start;
    return right.end - left.end;
  });
  const merged = [];

  for (const finding of sorted) {
    const previous = merged.at(-1);
    if (previous && finding.start < previous.end) {
      const previousLength = previous.end - previous.start;
      const currentLength = finding.end - finding.start;
      if (currentLength > previousLength || finding.confidence > previous.confidence + 0.1) {
        merged[merged.length - 1] = finding;
      }
      continue;
    }
    merged.push(finding);
  }

  return merged;
}

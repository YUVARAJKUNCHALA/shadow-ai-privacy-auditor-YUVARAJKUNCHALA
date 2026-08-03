# Planning Document

## Tech Stack

**Framework / Language:** Browser-native HTML, CSS, and JavaScript with Node.js scripts for local serving and tests.

I chose this stack because the prototype should be easy for reviewers to run and inspect. A static app also supports the privacy goal: user text can be scanned locally in the browser without a backend receiving pasted content.

**Key Libraries:** No runtime dependencies. Node's built-in test runner is used for tests.

**Detection Approach / AI Provider:** A hybrid detector. Candidate spans are extracted with category-specific boundary rules, then a local Multinomial Naive Bayes text classifier scores each span and its surrounding context. The model is trained on synthetic examples stored in the repo. No external AI API is called at runtime.

## Detection Categories

| Category | Detect? | Planned technique |
|----------|---------|-------------------|
| Names & contact information | Yes | Candidate extraction for names, email, phone, address; ML context scoring |
| Government or financial identifiers | Yes | Candidate extraction for SSN, license, bank, routing and card-like numbers; ML context scoring |
| Passwords, API keys or credentials | Yes | Candidate extraction for password/token/key/private-key patterns; ML context scoring |
| Medical or sensitive personal information | Yes | Candidate extraction for patient IDs, diagnoses, prescriptions and medical keywords; ML context scoring |
| Employee, client or volunteer information | Yes | Candidate extraction for EMP/VOL/CLI/staff IDs and nearby role terms; ML context scoring |
| Confidential organizational or project information | Yes | Candidate extraction for confidential labels, acquisition/roadmap/contract terms; ML context scoring |

## Phases & Priorities

| Phase | Target Dates | Goals |
|-------|-------------|-------|
| 1 | July 29-30 | Build the local model, candidate extractors, redaction engine, and core tests |
| 2 | July 31-Aug 1 | Build the review UI with highlights, explanations, keep/redact controls, and copyable safe output |
| 3 | Aug 2-3 | Add synthetic evaluation, precision/recall/F1 reporting, model card, reflection, walkthrough link, deployment, and final verification |

## What I'll Cut If Time Is Short

First cut: advanced browser-extension integration and custom organization policies.

Last cut: accurate Tier 1 flow: paste text, detect sensitive spans, explain them, let the user review, and produce safer redacted output.

## Open Questions / Risks

Name detection can over-match ordinary title-cased phrases, while confidential-project detection can flag public roadmap wording if context is weak. The prototype reduces this with model scoring and safe evaluation cases, but production use would need a larger labeled set and reviewer feedback loops.

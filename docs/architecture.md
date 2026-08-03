# Architecture and Detection Design

## Overview

Shadow AI Privacy Auditor is a static browser app. The user pastes text into the page, the scanner runs locally, findings are highlighted in place, and the redaction engine produces a safer copyable version. There is no backend in the runtime path and no storage of pasted content.

## Components

- `src/index.html`, `src/styles.css`, `src/app.js`: user interface, highlighting, review controls, and copy workflow.
- `src/scanner.js`: span candidate extraction, model scoring, finding explanations, overlap handling, and redaction.
- `src/model.js`: in-repo Multinomial Naive Bayes text classifier.
- `src/trainingData.js`: synthetic training examples for safe and sensitive classes.
- `src/evaluationData.js`: synthetic labeled test cases used for metrics.
- `scripts/evaluate.js`: precision, recall, and F1 reporting.
- `tests/scanner.test.js`: regression tests for safe text, risky text, evaluation coverage, and target metrics.

## ML-Centered Detection Flow

1. The scanner proposes candidate spans using boundary extractors for names, emails, IDs, credentials, medical phrases, workforce IDs, and confidential project language.
2. For each candidate, the app builds a short model input from the span, surrounding context, and category hint.
3. A local Naive Bayes model predicts whether that evidence looks safe or belongs to one of the sensitive categories.
4. Accepted findings are merged to avoid overlapping highlights.
5. Each finding is shown with a category, confidence, and user-facing risk explanation.
6. The redaction engine replaces selected findings with category placeholders while preserving untouched safe text.

This design uses regex-like extractors for precise span boundaries, but the model gates the final finding shown to the user.

## Privacy and Security Design

- Local-first scanning: pasted text stays in the browser.
- No analytics, server logging, accounts, or remote model calls.
- Synthetic-only training and evaluation data.
- Category placeholders avoid leaking the original sensitive text into the redacted output.
- Review controls let the user keep false positives instead of blindly redacting everything.

## Known Limitations

- The model is intentionally small and trained on synthetic examples, so real-world accuracy is not proven.
- Name detection is English-centric and may miss single names, non-Western name structures, or lowercase names.
- The app does not yet support document upload, browser-extension monitoring, organization-specific custom policies, or multilingual scanning.
- The metrics are entity-category metrics on a small synthetic test set, not production benchmark results.

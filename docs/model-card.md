# Model Card

## Model

Custom Multinomial Naive Bayes text classifier implemented in `src/model.js`.

## Purpose

The model classifies candidate text spans and context as one of seven labels: safe, contact, identifier, credential, medical, workforce, or confidential. It is used to decide whether candidate spans should be shown as sensitive findings.

## Why This Model

Naive Bayes is lightweight, explainable, fast in the browser, and easy for reviewers to inspect. It fits the prototype requirement to use an ML model without requiring pasted text to leave the user's device.

## Training Data

Training data is synthetic and stored in `src/trainingData.js`. It includes safe examples and examples for all six hackathon detection categories.

## Evaluation

Evaluation uses 14 additional synthetic cases in `src/evaluationData.js`, including safe examples. Current entity-level results:

- Precision: 1.00
- Recall: 1.00
- F1: 1.00

These scores validate the submitted prototype scenarios, not production readiness.

## Intended Use

Use this model to warn users before they paste sensitive or confidential text into public AI tools.

## Out-of-Scope Use

Do not use this prototype as a compliance system, DLP replacement, medical privacy classifier, or guarantee that text is safe to share.

## Limitations

The model is trained on a small synthetic set, handles English examples best, and depends on candidate extraction rules for span boundaries. A production version should use a larger labeled dataset, adversarial testing, organization-specific policies, and human review of false positives and false negatives.

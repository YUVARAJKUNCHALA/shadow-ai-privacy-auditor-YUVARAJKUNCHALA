# Reflection

## What I Built

I built a local-first Shadow AI Privacy Auditor web app. It accepts pasted text, highlights sensitive spans, explains why each finding is risky, lets the user keep or redact each finding, and produces a safer copyable output.

The solution detects all six required categories: contact information, government/financial identifiers, credentials, medical/sensitive personal information, employee/client/volunteer information, and confidential organizational/project information. It includes synthetic training data, synthetic evaluation cases, tests, metrics, and a model card.

Known weak spots: the name detector is simple, the model is trained on a small synthetic dataset, and some confidential terms can be ambiguous without organization-specific policy context.

## What I'd Do Differently

With more time I would add a browser extension, configurable organization policies, multilingual examples, a richer NER model, larger hand-labeled evaluation data, severity scoring, and an undo history for review decisions.

## AI Tools Used

OpenAI Codex was used as a coding assistant to help implement the scanner, UI, tests, documentation, and final packaging. The runtime app does not call OpenAI or any remote AI provider. All training and evaluation data in the repo is synthetic.

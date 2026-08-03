# CDF Shadow AI Hackathon

**Live URL:** https://yuvarajkunchala.github.io/shadow-ai-privacy-auditor-YUVARAJKUNCHALA/
**Demo video:** See [`docs/walkthrough.md`](./docs/walkthrough.md)

Shadow AI Privacy Auditor is a local-first web prototype that helps users inspect text before pasting it into a public AI tool. It highlights sensitive spans, explains why each item is risky, lets the user keep or redact each finding, and generates a safer copyable version.

## What It Detects

The app covers all six hackathon categories:

- Names and contact information: names, emails, phone numbers, street addresses
- Government or financial identifiers: SSNs, driver license numbers, bank accounts, credit cards
- Passwords, API keys, or credentials: passwords, API keys, bearer tokens, private keys
- Medical or sensitive personal information: diagnoses, prescriptions, blood type, patient IDs
- Employee, client, or volunteer information: EMP/VOL/client IDs and related context
- Confidential organizational or project information: confidential labels, acquisition, roadmap, launch and contract language

## Detection Approach

Detection uses a small machine-learning model in the browser: a Multinomial Naive Bayes text classifier trained from synthetic examples in [`src/trainingData.js`](./src/trainingData.js). Candidate spans are proposed by category-specific extractors, and the model scores each candidate plus surrounding context before it is shown to the user. Regex and keyword rules support span boundaries; they do not make the final risk decision alone.

The app runs fully on-device. No pasted text is stored, logged, or sent to a server.

## Setup and Run

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Run tests and metrics:

```bash
npm test
npm run evaluate
```

## Results

Evaluation uses 14 synthetic labeled cases, including safe examples. Current entity-level metrics:

| Metric | Score |
| --- | ---: |
| Precision | 1.00 |
| Recall | 1.00 |
| F1 | 1.00 |

The detailed test set and evaluator are in [`src/evaluationData.js`](./src/evaluationData.js) and [`scripts/evaluate.js`](./scripts/evaluate.js). These are synthetic cases only, so the scores should be treated as proof-of-prototype behavior rather than production accuracy.

## AI, Libraries, Data, and Templates Used

- AI tools: OpenAI Codex was used to help implement, document, test, and package this submission.
- ML model: custom in-repo Multinomial Naive Bayes classifier, trained on synthetic examples.
- Existing code/templates: GitHub Classroom starter repo structure and assignment prompt files.
- Libraries: no runtime npm dependencies; browser and Node built-ins only.
- Datasets: all training and evaluation examples are synthetic and included in the repository.

## Repository Checklist

- [x] Complete source code in `src/`
- [x] README with setup and run instructions
- [x] Demo video link in `docs/walkthrough.md`
- [x] Precision, recall, and F1 results in [`docs/evaluation.md`](./docs/evaluation.md)
- [x] AI tools, libraries, datasets, and templates disclosed
- [x] Brief approach explanation
- [x] Model card in `docs/model-card.md`
- [x] Planning, architecture, reflection, and walkthrough docs

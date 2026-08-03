# Evaluation Cases and Results

The evaluation set uses fictional, synthetic examples only. It includes safe text that should remain unchanged and risky text across all six hackathon categories.

Run:

```bash
npm run evaluate
```

Current results:

| Metric | Score |
| --- | ---: |
| Precision | 1.00 |
| Recall | 1.00 |
| F1 | 1.00 |

## Test Cases

| # | Case | Expected result |
| ---: | --- | --- |
| 1 | The project meeting is scheduled for 3:00 PM. | Safe, unchanged |
| 2 | Please make this public event invitation more concise and upbeat. | Safe, unchanged |
| 3 | Volunteer ID VOL-4821 (Maria Lopez) missed her shift; SSN 123-45-6789. | Workforce ID, contact, government identifier |
| 4 | Ask Jordan Patel to call 312-555-0198 or email jordan.patel@example.org. | Contact information |
| 5 | The API key ak_live_1234567890abcdef was pasted next to password: River!2026. | Credentials |
| 6 | Patient ID PAT-1042 has a diabetes diagnosis and prescription metformin. | Medical or sensitive personal information |
| 7 | Bank account 000123456789 and routing number 021000021 are in the draft. | Financial identifiers |
| 8 | Strictly confidential acquisition roadmap for Project Orion should not leave the team. | Confidential organizational/project information |
| 9 | Employee EMP-1024 and client ID CLI-7782 were mentioned in the support summary. | Employee/client information |
| 10 | The onboarding note includes driver license D1234567 for Taylor Brooks. | Government identifier and contact |
| 11 | Mail the badge to 1400 Cedar Street for Alex Chen. | Contact information |
| 12 | The public roadmap page lists broad themes without dates or customer details. | Safe, unchanged |
| 13 | Bearer eyJhbGciOiJIUzI1NiJ9.fake.token should be removed before asking for help. | Credential |
| 14 | The form says blood type O positive and medical record MRN-77881. | Medical or sensitive personal information |

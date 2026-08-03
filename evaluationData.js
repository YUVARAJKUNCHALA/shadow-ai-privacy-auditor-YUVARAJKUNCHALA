export const evaluationCases = [
  {
    name: "safe meeting sentence",
    text: "The project meeting is scheduled for 3:00 PM.",
    expected: []
  },
  {
    name: "safe rewrite request",
    text: "Please make this public event invitation more concise and upbeat.",
    expected: []
  },
  {
    name: "volunteer and SSN",
    text: "Volunteer ID VOL-4821 (Maria Lopez) missed her shift; SSN 123-45-6789.",
    expected: ["workforce", "contact", "identifier"]
  },
  {
    name: "email and phone",
    text: "Ask Jordan Patel to call 312-555-0198 or email jordan.patel@example.org.",
    expected: ["contact", "contact", "contact"]
  },
  {
    name: "credential",
    text: "The API key ak_live_1234567890abcdef was pasted next to password: River!2026.",
    expected: ["credential", "credential"]
  },
  {
    name: "medical note",
    text: "Patient ID PAT-1042 has a diabetes diagnosis and prescription metformin.",
    expected: ["medical"]
  },
  {
    name: "bank account",
    text: "Bank account 000123456789 and routing number 021000021 are in the draft.",
    expected: ["identifier", "identifier"]
  },
  {
    name: "confidential acquisition",
    text: "Strictly confidential acquisition roadmap for Project Orion should not leave the team.",
    expected: ["confidential"]
  },
  {
    name: "employee id",
    text: "Employee EMP-1024 and client ID CLI-7782 were mentioned in the support summary.",
    expected: ["workforce", "workforce"]
  },
  {
    name: "driver license",
    text: "The onboarding note includes driver license D1234567 for Taylor Brooks.",
    expected: ["identifier", "contact"]
  },
  {
    name: "street address",
    text: "Mail the badge to 1400 Cedar Street for Alex Chen.",
    expected: ["contact", "contact"]
  },
  {
    name: "safe public roadmap wording",
    text: "The public roadmap page lists broad themes without dates or customer details.",
    expected: []
  },
  {
    name: "bearer token",
    text: "Bearer eyJhbGciOiJIUzI1NiJ9.fake.token should be removed before asking for help.",
    expected: ["credential"]
  },
  {
    name: "blood type",
    text: "The form says blood type O positive and medical record MRN-77881.",
    expected: ["medical"]
  }
];

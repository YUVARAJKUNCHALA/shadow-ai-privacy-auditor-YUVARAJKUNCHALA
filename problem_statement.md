# CDF Shadow AI Hackathon - Submission Guide

## Challenge Overview

This hackathon asks participants to build a "Shadow AI Privacy Auditor": a tool that helps users identify and remove sensitive or confidential information from their text before they share it with a public AI tool such as ChatGPT, Gemini, or Copilot.

The evaluation framework prioritizes accuracy of sensitive-information detection, usability and clarity, responsible privacy and security design, creativity and practical value, and presentation and demonstration.

## Core Tier 1 Requirements

**Text Input:** The tool must let a user paste or type the text they intend to send to an AI platform.

**Detection Engine:** The system must detect at least four of six categories of sensitive information: names and contact information; government or financial identifiers; passwords, API keys, or access credentials; medical or sensitive personal information; employee, client, or volunteer information; confidential organizational or project information.

**Highlighting & Explanation:** Detected information must be visually highlighted, categorized, and accompanied by a short explanation of why it may be risky.

**Review & Redaction:** The user must be able to review the findings and generate a safer, redacted version of the text. Safe sentences such as "The project meeting is scheduled for 3:00 PM" must remain unchanged.

**Testing:** The solution must be tested with at least 10 fictional test cases, including safe examples.

**Responsible Data Use:** Teams must use only fictional or synthetic examples and must not collect, store, or use real personal, medical, financial, immigration, employee, volunteer, or organizational data.

## Submission Requirements

Participants must provide a working prototype and code in a repository, a short explanation of how detection works, at least 10 fictional test cases and results, known limitations and future improvements, a live deployment URL, and a 3 to 5 minute walkthrough video.

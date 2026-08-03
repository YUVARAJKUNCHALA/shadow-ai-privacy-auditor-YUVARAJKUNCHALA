import { categories, redactText, scanText } from "./scanner.js";

const sampleText = `Volunteer ID VOL-4821 (Maria Lopez) missed her shift; SSN 123-45-6789.
The project meeting is scheduled for 3:00 PM.
The API key ak_live_1234567890abcdef was pasted into the draft.
Strictly confidential acquisition roadmap for Project Orion should stay internal.`;

const input = document.querySelector("#inputText");
const highlighted = document.querySelector("#highlightedText");
const findingsList = document.querySelector("#findingsList");
const redacted = document.querySelector("#redactedText");
const count = document.querySelector("#findingCount");
const copyButton = document.querySelector("#copyButton");
const safeButton = document.querySelector("#sampleSafe");
const riskyButton = document.querySelector("#sampleRisky");

let findings = [];
let decisions = {};

input.value = sampleText;
render();

input.addEventListener("input", render);
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(redacted.value);
  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1200);
});

safeButton.addEventListener("click", () => {
  input.value = "The project meeting is scheduled for 3:00 PM. Please make the public announcement shorter.";
  render();
});

riskyButton.addEventListener("click", () => {
  input.value = sampleText;
  render();
});

function render() {
  findings = scanText(input.value);
  decisions = Object.fromEntries(findings.map((finding) => [finding.id, decisions[finding.id] ?? "redact"]));
  count.textContent = `${findings.length} finding${findings.length === 1 ? "" : "s"}`;
  highlighted.innerHTML = renderHighlights(input.value, findings);
  findingsList.innerHTML = renderFindings(findings);
  redacted.value = redactText(input.value, findings, decisions);

  for (const button of findingsList.querySelectorAll("button[data-id]")) {
    button.addEventListener("click", () => {
      decisions[button.dataset.id] = button.dataset.action;
      redacted.value = redactText(input.value, findings, decisions);
      findingsList.innerHTML = renderFindings(findings);
      for (const nextButton of findingsList.querySelectorAll("button[data-id]")) {
        nextButton.addEventListener("click", () => {
          decisions[nextButton.dataset.id] = nextButton.dataset.action;
          redacted.value = redactText(input.value, findings, decisions);
          findingsList.innerHTML = renderFindings(findings);
        });
      }
    });
  }
}

function renderHighlights(text, items) {
  if (items.length === 0) return escapeHtml(text);
  let cursor = 0;
  let html = "";

  for (const item of items) {
    html += escapeHtml(text.slice(cursor, item.start));
    html += `<mark class="finding ${item.category}" title="${escapeHtml(item.categoryLabel)}">${escapeHtml(text.slice(item.start, item.end))}</mark>`;
    cursor = item.end;
  }

  return html + escapeHtml(text.slice(cursor));
}

function renderFindings(items) {
  if (items.length === 0) {
    return `<li class="empty">No sensitive spans found. Safe text stays unchanged.</li>`;
  }

  return items
    .map((item) => {
      const decision = decisions[item.id] ?? "redact";
      const category = categories[item.category];
      return `<li class="finding-card">
        <div>
          <span class="tag ${item.category}">${escapeHtml(category.label)}</span>
          <strong>${escapeHtml(item.text)}</strong>
        </div>
        <p>${escapeHtml(item.explanation)}</p>
        <small>Model label: ${escapeHtml(item.modelLabel)} · confidence ${item.confidence}</small>
        <div class="actions">
          <button class="${decision === "redact" ? "active" : ""}" data-id="${item.id}" data-action="redact">Redact</button>
          <button class="${decision === "keep" ? "active" : ""}" data-id="${item.id}" data-action="keep">Keep</button>
        </div>
      </li>`;
    })
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

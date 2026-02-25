# Telegraph Customer Survey

## Project Overview

Single-page customer feedback survey for Telegraph (telegraph.io), a B2B SaaS company in the rail logistics space. The survey is a self-contained HTML file using React 18 via CDN — no build step, no bundler, no Node.js required.

**Live deployment target:** Netlify (static hosting, drag-and-drop deploy)

## Architecture

- **Single file:** `index.html` contains everything — styles, compiled React JS, and markup
- **Source JSX:** If you need to edit the React components, extract the JS from the `<script>` tag, edit as JSX, and recompile with Babel: `npx babel --presets @babel/preset-react app.jsx -o app.js`
- **No backend:** Survey submission needs to be wired to HubSpot Forms API (client-side POST)
- **No database:** HubSpot is the system of record

## Brand

- Dark navy background: `#0B1221`
- Atomic green accent: `#00D26A`
- White text on dark
- Fonts: DM Sans (UI) + Source Serif 4 (headings) via Google Fonts CDN
- Reference: https://telegraph.io

## Survey Questions (5 total)

1. **Operational Impact** (choice) — "How has Telegraph impacted your rail logistics operations?"
2. **Support Quality** (choice) — "How easy is it to get what you need from our team?"
3. **CSAT** (choice) — "Overall, how satisfied are you with Telegraph?"
4. **Referral** (yes/no choice) — "Would you be willing to refer Telegraph to a colleague?"
5. **G2 Review** (yes/no choice) — "Would you be willing to leave a review for Telegraph on G2?" — includes $25 gift card incentive

**Conditional logic:** G2 question (Q5) is skipped if CSAT answer is Neutral, Dissatisfied, or Very dissatisfied.

## Remaining Work

### 1. Wire up HubSpot Forms API (the main TODO)

When the user clicks Submit, POST the answers to HubSpot. Use the client-side Forms API — no backend needed.

**Steps:**
1. Create a form in HubSpot with these fields (as single-line text or dropdown):
   - `telegraph_impact` (dropdown)
   - `telegraph_support` (dropdown)  
   - `telegraph_csat` (dropdown)
   - `telegraph_referral` (dropdown: Yes/No)
   - `telegraph_g2_review` (dropdown: Yes/No)
2. Get the Portal ID and Form GUID from HubSpot
3. Add the fetch call in the `handleNext` function where `setSubmitted(true)` is called

**HubSpot Forms API endpoint:**
```
POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
Content-Type: application/json

{
  "fields": [
    { "objectTypeId": "0-1", "name": "telegraph_impact", "value": "Significant, measurable improvement" },
    { "objectTypeId": "0-1", "name": "telegraph_support", "value": "Very easy — consistently available and proactive" },
    { "objectTypeId": "0-1", "name": "telegraph_csat", "value": "Very satisfied" },
    { "objectTypeId": "0-1", "name": "telegraph_referral", "value": "Yes" },
    { "objectTypeId": "0-1", "name": "telegraph_g2_review", "value": "Yes" }
  ],
  "context": {
    "pageUri": window.location.href,
    "pageName": "Telegraph Customer Survey"
  }
}
```

**No API key needed** — HubSpot Forms API is public (the form GUID acts as the identifier). This is their intended client-side integration pattern.

### 2. Optional: Add email field

To tie submissions to existing HubSpot contacts, add an email field. Options:
- Add it as a 6th question before submit
- OR pass it as a URL parameter (e.g., `?email=name@company.com`) from the survey invitation email and include it silently in the form submission

The URL parameter approach is better UX — no extra question, and the customer is already identified from the email you sent them.

### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy (from project root)
netlify deploy --prod --dir=.

# Or just drag the folder to app.netlify.com/drop
```

## Internal Scorecard

After submission, there's a "View Internal Scorecard" button (visible to anyone with the URL). This computes:
- CSAT score (1-5)
- Support Quality score (1-4)  
- Operational Impact score (1-5)
- Account Health Score (composite percentage)
- Follow-up action flags

This is a prototype feature for team review. In production, this data lives in HubSpot — consider removing the scorecard button or gating it behind a URL parameter like `?admin=true`.

## File Structure

```
telegraph-survey/
├── CLAUDE.md          ← You are here
├── README.md          ← Setup + deploy instructions
└── index.html         ← The entire survey (self-contained)
```

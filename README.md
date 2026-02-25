# Telegraph Customer Survey

Customer feedback survey for Telegraph. 5 questions, all multiple choice, dark-themed to match telegraph.io branding.

## Quick Start

```bash
# Preview locally — just open in a browser
open index.html
```

No dependencies, no build step. The file loads React from a CDN.

## Deploy to Netlify

### Option A: Netlify Drop (no CLI)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder onto the page
3. You'll get a live URL instantly

### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

## Wire Up HubSpot

The survey currently runs as a prototype — answers are shown in the browser but not saved anywhere. To capture responses in HubSpot:

### Step 1: Create HubSpot contact properties

In HubSpot, go to **Settings → Properties → Contact Properties** and create:

| Property Name | Label | Field Type |
|---|---|---|
| `telegraph_impact` | Telegraph — Operational Impact | Dropdown |
| `telegraph_support` | Telegraph — Support Quality | Dropdown |
| `telegraph_csat` | Telegraph — CSAT | Dropdown |
| `telegraph_referral` | Telegraph — Willing to Refer | Dropdown (Yes/No) |
| `telegraph_g2_review` | Telegraph — Willing to Review on G2 | Dropdown (Yes/No) |

### Step 2: Create a HubSpot form

Go to **Marketing → Forms → Create Form**. Add all 5 properties above. Publish the form and note the:
- **Portal ID** (found in HubSpot account settings)
- **Form GUID** (shown in the form URL after publishing)

### Step 3: Connect the survey

Open `index.html` and find the comment `// TODO: HUBSPOT SUBMISSION`. Replace the placeholder with your Portal ID and Form GUID.

The submission uses HubSpot's public Forms API — no API key required.

### Step 4: Identify respondents

To automatically link survey responses to HubSpot contacts, send the survey URL with the customer's email appended:

```
https://your-survey.netlify.app/?email=customer@company.com
```

The survey reads this parameter and includes it in the HubSpot form submission, which matches it to the existing contact record.

## Survey Logic

- Questions 1–4 are always shown
- Question 5 (G2 review) is **skipped** if the customer answers Neutral, Dissatisfied, or Very dissatisfied on CSAT (Q3)
- Selecting "Yes" on G2 shows a tip card with review guidance

## Editing the Survey

The survey is compiled React — the `<script>` tag contains plain JavaScript (no JSX). To make changes:

```bash
# Extract the JS, edit as JSX, then recompile
npx -y @babel/cli @babel/preset-react
# Edit your .jsx file
npx babel --presets @babel/preset-react app.jsx -o app.js
# Paste app.js back into index.html's <script> tag
```

Or just ask Claude Code to make the changes — it can edit the compiled JS directly for small tweaks.

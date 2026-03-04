# UNMISS HRD – Q4 2025 Violence Affecting Civilians Dashboard

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-009EDB?style=flat-square&logo=github)](https://mafiatun.github.io/unmiss-hrd-q4-report-data/)

Interactive data visualization companion to the UNMISS Human Rights Division quarterly brief on violence affecting civilians in South Sudan (October–December 2025).

---

## Live Demo

**→ [View Dashboard (GitHub Pages)](https://mafiatun.github.io/unmiss-hrd-q4-report-data/)**

---

## Overview

| Field | Value |
|-------|--------|
| **Organization** | UNMISS Human Rights Division |
| **Period** | Q4 2025 (October – December) |
| **Location** | South Sudan |
| **Data source** | UNMISS HRD Incident Database 2025 |
| **License** | © 2025 UNMISS HRD · For advocacy and awareness |

---

## Pages

| Page | Description |
|------|-------------|
| **Overview** | Q4 highlights, violation breakdown, quarterly/monthly trends, perpetrator & state summaries |
| **Gender** | Full gender-disaggregated analysis across violations, states, perpetrators & quarters |
| **Perpetrators** | Actor attribution deep-dive: community militias, conventional parties, opportunistic elements |
| **Geographic** | State → County → Payam hotspot analysis with heatmaps and tables |
| **SGBV** | Sexual & gender-based violence analysis with support services indicators |
| **Maps** | Interactive Leaflet maps (casualty, perpetrator, SGBV) with quarter/violation filters |

---

## Data

Source: `documents/Yearly 2025 updates.xlsx` — UNMISS HRD Incident Database 2025. The `documents/` folder (Excel, PDF, DOCX) is local-only and not uploaded to GitHub.

**Sheets used:**
- **Matrix** — Casualty data (Killed · Injured · Abducted · CRSV) with state, county, payam, gender and perpetrator fields
- **SGBV** — Sexual & gender-based violence cases with service access indicators
- **Yearly casualty trend** — Multi-year monthly trend by perpetrator group (2023–2025)

---

## Setup / Regenerate Data

```bash
cd "Q4 report"
pip3 install pandas openpyxl
python3 extract_data.py   # regenerates js/data.js from documents/Yearly 2025 updates.xlsx
```

---

## GitHub Pages Deployment

1. Push to a GitHub repository
2. Go to **Settings → Pages** → Source: `main` branch, `/ (root)` folder
3. Site will be live at `https://<username>.github.io/<repo-name>/`

No build step required — pure static HTML/CSS/JS.

---

## Tech Stack

- [Plotly.js](https://plotly.com/javascript/) — interactive charts
- [Leaflet.js](https://leafletjs.com/) — interactive maps (CartoDB dark tiles)
- [Inter](https://fonts.google.com/) & [Space Grotesk](https://fonts.google.com/) — typography
- Pure HTML/CSS/JS — no framework, no build tool

---

## Notes

Data is non-exhaustive and likely underrepresents the actual scale of harm. UNMISS HRD investigations were constrained by limited resources, access denials, and fear of reprisals. SGBV is significantly underreported due to social stigma.

---

---

## GitHub Repository Setup

To complete the repo metadata, go to your repo on GitHub → **About** (top right) → **Edit** and set:

| Field | Value |
|-------|--------|
| **Description** | Interactive Q4 2025 violence dashboard for UNMISS HRD · South Sudan civilian casualties |
| **Website** | https://mafiatun.github.io/unmiss-hrd-q4-report-data/ |
| **Topics** | `unmiss` `human-rights` `south-sudan` `data-visualization` `dashboard` `un` `humanitarian` `conflict-monitoring` `leaflet` `plotly` |

---

© 2025 UNMISS Human Rights Division · For advocacy and awareness purposes

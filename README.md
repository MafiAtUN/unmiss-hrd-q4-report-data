# UNMISS HRD – Q4 2025 Violence Affecting Civilians Dashboard

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-009EDB?style=flat-square&logo=github)](https://mafiatun.github.io/unmiss-hrd-q4-report-data/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Static](https://img.shields.io/badge/Static-HTML%2FCSS%2FJS-34d399?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web)

Interactive data visualization companion to the UNMISS Human Rights Division quarterly brief on violence affecting civilians in South Sudan (October–December 2025).

---

## Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Data & Architecture](#data--architecture)
- [Setup](#setup--regenerate-data)
- [Development](#development)
- [Deployment](#github-pages-deployment)
- [License](#license)

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
| **License** | [MIT](LICENSE) · Mafizul Islam |

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

## Project Structure

```
Q4 report/
├── index.html          # Overview page (KPIs, trends, summaries)
├── gender.html         # Gender-disaggregated analysis
├── perpetrators.html   # Perpetrator attribution analysis
├── geographic.html     # State → County → Payam hotspots
├── sgbv.html           # Sexual & gender-based violence analysis
├── maps.html           # Interactive Leaflet maps (casualty, perpetrator, SGBV)
├── extract_data.py     # Data pipeline: Excel → js/data.js
├── js/
│   ├── data.js        # Auto-generated: UNMISS_DATA (do not edit)
│   ├── utils.js       # Shared: colours, Plotly config, download helpers, D accessors
│   ├── overview.js    # Overview page charts
│   ├── gender.js      # Gender page charts
│   ├── geographic.js   # Geographic page charts
│   ├── perpetrators.js # Perpetrators page charts
│   ├── sgbv.js        # SGBV page charts
│   └── maps.js        # Leaflet maps, markers, popups, filters
├── css/
│   └── style.css      # Dark theme, UN palette, responsive layout
├── assets/             # Logo, GeoJSON (south-sudan.geojson)
└── documents/          # Local only: Excel, PDF, DOCX (gitignored)
```

---

## Data & Architecture

**Data source:** `documents/Yearly 2025 updates.xlsx` — UNMISS HRD Incident Database 2025. The `documents/` folder is local-only and not uploaded to GitHub.

**Data flow:** `extract_data.py` reads Excel sheets → aggregates by quarter, state, perpetrator, county, payam → writes `js/data.js` with `UNMISS_DATA` global. All HTML pages load `data.js` and `utils.js`; page-specific scripts (`overview.js`, `gender.js`, etc.) render Plotly charts and populate DOM from `D` (alias for `UNMISS_DATA`).

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

## Development

- **Local preview:** Open `index.html` directly in a browser, or run a simple server: `python3 -m http.server 8000` then visit `http://localhost:8000`
- **Data changes:** Edit `documents/Yearly 2025 updates.xlsx` and run `python3 extract_data.py` to regenerate `js/data.js`
- **Chart changes:** Edit the corresponding `js/*.js` file (e.g. `overview.js` for Overview page)
- **Styling:** Edit `css/style.css`; uses CSS variables (`:root`) for colours and spacing
- **Maps:** `js/maps.js` handles Leaflet setup, marker clustering, popups; `maps.html` includes hash anchors for deep links (`#casualty`, `#perp`, `#sgbv`)

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

## Project Structure

| Path | Description |
|------|-------------|
| `index.html`, `gender.html`, etc. | Dashboard pages |
| `js/data.js` | Auto-generated data (run `extract_data.py`) |
| `js/utils.js` | Shared utilities, colours, Plotly config |
| `js/overview.js`, `js/gender.js`, etc. | Page-specific chart logic |
| `js/maps.js` | Leaflet maps (casualty, perpetrator, SGBV) |
| `css/style.css` | Shared stylesheet |
| `extract_data.py` | Excel → `data.js` extraction script |

See **[DOCUMENTATION.md](DOCUMENTATION.md)** for detailed technical documentation, data flow, and extension guide.

---

## Notes

Data is non-exhaustive and likely underrepresents the actual scale of harm. UNMISS HRD investigations were constrained by limited resources, access denials, and fear of reprisals. SGBV is significantly underreported due to social stigma.

---

## GitHub Repository Setup

To complete the repo metadata, go to your repo on GitHub → **About** (top right) → **Edit** and set:

| Field | Value |
|-------|--------|
| **Description** | Interactive Q4 2025 violence dashboard for UNMISS HRD · South Sudan civilian casualties |
| **Website** | https://mafiatun.github.io/unmiss-hrd-q4-report-data/ |
| **Topics** | `unmiss` `human-rights` `south-sudan` `data-visualization` `dashboard` `un` `humanitarian` `conflict-monitoring` `leaflet` `plotly` |

---

**License:** [MIT](LICENSE) · Copyright (c) 2025 [Mafizul Islam](https://github.com/MafiAtUN) · [LinkedIn](https://www.linkedin.com/in/mafizul/) · [islam50@un.org](mailto:islam50@un.org)

UNMISS HRD data used for advocacy and awareness purposes.

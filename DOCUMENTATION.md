# UNMISS HRD Q4 Dashboard — Technical Documentation

Technical documentation for the UNMISS Human Rights Division Q4 2025 Violence Affecting Civilians Dashboard. This guide describes the project architecture, file structure, data flow, and how to extend or maintain the codebase.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [File Structure](#file-structure)
3. [Data Flow](#data-flow)
4. [Key Components](#key-components)
5. [Extending the Dashboard](#extending-the-dashboard)

---

## Project Architecture

The dashboard is a **static multi-page web application**—no build step, no server runtime. It consists of:

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Data extraction** | Python (pandas, openpyxl) | Reads Excel → generates `js/data.js` |
| **Data storage** | JavaScript object (`UNMISS_DATA`) | In-memory data consumed by all pages |
| **Charts** | Plotly.js | Interactive donuts, bars, heatmaps, lines |
| **Maps** | Leaflet.js + CartoDB tiles | Interactive casualty/perpetrator/SGBV maps |
| **Styles** | Pure CSS | Dark theme, UN blue accent, responsive layout |
| **Structure** | HTML5 | Semantic markup, accessible navigation |

---

## File Structure

```
Q4 report/
├── index.html          # Overview page — KPIs, trends, summaries
├── gender.html         # Gender-disaggregated analysis
├── perpetrators.html   # Perpetrator attribution analysis
├── geographic.html     # State/county/payam geographic analysis
├── sgbv.html           # Sexual & gender-based violence analysis
├── maps.html           # Interactive maps (casualty, perpetrator, SGBV)
├── css/
│   └── style.css       # Shared stylesheet (variables, layout, charts, maps)
├── js/
│   ├── data.js         # Auto-generated: UNMISS_DATA (run extract_data.py)
│   ├── utils.js        # Shared: colours, Plotly config, download helpers, data accessors
│   ├── overview.js    # Overview page charts & KPIs
│   ├── gender.js       # Gender page charts
│   ├── geographic.js   # Geographic page charts
│   ├── perpetrators.js # Perpetrators page charts
│   ├── sgbv.js         # SGBV page charts
│   └── maps.js         # Leaflet maps logic (casualty, perpetrator, SGBV)
├── assets/
│   ├── logo.png        # UNMISS HRD logo
│   └── south-sudan.geojson  # South Sudan boundary (optional)
├── documents/          # Local only — Excel, PDF, DOCX (not in git)
│   └── Yearly 2025 updates.xlsx
├── extract_data.py     # Python script — Excel → data.js
├── README.md           # User-facing project overview
├── DOCUMENTATION.md    # This file — technical docs
├── LICENSE             # MIT
└── .gitignore
```

---

## Data Flow

### 1. Source Data

- **Excel**: `documents/Yearly 2025 updates.xlsx`  
- **Sheets**: Matrix (casualties), SGBV, Yearly casualty trend

### 2. Extraction (`extract_data.py`)

1. Loads Matrix sheet → normalizes violations, quarters, perpetrators, gender
2. Loads SGBV sheet → adds service-access indicators
3. Aggregates by state, county, payam, quarter, perpetrator, violation
4. Builds location arrays with lat/long for maps
5. Outputs `js/data.js` as a single JavaScript object `UNMISS_DATA`

### 3. Data Structure (`UNMISS_DATA`)

| Key | Description |
|-----|-------------|
| `q4` | Q4 totals: total, killed, injured, abducted, crsv, gender, by_violation_gender |
| `quarterly` | Q1–Q4 summaries for trend charts |
| `q4_by_state` | Per-state breakdown (violations, gender, perpetrator) |
| `q4_by_perpetrator` | Per-perpetrator breakdown |
| `q4_by_county` | Per-county totals for geographic analysis |
| `q4_by_payam` | Per-payam totals |
| `q4_locations` | Q4 incidents with lat/long (for casualty map) |
| `all_locations` | All quarters with lat/long (for map quarter filter) |
| `sgbv` | SGBV aggregates, q4_by_state, q4_locations |
| `crsv_sgbv` | CRSV vs SGBV per quarter (comparative charts) |
| `monthly_2025` | Monthly totals by violation and perpetrator |
| `yearly_trend` | Multi-year monthly trend by perpetrator group |

### 4. Page Scripts

Each page script (`overview.js`, `gender.js`, etc.) runs on `DOMContentLoaded` and:

1. Reads `D` (alias for `UNMISS_DATA`) and page-specific data
2. Populates KPI elements with `setCount` / `setEl` / `animateCounter`
3. Renders Plotly charts via `makeChart`, `donutTrace`, `stackedBarTraces`
4. Uses `utils.js` for colours (`C`, `vColor`, `pColor`), formatting (`fmt`, `pct`)

---

## Key Components

### `js/utils.js`

- **C**: Colour palette (violations, gender, perpetrators, states)
- **baseLayout, plotlyConfig**: Plotly defaults (dark theme)
- **makeChart**: Wrapper for Plotly.newPlot with base layout
- **downloadBlob, downloadCSV, downloadJSON**: Export helpers
- **downloadChartAsPNG, downloadChartData, addChartDownloadButtons**: Chart export
- **D, VIOLATIONS, QUARTERS, STATES, PERPS**: Data constants
- **pct, fmt, changeVsQ3, changePct**: Formatting
- **donutTrace, stackedBarTraces, hBarLayout**: Chart helpers
- **highlightNav, initCounters, initFooterDownloads**: Page init

### `js/maps.js`

- **STATE_CENTROIDS**: Fallback lat/lng for incidents without coordinates
- **bubbleRadius, sgbvRadius**: Map circle sizing
- **violFill, perpFill**: Circle colours by violation/perpetrator
- **offsetForViol, offsetForPerp**: Avoid overlapping markers at same location
- **buildCasualtyMap, updateCasualtyMap**: Casualty map (violation-filtered circles)
- **buildPerpetratorMap, updatePerpetratorMap**: Perpetrator map (coloured by perpetrator)
- **buildSGBVMap, updateSGBVMap**: SGBV map
- **Hash routing**: `#casualty`, `#perp`, `#sgbv` scroll to top anchors

### `css/style.css`

- **:root**: CSS variables (colours, radius, shadows)
- **.navbar**: Sticky nav, dropdown for Maps
- **.page-header**: Page title, subtitle, meta
- **.chart-wrap, .plotly-chart**: Chart layout
- **.map-wrapper, .map-panel**: Map layout
- **Responsive**: Breakpoints for mobile

---

## Extending the Dashboard

### Adding a new chart

1. Add a `<div id="chart-id" class="plotly-chart">` in the HTML
2. In the page JS, build traces and call `makeChart('chart-id', traces, layout)`
3. Download buttons are auto-added to `.chart-wrap` on load

### Adding a new data field

1. In `extract_data.py`, add the aggregation in the data dictionary
2. Run `python3 extract_data.py`
3. Use the new key in page scripts via `D.new_key`

### Adding a new page

1. Copy `index.html` or similar as template
2. Create `js/newpage.js` with `DOMContentLoaded` logic
3. Add nav link in all HTML files
4. Add `newpage.js` script to the new page

### Modifying map behaviour

- Edit `js/maps.js` — filter logic in `updateCasualtyMap` etc.
- State labels: `STATE_CENTROIDS`
- Popup content: `casPopup`, `perpPopup`, `sgbvPopup`

---

## Script Load Order

All HTML pages load scripts in this order:

1. Plotly (CDN)
2. html2canvas (CDN, for chart/map PNG export)
3. `js/data.js` — must load before utils (defines `UNMISS_DATA`)
4. `js/utils.js` — uses `UNMISS_DATA`
5. Page script (overview, gender, etc.)

---

*Documentation maintained with the project. For questions: [Mafizul Islam](https://github.com/MafiAtUN) · [islam50@un.org](mailto:islam50@un.org)*

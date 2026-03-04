# Contributing to UNMISS HRD Q4 2025 Dashboard

Thank you for your interest in contributing. This document outlines guidelines for development and contribution.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MafiAtUN/unmiss-hrd-q4-report-data.git
   cd unmiss-hrd-q4-report-data
   ```

2. **Data requirements**
   - Place `Yearly 2025 updates.xlsx` in the `documents/` folder (the folder is gitignored for confidentiality)
   - Install Python dependencies: `pip3 install pandas openpyxl`
   - Run `python3 extract_data.py` to generate `js/data.js`

3. **Local preview**
   ```bash
   python3 -m http.server 8000
   # Open http://localhost:8000 in a browser
   ```

## Code Style

- **JavaScript:** Use `const`/`let`, descriptive names, JSDoc for public functions
- **Python:** Follow PEP 8; add docstrings for functions and module-level comments for sections
- **CSS:** Use existing CSS variables (`--accent`, `--bg-card`, etc.); maintain dark theme consistency

## File Conventions

| File | Purpose |
|------|---------|
| `extract_data.py` | Do not change Excel column mapping without verifying output structure |
| `js/data.js` | Auto-generated — never edit manually |
| `js/utils.js` | Shared utilities — changes affect all pages |
| `css/style.css` | Single stylesheet — use existing variables where possible |

## Adding Charts

1. Add the chart container in the HTML (e.g. `<div id="my-chart" class="plotly-chart"></div>`)
2. In the page script (e.g. `overview.js`), use `makeChart()`, `donutTrace()`, `stackedBarTraces()`, etc. from `utils.js`
3. Download buttons (PNG, CSV) are auto-added to `.plotly-chart` elements via `utils.js`

## Data Structure (UNMISS_DATA)

Key objects in `D` (UNMISS_DATA):

- `q4` — Q4 totals, gender, by_violation_gender
- `quarterly` — Q1–Q4 summaries for trend charts
- `q4_by_state`, `q4_by_perpetrator` — breakdowns for donuts, bars, heatmaps
- `q4_locations`, `all_locations` — lat/long for maps (casualty data)
- `sgbv` — SGBV aggregates, q4_locations for SGBV map
- `yearly_trend` — Historical multi-year monthly data

See `extract_data.py` docstring and `js/utils.js` accessors for full schema.

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Ensure `extract_data.py` runs without errors and `data.js` is regenerated if Excel structure changed
4. Test locally in a browser
5. Submit a pull request with a clear description

## Contact

- **Author:** Mafizul Islam  
- **Email:** islam50@un.org  
- **GitHub:** [@MafiAtUN](https://github.com/MafiAtUN)  
- **LinkedIn:** [mafizul](https://www.linkedin.com/in/mafizul/)

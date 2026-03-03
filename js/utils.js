/* ============================================================
   UNMISS HRD Q4 2025 – Shared Utilities & Chart Config
   ============================================================ */

// ── Colour System (UN-friendly: UN Blue #009EDB) ──────────────
const C = {
  bg:         '#0c1f3a',
  bgCard:     '#122a4d',
  bgCard2:    '#163258',
  text:       '#e8f1fa',
  textMuted:  '#8ba8c4',
  textDim:    '#5a7a9a',
  border:     'rgba(0,158,219,0.2)',
  accent:     '#009EDB',
  accent2:    '#4da6e8',

  killed:    '#f43f5e',
  injured:   '#fb923c',
  abducted:  '#c084fc',
  crsv:      '#34d399',

  male:   '#60a5fa',
  female: '#f472b6',
  boys:   '#93c5fd',
  girls:  '#f9a8d4',

  militia:       '#fbbf24',
  conventional:  '#818cf8',
  opportunistic: '#34d399',

  states: {
    'Warrap':                    '#f43f5e',
    'Central Equatoria':         '#c084fc',
    'Unity':                     '#60a5fa',
    'Lakes':                     '#34d399',
    'Eastern Equatoria':         '#fb923c',
    'Western Equatoria':         '#2dd4bf',
    'Jonglei':                   '#a78bfa',
    'Upper Nile':                '#94a3b8',
    'Western Bahr el Ghazal':    '#f59e0b',
    'Northern Bahr el Ghazal':   '#ec4899',
  },

  quarters: { Q1: '#60a5fa', Q2: '#fbbf24', Q3: '#fb923c', Q4: '#f43f5e' },

  violationColors: () => [C.killed, C.injured, C.abducted, C.crsv],
  genderColors:    () => [C.male, C.female, C.boys, C.girls],
  perpColors:      () => [C.militia, C.conventional, C.opportunistic],
  stateColors:     () => Object.values(C.states),
};

// ── Plotly Base Layout ───────────────────────────────────────
const baseLayout = (overrides = {}) => ({
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font: { color: C.textMuted, family: 'Inter, system-ui, sans-serif', size: 12 },
  xaxis: {
    gridcolor:  'rgba(0,158,219,0.12)',
    color:      C.textMuted,
    linecolor:  'rgba(0,158,219,0.2)',
    tickfont:   { size: 11 },
    zeroline: false,
  },
  yaxis: {
    gridcolor:  'rgba(0,158,219,0.12)',
    color:      C.textMuted,
    linecolor:  'rgba(0,158,219,0.2)',
    tickfont:   { size: 11 },
    zeroline: false,
  },
  legend: {
    bgcolor: 'rgba(0,0,0,0)',
    bordercolor: 'rgba(0,0,0,0)',
    font: { size: 11, color: C.textMuted },
    orientation: 'h',
    x: 0, y: -0.18,
  },
  margin: { t: 30, r: 16, b: 50, l: 60 },
  hovermode: 'closest',
  hoverlabel: {
    bgcolor: C.bgCard2,
    bordercolor: 'rgba(0,158,219,0.5)',
    font: { size: 12, color: C.text },
  },
  ...overrides,
});

const plotlyConfig = {
  displayModeBar: false,
  displaylogo: false,
  responsive: true,
};

// Helper to make chart
function makeChart(id, traces, layout, config = {}) {
  Plotly.newPlot(id, traces, { ...baseLayout(), ...layout }, { ...plotlyConfig, ...config });
}

// ── Download helpers ─────────────────────────────────────────────────────────
function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadJSON(obj, filename = 'unmiss-data.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

function downloadCSV(rows, filename = 'data.csv') {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename);
}

// Extract chart data as CSV from Plotly trace (pie, bar, scatter, etc.)
function chartDataToCSV(divId) {
  const gd = document.getElementById(divId);
  if (!gd || !gd._fullData) return null;
  const data = gd._fullData;
  const rows = [];
  if (data.length === 0) return null;
  const first = data[0];

  if (first.type === 'pie' && first.labels && first.values) {
    rows.push(['Category', 'Value']);
    first.labels.forEach((l, i) => rows.push([l, first.values[i]]));
    return rows;
  }
  if (first.type === 'bar' && first.x && first.y) {
    const n = first.x.length;
    rows.push(['Category', ...data.map(t => t.name || 'Value')]);
    for (let i = 0; i < n; i++) {
      rows.push([first.x[i], ...data.map(t => t.y[i])]);
    }
    return rows;
  }
  if ((first.type === 'scatter' || first.type === 'scattergl') && first.x && first.y) {
    rows.push(['X', first.name || 'Y']);
    first.x.forEach((xv, i) => rows.push([xv, first.y[i]]));
    return rows;
  }
  return rows.length ? rows : null;
}

function sanitizeFilename(s) {
  if (!s || typeof s !== 'string') return 'chart';
  return s.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'chart';
}

function downloadChartAsPNG(containerOrChartId, filename, chartTitle) {
  const base = filename || sanitizeFilename(chartTitle) || 'chart';
  const container = typeof containerOrChartId === 'string'
    ? document.getElementById(containerOrChartId)?.closest('.chart-wrap')
    : containerOrChartId;
  const chart = container?.querySelector('.plotly-chart') || (typeof containerOrChartId === 'string' ? document.getElementById(containerOrChartId) : null);
  if (typeof html2canvas !== 'undefined' && container) {
    const btns = container.querySelector('.chart-download-actions');
    if (btns) btns.style.visibility = 'hidden';
    const footnote = document.createElement('div');
    footnote.className = 'chart-export-footnote';
    footnote.textContent = 'Data source: Human Rights Division, United Nations Mission in South Sudan';
    container.appendChild(footnote);
    html2canvas(container, { useCORS: true, backgroundColor: '#122a4d', scale: 2 })
      .then(canvas => {
        footnote.remove();
        if (btns) btns.style.visibility = '';
        const link = document.createElement('a');
        link.download = base + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      })
      .catch(() => {
        footnote.remove();
        if (btns) btns.style.visibility = '';
        if (chart) Plotly.downloadImage(chart, { format: 'png', filename: base, scale: 2 });
      });
  } else if (chart) {
    Plotly.downloadImage(chart, { format: 'png', filename: base, width: chart._fullLayout?.width || 800, height: chart._fullLayout?.height || 500, scale: 2 });
  }
}

function downloadChartData(divId, filename, chartTitle) {
  const rows = chartDataToCSV(divId);
  if (!rows) {
    console.warn('Could not extract data from chart:', divId);
    return;
  }
  const base = filename || sanitizeFilename(chartTitle) || divId;
  const DATA_SOURCE = 'Data source: Human Rights Division, United Nations Mission in South Sudan';
  const header = chartTitle
    ? [['Chart', chartTitle], [DATA_SOURCE], [], ...rows]
    : [[DATA_SOURCE], [], ...rows];
  downloadCSV(header, base + '.csv');
}

// Add download buttons to a chart container (call after Plotly.newPlot)
function addChartDownloadButtons(containerOrId, chartElOrId, filenameBase) {
  const container = typeof containerOrId === 'string' ? document.getElementById(containerOrId) : containerOrId;
  const chart = typeof chartElOrId === 'string' ? document.getElementById(chartElOrId) : chartElOrId;
  if (!container || !chart) return;
  const chartTitle = container.querySelector('.chart-title')?.textContent?.trim() || '';
  const base = filenameBase || sanitizeFilename(chartTitle) || (chart.id || chartElOrId) || 'chart';
  const existing = container.querySelector('.chart-download-actions');
  if (existing) return;
  const div = document.createElement('div');
  div.className = 'chart-download-actions';
  div.innerHTML = `
    <button type="button" class="btn-download-chart" title="Download chart as PNG">Download PNG</button>
    <button type="button" class="btn-download-data" title="Download underlying data as CSV">Download CSV</button>
  `;
  div.querySelector('.btn-download-chart').onclick = () => downloadChartAsPNG(container, base, chartTitle);
  div.querySelector('.btn-download-data').onclick = () => downloadChartData(chart.id || chartElOrId, base, chartTitle);
  const header = container.querySelector('.chart-header');
  if (header) {
    header.style.flexWrap = 'wrap';
    header.appendChild(div);
  } else {
    container.insertBefore(div, chart);
  }
}

// ── Data Helpers ─────────────────────────────────────────────
const D = UNMISS_DATA;

const VIOLATIONS = ['Killed', 'Injured', 'Abducted', 'CRSV'];
const QUARTERS   = ['Q1', 'Q2', 'Q3', 'Q4'];
const STATES     = [
  'Warrap', 'Central Equatoria', 'Unity', 'Lakes', 'Eastern Equatoria',
  'Western Equatoria', 'Jonglei', 'Upper Nile', 'Western Bahr el Ghazal',
  'Northern Bahr el Ghazal',
];
const PERPS = [
  'Community-based Militias',
  'Conventional Parties',
  'Unidentified/Opportunistic',
];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const GENDER_KEYS  = ['male','female','boys','girls'];
const GENDER_LABELS= ['Men','Women','Boys','Girls'];

// Shorthand accessors
const q4   = () => D.q4;
const q4St = (st) => D.q4_by_state[st] || { total:0, killed:0, injured:0, abducted:0, crsv:0, gender:{} };
const qAll = (q)  => D.quarterly[q];

// Report-style: whole numbers (71%, 50%) to match Q4 Brief
function pctRound(part, whole) {
  if (!whole) return 0;
  return Math.round(part / whole * 100);
}
function pct(part, whole) {
  return pctRound(part, whole) + '%';
}
function pctNum(part, whole) {
  return pctRound(part, whole);
}
function fmt(n) { return (n||0).toLocaleString(); }
function changeVsQ3(val) {
  const q3 = D.quarterly['Q3']?.total || 1;
  const diff = Math.round((val - q3) / q3 * 100);
  return diff > 0 ? `+${diff}%` : `${diff}%`;
}
function changePct(val, prev) {
  if (!prev) return '—';
  const diff = Math.round((val - prev) / prev * 100);
  return diff > 0 ? `+${diff}%` : `${diff}%`;
}

// ── Animated Counter ─────────────────────────────────────────
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const startVal = 0;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = fmt(current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
  });
}

// ── Change indicator HTML ─────────────────────────────────────
function changeHtml(val, prev) {
  if (!prev) return '<span class="change neutral">—</span>';
  const diff = Math.round((val - prev) / prev * 100);
  const cls = diff > 0 ? 'up' : 'down';
  const arrow = diff > 0 ? '↑' : '↓';
  return `<span class="change ${cls}">${arrow} ${Math.abs(diff)}%</span>`;
}

// ── Quarter color ─────────────────────────────────────────────
function qColor(q) { return C.quarters[q] || C.accent; }

// ── State color ───────────────────────────────────────────────
function stColor(state) { return C.states[state] || C.textMuted; }

// ── Violation color ───────────────────────────────────────────
function vColor(v) {
  return { Killed: C.killed, Injured: C.injured, Abducted: C.abducted, CRSV: C.crsv }[v] || C.accent;
}
function vColorByKey(k) {
  return { killed: C.killed, injured: C.injured, abducted: C.abducted, crsv: C.crsv }[k] || C.accent;
}

// ── Perpetrator color ─────────────────────────────────────────
function pColor(p) {
  if (p.includes('Community')) return C.militia;
  if (p.includes('Conventional')) return C.conventional;
  return C.opportunistic;
}

// ── Perpetrator short name ────────────────────────────────────
function pShort(p) {
  if (p.includes('Community')) return 'Community Militias';
  if (p.includes('Conventional')) return 'Conventional Parties';
  return 'Unidentified/Opportunistic';
}

// ── Sort states by Q4 total ───────────────────────────────────
function sortedStates() {
  return STATES
    .filter(s => D.q4_by_state[s])
    .sort((a,b) => (D.q4_by_state[b]?.total||0) - (D.q4_by_state[a]?.total||0));
}

// ── Top N counties ────────────────────────────────────────────
function topCounties(n = 15) {
  return Object.entries(D.q4_by_county)
    .sort((a,b) => b[1].total - a[1].total)
    .slice(0, n);
}

// ── Top N payams ──────────────────────────────────────────────
function topPayams(n = 15) {
  return Object.entries(D.q4_by_payam)
    .sort((a,b) => b[1].total - a[1].total)
    .slice(0, n);
}

// ── Insert KPI card value ─────────────────────────────────────
function setKpi(id, val) {
  const el = document.getElementById(id);
  if (el) el.dataset.count = val;
}

// ── Active nav highlighting ────────────────────────────────────
function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html') ||
        (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Shared plotly bar layout helpers ─────────────────────────
function hBarLayout(title, height = 380) {
  return baseLayout({
    title: { text: title, font: { size: 13, color: C.textMuted }, x: 0 },
    xaxis: {
      gridcolor: 'rgba(0,158,219,0.12)', color: C.textMuted,
      tickfont: { size: 11 }, zeroline: false,
    },
    yaxis: {
      gridcolor: 'rgba(0,0,0,0)', color: C.text,
      tickfont: { size: 11 }, automargin: true, zeroline: false,
    },
    height,
    margin: { t: 30, r: 16, b: 30, l: 150 },
    legend: { orientation: 'h', x: 0, y: -0.12 },
  });
}

function vBarLayout(title, height = 360) {
  return baseLayout({
    title: { text: title, font: { size: 13, color: C.textMuted }, x: 0 },
    height,
    margin: { t: 30, r: 16, b: 80, l: 50 },
    legend: { orientation: 'h', x: 0, y: -0.22 },
  });
}

function pieLayout(height = 340) {
  return baseLayout({
    height,
    margin: { t: 20, r: 10, b: 30, l: 10 },
    legend: { orientation: 'v', x: 1.02, y: 0.5, font: { size: 11 } },
  });
}

// ── Generate donut trace ─────────────────────────────────────
function donutTrace(labels, values, colors, hole = 0.52, name = '') {
  return {
    type: 'pie',
    hole,
    labels,
    values,
    marker: { colors, line: { color: C.bg, width: 2 } },
    textinfo: 'percent',
    textfont: { size: 12, color: C.text },
    hovertemplate: '<b>%{label}</b><br>%{value:,}<br>%{percent}<extra></extra>',
    pull: values.map(() => 0.02),
    name,
  };
}

// ── Generate stacked bar traces ───────────────────────────────
function stackedBarTraces(categories, seriesData) {
  // seriesData: [{name, values, color}]
  return seriesData.map(s => ({
    type: 'bar',
    name: s.name,
    x: categories,
    y: s.values,
    marker: { color: s.color },
    hovertemplate: `<b>${s.name}</b><br>%{x}<br>%{y:,}<extra></extra>`,
    barmode: 'stack',
  }));
}

// ── Render insight list ───────────────────────────────────────
function renderInsights(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<ul class="insight-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

// Auto-add download buttons to all Plotly charts after load
window.addEventListener('load', () => {
  document.querySelectorAll('.plotly-chart').forEach(chartEl => {
    const wrap = chartEl.closest('.chart-wrap');
    if (wrap && !wrap.querySelector('.chart-download-actions')) {
      addChartDownloadButtons(wrap, chartEl, chartEl.id || 'chart');
    }
  });
});

// Footer data download handlers
function initFooterDownloads() {
  const jsonBtn = document.getElementById('dl-all-json');
  const csvBtn = document.getElementById('dl-q4-csv');
  if (jsonBtn) {
    jsonBtn.onclick = (e) => { e.preventDefault(); if (typeof UNMISS_DATA !== 'undefined') downloadJSON(UNMISS_DATA, 'unmiss-hrd-q4-2025-data.json'); };
  }
  if (csvBtn) {
    csvBtn.onclick = (e) => {
      e.preventDefault();
      if (typeof UNMISS_DATA === 'undefined') return;
      const q = UNMISS_DATA.q4;
      const rows = [
        ['Metric', 'Value'],
        ['Total Victims', q.total],
        ['Killed', q.killed],
        ['Injured', q.injured],
        ['Abducted', q.abducted],
        ['CRSV', q.crsv],
        ['Male', q.gender?.male ?? ''],
        ['Female', q.gender?.female ?? ''],
        ['Boys', q.gender?.boys ?? ''],
        ['Girls', q.gender?.girls ?? ''],
        ['SGBV (separate)', UNMISS_DATA.sgbv?.q4?.total ?? ''],
      ];
      downloadCSV(rows, 'unmiss-hrd-q4-2025-summary.csv');
    };
  }
}

// Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  highlightNav();
  initCounters();
  initFooterDownloads();
});

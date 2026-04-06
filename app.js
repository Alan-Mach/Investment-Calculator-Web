let chart = null;
let lastData = null;

// Tab Switching Logic
async function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) contents[i].classList.remove("active");
    
    const links = document.getElementsByClassName("tab-link");
    for (let i = 0; i < links.length; i++) links[i].classList.remove("active");

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    if (tabName === 'about-tab') {
        await loadAboutMarkdown();
    }
}

async function loadAboutMarkdown() {
    const target = document.getElementById('markdown-target');
    
    // Only fetch if the container is empty to prevent re-init issues
    if (target.innerHTML.trim() !== "") return;

    try {
        const response = await fetch('./about.md');
        if (!response.ok) throw new Error("Documentation (about.md) not found.");
        
        const markdown = await response.text();
        
        // Convert Markdown to HTML using Marked.js
        target.innerHTML = marked.parse(markdown);

        // Waiting for the DOM to settle before typesetting
        setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([target])
                    .catch((err) => console.warn("MathJax formatting error:", err));
            }
        }, 10);

    } catch (err) {
        target.innerHTML = `<div style="color:#cf222e; padding: 20px; border: 1px solid #d0d7de; border-radius: 6px;">
            <strong>Setup Required:</strong> ${err.message}<br><br>
            Please create a file named <code>about.md</code> in your project root.
        </div>`;
    }
}

function updateLabels() {
    const mode = document.getElementById('mode').value;
    document.getElementById('main-label').innerText = 
        (mode === "1") ? "Target Portfolio Value (A) ($)" : "Initial Contribution (c) ($)";
}

// Emscripten callback
Module.onRuntimeInitialized = () => {
    document.getElementById('status').innerText = "Engine Ready";
};

function resetZoom() {
    if (chart) chart.resetZoom();
}

function run() {
    const mode = parseInt(document.getElementById('mode').value);
    const mainVal = parseFloat(document.getElementById('main-input').value);
    const r = parseFloat(document.getElementById('r').value) / 100;
    const i = parseFloat(document.getElementById('i').value) / 100;
    const t = parseInt(document.getElementById('t').value);
    const n = parseInt(document.getElementById('n').value);
    const useLog = document.getElementById('log-scale').checked;

    if (isNaN(mainVal) || t <= 0 || n <= 0) return;


    const totalPeriods = n * t;

    const ptr = Module.ccall('calculate_icif_table', 'number', 
        ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
        [mode === 1 ? mainVal : 0, mode === 2 ? mainVal : 0, r, i, t, n, mode]
    );

    const currentHeap = Module.HEAPF64 || HEAPF64;
    lastData = new Float64Array(currentHeap.buffer, ptr, totalPeriods * 4);

    const labels = [], cData = [], tcData = [], pvData = [];

    for (let k = 0; k < totalPeriods; k++) {
        labels.push(lastData[k * 4]);
        cData.push(lastData[k * 4 + 1]);
        tcData.push(lastData[k * 4 + 2]);
        pvData.push(lastData[k * 4 + 3]);
    }

    document.getElementById('download-btn').disabled = false;
    
    // Pass totalPeriods to the table renderer
    renderTable(totalPeriods);
    updateChart(labels, cData, tcData, pvData, useLog);
}

function renderTable(count) {
    const tbody = document.getElementById('table-body');
    const currency = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2 
    });
    
    let html = "";
    for (let k = 0; k < count; k++) {
        html += `<tr>
            <td>${lastData[k * 4]}</td>
            <td>${currency.format(lastData[k * 4 + 1])}</td>
            <td>${currency.format(lastData[k * 4 + 2])}</td>
            <td>${currency.format(lastData[k * 4 + 3])}</td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function updateChart(labels, c, tc, pv, useLog) {
    const ctx = document.getElementById('canvas').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Term Contribution', data: c, borderColor: '#0969da', tension: 0.1, radius: 0, borderWidth: 2 },
                { label: 'Cumulative Contributed', data: tc, borderColor: '#1a7f37', tension: 0.1, radius: 0, borderWidth: 2 },
                { label: 'Portfolio Value', data: pv, borderColor: '#cf222e', tension: 0.1, radius: 0, borderWidth: 2 }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false, axis: 'x' },
            scales: {
                y: {
                    type: useLog ? 'logarithmic' : 'linear',
                    ticks: { callback: (value) => '$' + value.toLocaleString() }
                },
                x: { title: { display: true, text: 'Period' } }
            },
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: 'xy', threshold: 5 },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' }
                }
            }
        }
    });
}

function downloadCSV() {
    if (!lastData) return;
    let csv = "Period,Contribution,Total Contributed,Portfolio Value\n";
    for (let i = 0; i < lastData.length; i += 4) {
        csv += `${lastData[i]},${lastData[i+1].toFixed(2)},${lastData[i+2].toFixed(2)},${lastData[i+3].toFixed(2)}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = "icif_results.csv"; a.click();
}
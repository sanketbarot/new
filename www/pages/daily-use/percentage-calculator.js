'use strict';

const $ = id => document.getElementById(id);
const pctType = $('pctType');
const pctVal1 = $('pctVal1');
const pctVal2 = $('pctVal2');

function fmtNum(num) {
    if (Math.abs(num) >= 1) return num.toLocaleString('en-IN', { maximumFractionDigits: 4 });
    return num.toFixed(4).replace(/\.?0+$/, '');
}

function updatePctType() {
    const type = pctType.value;
    const labels = {
        of: { l1: 'Percentage (%)', l2: 'Of Number', v1: 20, v2: 150 },
        is: { l1: 'Part Number', l2: 'Of Total Number', v1: 30, v2: 150 },
        change: { l1: 'Original Value', l2: 'New Value', v1: 100, v2: 150 },
        increase: { l1: 'Original Number', l2: 'Increase by (%)', v1: 100, v2: 25 },
        decrease: { l1: 'Original Number', l2: 'Decrease by (%)', v1: 100, v2: 25 }
    };
    const cfg = labels[type];
    $('pctLabel1').textContent = cfg.l1;
    $('pctLabel2').textContent = cfg.l2;
    pctVal1.value = cfg.v1;
    pctVal2.value = cfg.v2;
    calculatePct();
}

function calculatePct() {
    const v1 = parseFloat(pctVal1.value) || 0;
    const v2 = parseFloat(pctVal2.value) || 0;
    const type = pctType.value;
    
    let result, label, sub, breakdown, formula;
    
    switch (type) {
        case 'of':
            result = (v1 * v2) / 100;
            label = `${v1}% of ${v2} is`;
            sub = `Percentage of a number`;
            formula = `(${v1} × ${v2}) ÷ 100 = ${fmtNum(result)}`;
            breakdown = `
                <div class="tax-row"><span>Percentage</span><strong>${v1}%</strong></div>
                <div class="tax-row"><span>Number</span><strong>${v2}</strong></div>
                <div class="tax-row"><span>Formula</span><strong>${v1} × ${v2} ÷ 100</strong></div>
                <div class="tax-row total"><span>Result</span><strong style="color:#059669;">${fmtNum(result)}</strong></div>
            `;
            break;
            
        case 'is':
            if (v2 === 0) { showToast('⚠️ Cannot divide by zero'); return; }
            result = (v1 / v2) * 100;
            label = `${v1} is`;
            sub = `${fmtNum(result)}% of ${v2}`;
            formula = `(${v1} ÷ ${v2}) × 100 = ${fmtNum(result)}%`;
            breakdown = `
                <div class="tax-row"><span>Part</span><strong>${v1}</strong></div>
                <div class="tax-row"><span>Total</span><strong>${v2}</strong></div>
                <div class="tax-row"><span>Formula</span><strong>(${v1} ÷ ${v2}) × 100</strong></div>
                <div class="tax-row total"><span>Result</span><strong style="color:#059669;">${fmtNum(result)}%</strong></div>
            `;
            break;
            
        case 'change':
            if (v1 === 0) { showToast('⚠️ Cannot calculate change from zero'); return; }
            result = ((v2 - v1) / v1) * 100;
            label = `Change from ${v1} to ${v2}`;
            sub = result >= 0 ? `Increase` : `Decrease`;
            formula = `((${v2} - ${v1}) ÷ ${v1}) × 100 = ${fmtNum(result)}%`;
            breakdown = `
                <div class="tax-row"><span>Original</span><strong>${v1}</strong></div>
                <div class="tax-row"><span>New</span><strong>${v2}</strong></div>
                <div class="tax-row"><span>Difference</span><strong style="color:${v2 >= v1 ? '#059669' : '#DC2626'};">${v2 >= v1 ? '+' : ''}${fmtNum(v2 - v1)}</strong></div>
                <div class="tax-row total"><span>% Change</span><strong style="color:${result >= 0 ? '#059669' : '#DC2626'};">${result >= 0 ? '+' : ''}${fmtNum(result)}%</strong></div>
            `;
            break;
            
        case 'increase':
            const increase = (v1 * v2) / 100;
            result = v1 + increase;
            label = `${v1} increased by ${v2}% is`;
            sub = `Increase: ${fmtNum(increase)}`;
            formula = `${v1} + (${v1} × ${v2} ÷ 100) = ${fmtNum(result)}`;
            breakdown = `
                <div class="tax-row"><span>Original</span><strong>${v1}</strong></div>
                <div class="tax-row"><span>Increase %</span><strong>${v2}%</strong></div>
                <div class="tax-row"><span>Increase Amount</span><strong style="color:#059669;">+${fmtNum(increase)}</strong></div>
                <div class="tax-row total"><span>New Value</span><strong style="color:#059669;">${fmtNum(result)}</strong></div>
            `;
            break;
            
        case 'decrease':
            const decrease = (v1 * v2) / 100;
            result = v1 - decrease;
            label = `${v1} decreased by ${v2}% is`;
            sub = `Decrease: ${fmtNum(decrease)}`;
            formula = `${v1} - (${v1} × ${v2} ÷ 100) = ${fmtNum(result)}`;
            breakdown = `
                <div class="tax-row"><span>Original</span><strong>${v1}</strong></div>
                <div class="tax-row"><span>Decrease %</span><strong>${v2}%</strong></div>
                <div class="tax-row"><span>Decrease Amount</span><strong style="color:#DC2626;">-${fmtNum(decrease)}</strong></div>
                <div class="tax-row total"><span>New Value</span><strong style="color:#DC2626;">${fmtNum(result)}</strong></div>
            `;
            break;
    }
    
    $('pctResult').textContent = type === 'is' || type === 'change' ? fmtNum(result) + '%' : fmtNum(result);
    $('pctResultLabel').textContent = label;
    $('pctSub').textContent = sub;
    $('pctBreakdown').innerHTML = breakdown;
    
    // Common percentages of v2
    if (type === 'of') {
        const commons = [5, 10, 15, 20, 25, 50, 75, 100];
        $('pctCommon').innerHTML = commons.map(p => {
            const r = (p * v2) / 100;
            return `<div class="tax-row"><span>${p}% of ${v2}</span><strong>${fmtNum(r)}</strong></div>`;
        }).join('');
    } else {
        $('pctCommon').innerHTML = '';
    }
    
    $('pctInsight').textContent = `📐 Formula: ${formula}`;
}

function resetPct() {
    pctType.value = 'of';
    updatePctType();
    showToast('🔄 Reset!');
}

function copyPct() {
    const txt = `📊 Percentage Calculator\n\n${$('pctResultLabel').textContent} ${$('pctResult').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/percentage-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function sharePct() {
    shareContent('Percentage Calculator', `${$('pctResultLabel').textContent} ${$('pctResult').textContent}`, location.href);
}

[pctVal1, pctVal2].forEach(el => el.addEventListener('input', calculatePct));

document.addEventListener('DOMContentLoaded', () => {
    calculatePct();
    renderRelatedTools('percentage-calculator', 'daily-use', 6);
    console.log('✅ Percentage Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const cagrInitial = $('cagrInitial');
const cagrFinal = $('cagrFinal');
const cagrYears = $('cagrYears');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateCAGR() {
    const initial = parseFloat(cagrInitial.value) || 0;
    const final = parseFloat(cagrFinal.value) || 0;
    const years = parseFloat(cagrYears.value) || 0;
    
    if (initial <= 0 || final <= 0 || years <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
    const absoluteGrowth = ((final - initial) / initial) * 100;
    const multiple = final / initial;
    
    $('cagrValue').textContent = cagr.toFixed(2) + '%';
    $('cagrAbsolute').textContent = absoluteGrowth.toFixed(2) + '%';
    $('cagrMultiple').textContent = multiple.toFixed(2) + 'x';
    
    // Year-wise projection
    let projHTML = '';
    const intervals = years <= 5 ? 1 : years <= 10 ? 2 : 5;
    for (let yr = 0; yr <= years; yr += intervals) {
        if (yr > years) yr = years;
        const value = initial * Math.pow(1 + cagr/100, yr);
        projHTML += `<div class="tax-row"><span>Year ${yr}</span><strong>${fmtINR(value)}</strong></div>`;
        if (yr === years) break;
    }
    $('cagrProjection').innerHTML = projHTML;
    
    let insight = '';
    if (cagr >= 25) insight = `🚀 Outstanding ${cagr.toFixed(1)}% CAGR! Top-tier growth rate.`;
    else if (cagr >= 15) insight = `🎯 Excellent ${cagr.toFixed(1)}% CAGR! Beats market average.`;
    else if (cagr >= 10) insight = `👍 Good ${cagr.toFixed(1)}% CAGR! In line with stock market.`;
    else if (cagr >= 5) insight = `📊 Moderate ${cagr.toFixed(1)}% CAGR. Beats FD returns.`;
    else if (cagr >= 0) insight = `⚠️ Low ${cagr.toFixed(1)}% CAGR. Below inflation - lose purchasing power.`;
    else insight = `❌ Negative CAGR (${cagr.toFixed(1)}%). Value declining over time.`;
    $('cagrInsight').textContent = insight;
}

function resetCAGR() {
    cagrInitial.value = 100000;
    cagrFinal.value = 200000;
    cagrYears.value = 5;
    calculateCAGR();
    showToast('🔄 Reset!');
}

function copyCAGR() {
    const txt = `📈 CAGR Calculator\n\nInitial: ${fmtINR(parseFloat(cagrInitial.value))}\nFinal: ${fmtINR(parseFloat(cagrFinal.value))}\nYears: ${cagrYears.value}\n\nCAGR: ${$('cagrValue').textContent}\nGrowth: ${$('cagrAbsolute').textContent}\nMultiple: ${$('cagrMultiple').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/cagr-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareCAGR() {
    shareContent('CAGR Calculator', `My CAGR: ${$('cagrValue').textContent}`, location.href);
}

[cagrInitial, cagrFinal, cagrYears].forEach(el => el.addEventListener('input', calculateCAGR));

document.addEventListener('DOMContentLoaded', () => {
    calculateCAGR();
    renderRelatedTools('cagr-calculator', 'business', 6);
    console.log('✅ CAGR Calculator Loaded');
});
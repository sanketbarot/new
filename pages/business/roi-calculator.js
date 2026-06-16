'use strict';

const $ = id => document.getElementById(id);
const roiInitial = $('roiInitial');
const roiFinal = $('roiFinal');
const roiYears = $('roiYears');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateROI() {
    const initial = parseFloat(roiInitial.value) || 0;
    const final = parseFloat(roiFinal.value) || 0;
    const years = parseFloat(roiYears.value) || 0;
    
    if (initial <= 0 || years <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const profit = final - initial;
    const roi = (profit / initial) * 100;
    const annualized = (Math.pow(final / initial, 1 / years) - 1) * 100;
    
    $('roiPercent').textContent = roi.toFixed(2) + '%';
    $('roiProfit').textContent = (profit >= 0 ? '' : '-') + fmtINR(Math.abs(profit));
    $('roiAnnualized').textContent = annualized.toFixed(2) + '%';
    $('roiAnnualizedSub').textContent = annualized.toFixed(2) + '% per year';
    
    $('roiBreakdown').innerHTML = `
        <div class="tax-row"><span>Initial Investment</span><strong>${fmtINR(initial)}</strong></div>
        <div class="tax-row"><span>Final Value</span><strong>${fmtINR(final)}</strong></div>
        <div class="tax-row"><span>Time Period</span><strong>${years} years</strong></div>
        <div class="tax-row total"><span>${profit >= 0 ? 'Profit' : 'Loss'}</span><strong style="color:${profit >= 0 ? '#059669' : '#DC2626'};">${profit >= 0 ? '+' : ''}${fmtINR(profit)}</strong></div>
        <div class="tax-row"><span>Total ROI</span><strong>${roi.toFixed(2)}%</strong></div>
        <div class="tax-row"><span>Annualized ROI (CAGR)</span><strong>${annualized.toFixed(2)}%</strong></div>
    `;
    
    let insight = '';
    if (annualized >= 20) insight = `🚀 Outstanding! ${annualized.toFixed(1)}% annualized return is exceptional. Beats most investments!`;
    else if (annualized >= 12) insight = `🎯 Excellent! ${annualized.toFixed(1)}% beats stock market averages. Great investment!`;
    else if (annualized >= 7) insight = `👍 Good returns! ${annualized.toFixed(1)}% is in line with market averages.`;
    else if (annualized >= 0) insight = `📊 Modest returns. ${annualized.toFixed(1)}% is below market averages.`;
    else insight = `⚠️ Loss of ${Math.abs(annualized).toFixed(1)}% per year. Review investment strategy.`;
    $('roiInsight').textContent = insight;
}

function resetROI() {
    roiInitial.value = 100000;
    roiFinal.value = 150000;
    roiYears.value = 3;
    calculateROI();
    showToast('🔄 Reset!');
}

function copyROI() {
    const txt = `📈 ROI Calculator\n\nInitial: ${fmtINR(parseFloat(roiInitial.value))}\nFinal: ${fmtINR(parseFloat(roiFinal.value))}\nYears: ${roiYears.value}\n\nROI: ${$('roiPercent').textContent}\nAnnualized: ${$('roiAnnualized').textContent}\nProfit: ${$('roiProfit').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/roi-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareROI() {
    shareContent('ROI Calculator', `My ROI: ${$('roiPercent').textContent} (${$('roiAnnualized').textContent}/year)`, location.href);
}

[roiInitial, roiFinal, roiYears].forEach(el => el.addEventListener('input', calculateROI));

document.addEventListener('DOMContentLoaded', () => {
    calculateROI();
    renderRelatedTools('roi-calculator', 'business', 6);
    console.log('✅ ROI Calculator Loaded');
});
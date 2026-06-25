'use strict';

const $ = id => document.getElementById(id);
const siPrincipal = $('siPrincipal');
const siRate = $('siRate');
const siYears = $('siYears');
const siPrincipalRange = $('siPrincipalRange');
const siRateRange = $('siRateRange');
const siYearsRange = $('siYearsRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateSI() {
    const P = parseFloat(siPrincipal.value) || 0;
    const R = parseFloat(siRate.value) || 0;
    const T = parseFloat(siYears.value) || 0;
    
    if (P <= 0 || R <= 0 || T <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // SI = (P × R × T) / 100
    const SI = (P * R * T) / 100;
    const total = P + SI;
    
    $('siTotal').textContent = fmtINR(total);
    $('siPrincipalDisp').textContent = fmtINR(P);
    $('siInterest').textContent = fmtINR(SI);
    
    $('siBreakdown').innerHTML = `
        <div class="tax-row"><span>Principal (P)</span><strong>${fmtINR(P)}</strong></div>
        <div class="tax-row"><span>Rate (R)</span><strong>${R}% per annum</strong></div>
        <div class="tax-row"><span>Time (T)</span><strong>${T} year${T !== 1 ? 's' : ''}</strong></div>
        <div class="tax-row"><span>Calculation</span><strong style="font-size:11px;">${P} × ${R} × ${T} / 100</strong></div>
        <div class="tax-row total">
            <span>Simple Interest</span>
            <strong style="color:#059669;">${fmtINR(SI)}</strong>
        </div>
        <div class="tax-row">
            <span>Total Amount (P + SI)</span>
            <strong>${fmtINR(total)}</strong>
        </div>
    `;
    
    // CI comparison
    const CI = P * Math.pow(1 + R/400, 4 * T) - P;
    const diff = CI - SI;
    
    $('siInsight').textContent = `💡 SI = ${fmtINR(SI)}. If compounded quarterly, you'd earn ${fmtINR(diff)} more (CI = ${fmtINR(CI)}).`;
}

function setupSync() {
    siPrincipalRange.addEventListener('input', () => { siPrincipal.value = siPrincipalRange.value; calculateSI(); });
    siPrincipal.addEventListener('input', () => { siPrincipalRange.value = siPrincipal.value; calculateSI(); });
    siRateRange.addEventListener('input', () => { siRate.value = siRateRange.value; calculateSI(); });
    siRate.addEventListener('input', () => { siRateRange.value = siRate.value; calculateSI(); });
    siYearsRange.addEventListener('input', () => { siYears.value = siYearsRange.value; calculateSI(); });
    siYears.addEventListener('input', () => { siYearsRange.value = siYears.value; calculateSI(); });
}

function resetSI() {
    siPrincipal.value = 100000; siPrincipalRange.value = 100000;
    siRate.value = 8; siRateRange.value = 8;
    siYears.value = 5; siYearsRange.value = 5;
    calculateSI();
    showToast('🔄 Reset!');
}

function copySI() {
    const txt = `💰 Simple Interest\n\nPrincipal: ${$('siPrincipalDisp').textContent}\nRate: ${siRate.value}% p.a.\nTime: ${siYears.value} years\n\nSI: ${$('siInterest').textContent}\nTotal: ${$('siTotal').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/simple-interest-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareSI() {
    shareContent('SI Calculator - AI ToolCor', `Simple Interest on ${$('siPrincipalDisp').textContent}: ${$('siInterest').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateSI();
    renderRelatedTools('simple-interest-calculator', 'finance', 6);
    console.log('✅ SI Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const fdAmount = $('fdAmount');
const fdRate = $('fdRate');
const fdTenure = $('fdTenure');
const fdCompound = $('fdCompound');
const fdAmountRange = $('fdAmountRange');
const fdRateRange = $('fdRateRange');
const fdTenureRange = $('fdTenureRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateFD() {
    const P = parseFloat(fdAmount.value) || 0;
    const r = parseFloat(fdRate.value) || 0;
    const t = parseFloat(fdTenure.value) || 0;
    const n = parseFloat(fdCompound.value) || 4;
    
    if (P <= 0 || r <= 0 || t <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturity = P * Math.pow(1 + (r/100)/n, n * t);
    const interest = maturity - P;
    const principalPct = (P / maturity) * 100;
    const interestPct = (interest / maturity) * 100;
    const growthPct = ((interest / P) * 100);
    
    $('fdMaturity').textContent = fmtINR(maturity);
    $('fdInvested').textContent = fmtINR(P);
    $('fdInterest').textContent = fmtINR(interest);
    $('fdMaturitySub').textContent = `After ${t} year${t !== 1 ? 's' : ''}`;
    
    $('fdBarPrin').style.width = principalPct.toFixed(1) + '%';
    $('fdBarInt').style.width = interestPct.toFixed(1) + '%';
    $('fdLegPrin').textContent = `${fmtINR(P)} (${principalPct.toFixed(0)}%)`;
    $('fdLegInt').textContent = `${fmtINR(interest)} (${interestPct.toFixed(0)}%)`;
    
    const compoundType = n === 12 ? 'Monthly' : n === 4 ? 'Quarterly' : n === 2 ? 'Half-Yearly' : 'Yearly';
    let insight = '';
    if (growthPct >= 50) insight = `🚀 Excellent! Your FD will grow by ${growthPct.toFixed(1)}% in ${t} years with ${compoundType} compounding!`;
    else if (growthPct >= 25) insight = `👍 Good returns! ${growthPct.toFixed(1)}% growth in ${t} years. Consider longer tenure for better gains.`;
    else insight = `📊 Your FD will earn ${fmtINR(interest)} interest. For higher returns, consider longer tenure or SIP.`;
    $('fdInsight').textContent = insight;
}

function setupSync() {
    fdAmountRange.addEventListener('input', () => { fdAmount.value = fdAmountRange.value; calculateFD(); });
    fdAmount.addEventListener('input', () => { fdAmountRange.value = fdAmount.value; calculateFD(); });
    fdRateRange.addEventListener('input', () => { fdRate.value = fdRateRange.value; calculateFD(); });
    fdRate.addEventListener('input', () => { fdRateRange.value = fdRate.value; calculateFD(); });
    fdTenureRange.addEventListener('input', () => { fdTenure.value = fdTenureRange.value; calculateFD(); });
    fdTenure.addEventListener('input', () => { fdTenureRange.value = fdTenure.value; calculateFD(); });
    fdCompound.addEventListener('change', calculateFD);
}

function resetFD() {
    fdAmount.value = 100000;
    fdAmountRange.value = 100000;
    fdRate.value = 7;
    fdRateRange.value = 7;
    fdTenure.value = 5;
    fdTenureRange.value = 5;
    fdCompound.value = 4;
    calculateFD();
    showToast('🔄 Reset!');
}

function copyFD() {
    const txt = `💰 FD Calculator\n\nPrincipal: ${$('fdInvested').textContent}\nRate: ${fdRate.value}% p.a.\nTenure: ${fdTenure.value} years\n\nMaturity: ${$('fdMaturity').textContent}\nInterest: ${$('fdInterest').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/fd-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareFD() {
    shareContent('FD Calculator - AI ToolCor', `My FD will mature to ${$('fdMaturity').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateFD();
    renderRelatedTools('fd-calculator', 'finance', 6);
    console.log('✅ FD Calculator Loaded');
});
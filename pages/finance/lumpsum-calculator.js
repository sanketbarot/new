'use strict';

const $ = id => document.getElementById(id);
const lumpsumAmount = $('lumpsumAmount');
const lumpsumRate = $('lumpsumRate');
const lumpsumYears = $('lumpsumYears');
const lumpsumAmountRange = $('lumpsumAmountRange');
const lumpsumRateRange = $('lumpsumRateRange');
const lumpsumYearsRange = $('lumpsumYearsRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateLumpsum() {
    const P = parseFloat(lumpsumAmount.value) || 0;
    const r = parseFloat(lumpsumRate.value) || 0;
    const t = parseFloat(lumpsumYears.value) || 0;
    
    if (P <= 0 || r <= 0 || t <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // Future Value Formula: A = P × (1 + r/100)^t
    const maturity = P * Math.pow(1 + r/100, t);
    const gains = maturity - P;
    const investedPct = (P / maturity) * 100;
    const gainPct = (gains / maturity) * 100;
    const multiplier = maturity / P;
    
    $('lumpsumMaturity').textContent = fmtINR(maturity);
    $('lumpsumInvested').textContent = fmtINR(P);
    $('lumpsumGains').textContent = fmtINR(gains);
    document.querySelector('.result-main-sub').textContent = `After ${t} year${t !== 1 ? 's' : ''}`;
    
    $('lumpsumBarInv').style.width = investedPct.toFixed(1) + '%';
    $('lumpsumBarGain').style.width = gainPct.toFixed(1) + '%';
    $('lumpsumLegInv').textContent = `${fmtINR(P)} (${investedPct.toFixed(0)}%)`;
    $('lumpsumLegGain').textContent = `${fmtINR(gains)} (${gainPct.toFixed(0)}%)`;
    
    let insight = '';
    if (multiplier >= 5) insight = `🚀 Outstanding! Your ${fmtINR(P)} will multiply ${multiplier.toFixed(1)}x to ${fmtINR(maturity)} in ${t} years!`;
    else if (multiplier >= 3) insight = `🎯 Excellent! Your investment will grow ${multiplier.toFixed(1)}x. Power of compounding!`;
    else if (multiplier >= 2) insight = `👍 Good growth! Your money will more than double in ${t} years.`;
    else insight = `📊 Your investment will grow to ${fmtINR(maturity)} in ${t} years.`;
    $('lumpsumInsight').textContent = insight;
}

function setupSync() {
    lumpsumAmountRange.addEventListener('input', () => { lumpsumAmount.value = lumpsumAmountRange.value; calculateLumpsum(); });
    lumpsumAmount.addEventListener('input', () => {
        const v = parseFloat(lumpsumAmount.value);
        if (v >= 10000 && v <= 10000000) lumpsumAmountRange.value = v;
        calculateLumpsum();
    });
    lumpsumRateRange.addEventListener('input', () => { lumpsumRate.value = lumpsumRateRange.value; calculateLumpsum(); });
    lumpsumRate.addEventListener('input', () => { lumpsumRateRange.value = lumpsumRate.value; calculateLumpsum(); });
    lumpsumYearsRange.addEventListener('input', () => { lumpsumYears.value = lumpsumYearsRange.value; calculateLumpsum(); });
    lumpsumYears.addEventListener('input', () => { lumpsumYearsRange.value = lumpsumYears.value; calculateLumpsum(); });
}

function resetLumpsum() {
    lumpsumAmount.value = 100000;
    lumpsumAmountRange.value = 100000;
    lumpsumRate.value = 12;
    lumpsumRateRange.value = 12;
    lumpsumYears.value = 10;
    lumpsumYearsRange.value = 10;
    calculateLumpsum();
    showToast('🔄 Reset!');
}

function copyLumpsum() {
    const txt = `💰 Lumpsum Calculator\n\nInvestment: ${$('lumpsumInvested').textContent}\nRate: ${lumpsumRate.value}% p.a.\nPeriod: ${lumpsumYears.value} years\n\nMaturity: ${$('lumpsumMaturity').textContent}\nGains: ${$('lumpsumGains').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/lumpsum-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareLumpsum() {
    shareContent('Lumpsum Calculator - AI ToolCor', 
        `My ${fmtINR(parseFloat(lumpsumAmount.value))} will grow to ${$('lumpsumMaturity').textContent} in ${lumpsumYears.value} years!`,
        location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateLumpsum();
    renderRelatedTools('lumpsum-calculator', 'finance', 6);
    console.log('✅ Lumpsum Calculator Loaded');
});
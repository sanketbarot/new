'use strict';

const $ = id => document.getElementById(id);
const ciPrincipal = $('ciPrincipal');
const ciRate = $('ciRate');
const ciYears = $('ciYears');
const ciCompound = $('ciCompound');
const ciPrincipalRange = $('ciPrincipalRange');
const ciRateRange = $('ciRateRange');
const ciYearsRange = $('ciYearsRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateCI() {
    const P = parseFloat(ciPrincipal.value) || 0;
    const r = parseFloat(ciRate.value) || 0;
    const t = parseFloat(ciYears.value) || 0;
    const n = parseFloat(ciCompound.value) || 4;
    
    if (P <= 0 || r <= 0 || t <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // CI Formula: A = P(1 + r/n)^(nt)
    const A = P * Math.pow(1 + (r/100)/n, n * t);
    const interest = A - P;
    const prinPct = (P / A) * 100;
    const intPct = (interest / A) * 100;
    const growth = (interest / P) * 100;
    
    const compoundName = {1:'Yearly', 2:'Half-Yearly', 4:'Quarterly', 12:'Monthly', 365:'Daily'}[n];
    
    $('ciMaturity').textContent = fmtINR(A);
    $('ciPrincipalDisp').textContent = fmtINR(P);
    $('ciInterest').textContent = fmtINR(interest);
    $('ciSub').textContent = `After ${t} year${t !== 1 ? 's' : ''} (${compoundName})`;
    
    $('ciBarPrin').style.width = prinPct.toFixed(1) + '%';
    $('ciBarInt').style.width = intPct.toFixed(1) + '%';
    $('ciLegPrin').textContent = `${fmtINR(P)} (${prinPct.toFixed(0)}%)`;
    $('ciLegInt').textContent = `${fmtINR(interest)} (${intPct.toFixed(0)}%)`;
    
    // Simple Interest comparison
    const SI = (P * r * t) / 100;
    const ciAdvantage = interest - SI;
    
    let insight = '';
    if (growth >= 100) {
        insight = `🚀 Your money will more than double! ${growth.toFixed(1)}% growth with ${compoundName} compounding. CI advantage over SI: ${fmtINR(ciAdvantage)}.`;
    } else if (growth >= 50) {
        insight = `🎯 Excellent! ${growth.toFixed(1)}% growth. CI earns ${fmtINR(ciAdvantage)} more than simple interest!`;
    } else {
        insight = `💡 ${growth.toFixed(1)}% growth in ${t} years. Compound interest beats simple interest by ${fmtINR(ciAdvantage)}.`;
    }
    $('ciInsight').textContent = insight;
}

function setupSync() {
    ciPrincipalRange.addEventListener('input', () => { ciPrincipal.value = ciPrincipalRange.value; calculateCI(); });
    ciPrincipal.addEventListener('input', () => { ciPrincipalRange.value = ciPrincipal.value; calculateCI(); });
    ciRateRange.addEventListener('input', () => { ciRate.value = ciRateRange.value; calculateCI(); });
    ciRate.addEventListener('input', () => { ciRateRange.value = ciRate.value; calculateCI(); });
    ciYearsRange.addEventListener('input', () => { ciYears.value = ciYearsRange.value; calculateCI(); });
    ciYears.addEventListener('input', () => { ciYearsRange.value = ciYears.value; calculateCI(); });
    ciCompound.addEventListener('change', calculateCI);
}

function resetCI() {
    ciPrincipal.value = 100000; ciPrincipalRange.value = 100000;
    ciRate.value = 8; ciRateRange.value = 8;
    ciYears.value = 5; ciYearsRange.value = 5;
    ciCompound.value = 4;
    calculateCI();
    showToast('🔄 Reset!');
}

function copyCI() {
    const txt = `💰 Compound Interest\n\nPrincipal: ${$('ciPrincipalDisp').textContent}\nRate: ${ciRate.value}%\nTime: ${ciYears.value} years\n\nMaturity: ${$('ciMaturity').textContent}\nInterest: ${$('ciInterest').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/compound-interest-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareCI() {
    shareContent('CI Calculator - AI ToolCor', `My ${$('ciPrincipalDisp').textContent} grew to ${$('ciMaturity').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateCI();
    renderRelatedTools('compound-interest-calculator', 'finance', 6);
    console.log('✅ CI Calculator Loaded');
});
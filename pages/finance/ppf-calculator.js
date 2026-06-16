'use strict';

const $ = id => document.getElementById(id);
const ppfYearly = $('ppfYearly');
const ppfRate = $('ppfRate');
const ppfYears = $('ppfYears');
const ppfYearlyRange = $('ppfYearlyRange');
const ppfRateRange = $('ppfRateRange');
const ppfYearsRange = $('ppfYearsRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculatePPF() {
    const P = parseFloat(ppfYearly.value) || 0;
    const r = parseFloat(ppfRate.value) || 0;
    const t = parseFloat(ppfYears.value) || 0;
    
    if (P <= 0 || r <= 0 || t < 15) {
        showToast('⚠️ Min ₹500 yearly, Min 15 years tenure');
        return;
    }
    
    if (P > 150000) {
        showToast('⚠️ Max PPF deposit is ₹1.5 Lakh/year');
        ppfYearly.value = 150000;
        ppfYearlyRange.value = 150000;
        return calculatePPF();
    }
    
    // PPF Maturity Formula (Annual compounding on yearly deposits)
    // M = P × [((1+r)^n - 1) / r] × (1 + r)
    const rate = r / 100;
    
    let maturity = 0;
    let balance = 0;
    
    for (let year = 1; year <= t; year++) {
        balance = (balance + P) * (1 + rate);
    }
    maturity = balance;
    
    const totalInvested = P * t;
    const interest = maturity - totalInvested;
    const monthly = P / 12;
    const taxSaved = Math.min(150000, P) * 0.30 * t; // 30% tax bracket
    
    const investedPct = (totalInvested / maturity) * 100;
    const interestPct = (interest / maturity) * 100;
    
    $('ppfMaturity').textContent = fmtINR(maturity);
    $('ppfInvested').textContent = fmtINR(totalInvested);
    $('ppfInterest').textContent = fmtINR(interest);
    $('ppfMonthly').textContent = fmtINR(monthly);
    $('ppfTaxSaved').textContent = fmtINR(taxSaved);
    $('ppfMaturitySub').textContent = `After ${t} year${t !== 1 ? 's' : ''}`;
    
    $('ppfBarInv').style.width = investedPct.toFixed(1) + '%';
    $('ppfBarInt').style.width = interestPct.toFixed(1) + '%';
    $('ppfLegInv').textContent = `${fmtINR(totalInvested)} (${investedPct.toFixed(0)}%)`;
    $('ppfLegInt').textContent = `${fmtINR(interest)} (${interestPct.toFixed(0)}%)`;
    
    let insight = '';
    if (t >= 25) {
        insight = `🚀 Outstanding! ${t}-year PPF will create ${fmtINR(maturity)} - perfect for retirement! All tax-free (EEE).`;
    } else if (t >= 20) {
        insight = `🎯 Excellent long-term plan! ${fmtINR(maturity)} maturity + ${fmtINR(taxSaved)} tax saved = ${fmtINR(maturity + taxSaved)} total benefit!`;
    } else {
        insight = `💎 PPF is EEE - Investment, Interest & Maturity all TAX-FREE! Total tax saved: ${fmtINR(taxSaved)} (30% bracket).`;
    }
    $('ppfInsight').textContent = insight;
}

function setupSync() {
    ppfYearlyRange.addEventListener('input', () => { ppfYearly.value = ppfYearlyRange.value; calculatePPF(); });
    ppfYearly.addEventListener('input', () => { 
        const v = parseFloat(ppfYearly.value);
        if (v > 150000) ppfYearly.value = 150000;
        ppfYearlyRange.value = ppfYearly.value; 
        calculatePPF(); 
    });
    ppfRateRange.addEventListener('input', () => { ppfRate.value = ppfRateRange.value; calculatePPF(); });
    ppfRate.addEventListener('input', () => { ppfRateRange.value = ppfRate.value; calculatePPF(); });
    ppfYearsRange.addEventListener('input', () => { ppfYears.value = ppfYearsRange.value; calculatePPF(); });
    ppfYears.addEventListener('input', () => { ppfYearsRange.value = ppfYears.value; calculatePPF(); });
}

function resetPPF() {
    ppfYearly.value = 150000;
    ppfYearlyRange.value = 150000;
    ppfRate.value = 7.1;
    ppfRateRange.value = 7.1;
    ppfYears.value = 15;
    ppfYearsRange.value = 15;
    calculatePPF();
    showToast('🔄 Reset!');
}

function copyPPF() {
    const txt = `💎 PPF Calculator\n\nYearly: ${fmtINR(parseFloat(ppfYearly.value))}\nRate: ${ppfRate.value}% p.a.\nTenure: ${ppfYears.value} years\n\nMaturity: ${$('ppfMaturity').textContent}\nInvested: ${$('ppfInvested').textContent}\nInterest: ${$('ppfInterest').textContent}\nTax Saved: ${$('ppfTaxSaved').textContent}\n\n✅ PPF is EEE - Fully Tax-Free!\n\nhttps://calculator.aitoolcor.com/pages/finance/ppf-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function sharePPF() {
    shareContent('PPF Calculator - AI ToolCor', `My PPF will grow to ${$('ppfMaturity').textContent} in ${ppfYears.value} years - all tax-free!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculatePPF();
    renderRelatedTools('ppf-calculator', 'finance', 6);
    console.log('✅ PPF Calculator Loaded');
});
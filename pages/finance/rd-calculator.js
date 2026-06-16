'use strict';

const $ = id => document.getElementById(id);
const rdMonthly = $('rdMonthly');
const rdRate = $('rdRate');
const rdTenure = $('rdTenure');
const rdMonthlyRange = $('rdMonthlyRange');
const rdRateRange = $('rdRateRange');
const rdTenureRange = $('rdTenureRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateRD() {
    const R = parseFloat(rdMonthly.value) || 0; // Monthly deposit
    const rate = parseFloat(rdRate.value) || 0; // Annual rate
    const years = parseFloat(rdTenure.value) || 0; // Years
    
    if (R <= 0 || rate <= 0 || years <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // RD Maturity Formula (Quarterly compounding)
    // M = R × n + R × n(n+1)/2 × r/(12×100) where compounded approximation
    // More accurate: Sum of compound interest on each monthly deposit
    
    const n = years * 12; // Total months
    const i = rate / 400; // Quarterly rate
    
    let maturity = 0;
    
    // Calculate using compound interest on each monthly deposit
    for (let m = 1; m <= n; m++) {
        const monthsRemaining = (n - m + 1) / 3; // Convert to quarters
        maturity += R * Math.pow(1 + i, monthsRemaining);
    }
    
    const totalDeposited = R * n;
    const interest = maturity - totalDeposited;
    const depositedPct = (totalDeposited / maturity) * 100;
    const interestPct = (interest / maturity) * 100;
    
    $('rdMaturity').textContent = fmtINR(maturity);
    $('rdDeposited').textContent = fmtINR(totalDeposited);
    $('rdInterest').textContent = fmtINR(interest);
    $('rdMaturitySub').textContent = `After ${years} year${years !== 1 ? 's' : ''}`;
    
    $('rdBarDep').style.width = depositedPct.toFixed(1) + '%';
    $('rdBarInt').style.width = interestPct.toFixed(1) + '%';
    $('rdLegDep').textContent = `${fmtINR(totalDeposited)} (${depositedPct.toFixed(0)}%)`;
    $('rdLegInt').textContent = `${fmtINR(interest)} (${interestPct.toFixed(0)}%)`;
    
    let insight = '';
    if (years >= 5) insight = `🎯 Excellent discipline! Monthly RD of ${fmtINR(R)} will grow to ${fmtINR(maturity)} in ${years} years!`;
    else if (years >= 2) insight = `👍 Good savings! You'll save ${fmtINR(maturity)} in ${years} years through disciplined deposits.`;
    else insight = `📊 Your RD will earn ${fmtINR(interest)} interest. Consider longer tenure for better returns.`;
    $('rdInsight').textContent = insight;
}

function setupSync() {
    rdMonthlyRange.addEventListener('input', () => { rdMonthly.value = rdMonthlyRange.value; calculateRD(); });
    rdMonthly.addEventListener('input', () => { rdMonthlyRange.value = rdMonthly.value; calculateRD(); });
    rdRateRange.addEventListener('input', () => { rdRate.value = rdRateRange.value; calculateRD(); });
    rdRate.addEventListener('input', () => { rdRateRange.value = rdRate.value; calculateRD(); });
    rdTenureRange.addEventListener('input', () => { rdTenure.value = rdTenureRange.value; calculateRD(); });
    rdTenure.addEventListener('input', () => { rdTenureRange.value = rdTenure.value; calculateRD(); });
}

function resetRD() {
    rdMonthly.value = 5000;
    rdMonthlyRange.value = 5000;
    rdRate.value = 6.5;
    rdRateRange.value = 6.5;
    rdTenure.value = 5;
    rdTenureRange.value = 5;
    calculateRD();
    showToast('🔄 Reset!');
}

function copyRD() {
    const txt = `💰 RD Calculator\n\nMonthly: ${fmtINR(parseFloat(rdMonthly.value))}\nRate: ${rdRate.value}% p.a.\nTenure: ${rdTenure.value} years\n\nMaturity: ${$('rdMaturity').textContent}\nInterest: ${$('rdInterest').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/rd-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareRD() {
    shareContent('RD Calculator - AI ToolCor', `My RD will mature to ${$('rdMaturity').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateRD();
    renderRelatedTools('rd-calculator', 'finance', 6);
    console.log('✅ RD Calculator Loaded');
});
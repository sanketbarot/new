'use strict';

const $ = id => document.getElementById(id);
const npsAge = $('npsAge');
const npsMonthly = $('npsMonthly');
const npsRate = $('npsRate');
const npsAnnuity = $('npsAnnuity');
const npsAnnuityRate = $('npsAnnuityRate');
const npsAgeRange = $('npsAgeRange');
const npsMonthlyRange = $('npsMonthlyRange');
const npsRateRange = $('npsRateRange');
const npsAnnuityRange = $('npsAnnuityRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateNPS() {
    const age = parseFloat(npsAge.value) || 30;
    const P = parseFloat(npsMonthly.value) || 0;
    const r = parseFloat(npsRate.value) || 0;
    const annuityPct = parseFloat(npsAnnuity.value) || 40;
    const annuityRate = parseFloat(npsAnnuityRate.value) || 6;
    
    if (P <= 0 || r <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const yearsToRetire = 60 - age;
    if (yearsToRetire <= 0) {
        showToast('⚠️ You should be below 60 years');
        return;
    }
    
    // Future Value of monthly investments
    const monthlyRate = r / 12 / 100;
    const totalMonths = yearsToRetire * 12;
    
    let corpus = 0;
    if (monthlyRate === 0) {
        corpus = P * totalMonths;
    } else {
        corpus = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    }
    
    const totalInvested = P * totalMonths;
    const returns = corpus - totalInvested;
    
    // Lump sum and Annuity
    const annuityAmount = corpus * (annuityPct / 100);
    const lumpSum = corpus - annuityAmount;
    
    // Monthly Pension from annuity
    const monthlyPension = (annuityAmount * (annuityRate / 100)) / 12;
    
    // Tax saving (assuming 30% bracket)
    const yearlyInvestment = P * 12;
    const maxBenefit = Math.min(yearlyInvestment, 200000); // Max 2L
    const taxSaved = maxBenefit * 0.30 * yearsToRetire;
    
    $('npsCorpus').textContent = fmtINR(corpus);
    $('npsInvested').textContent = fmtINR(totalInvested);
    $('npsReturns').textContent = fmtINR(returns);
    $('npsLumpSum').textContent = fmtINR(lumpSum);
    $('npsAnnuityAmt').textContent = fmtINR(annuityAmount);
    $('npsMonthlyPension').textContent = fmtINR(monthlyPension);
    $('npsCorpusSub').textContent = `In ${yearsToRetire} years`;
    $('npsPensionDesc').textContent = `Lifetime monthly pension from ${fmtINR(annuityAmount)} annuity`;
    
    let insight = '';
    if (corpus >= 10000000) {
        insight = `🚀 Outstanding! ${fmtINR(corpus)} corpus + ${fmtINR(monthlyPension)}/month pension. Tax saved: ${fmtINR(taxSaved)}!`;
    } else if (corpus >= 5000000) {
        insight = `🎯 Excellent retirement plan! ${fmtINR(corpus)} corpus + ${fmtINR(monthlyPension)} monthly pension after age 60.`;
    } else {
        insight = `💡 Good start! Consider increasing monthly investment for better retirement corpus. Tax benefit up to ₹2L under 80C+80CCD.`;
    }
    $('npsInsight').textContent = insight;
}

function setupSync() {
    npsAgeRange.addEventListener('input', () => { npsAge.value = npsAgeRange.value; calculateNPS(); });
    npsAge.addEventListener('input', () => { npsAgeRange.value = npsAge.value; calculateNPS(); });
    npsMonthlyRange.addEventListener('input', () => { npsMonthly.value = npsMonthlyRange.value; calculateNPS(); });
    npsMonthly.addEventListener('input', () => { npsMonthlyRange.value = npsMonthly.value; calculateNPS(); });
    npsRateRange.addEventListener('input', () => { npsRate.value = npsRateRange.value; calculateNPS(); });
    npsRate.addEventListener('input', () => { npsRateRange.value = npsRate.value; calculateNPS(); });
    npsAnnuityRange.addEventListener('input', () => { npsAnnuity.value = npsAnnuityRange.value; calculateNPS(); });
    npsAnnuity.addEventListener('input', () => { npsAnnuityRange.value = npsAnnuity.value; calculateNPS(); });
    npsAnnuityRate.addEventListener('input', calculateNPS);
}

function resetNPS() {
    npsAge.value = 30; npsAgeRange.value = 30;
    npsMonthly.value = 5000; npsMonthlyRange.value = 5000;
    npsRate.value = 10; npsRateRange.value = 10;
    npsAnnuity.value = 40; npsAnnuityRange.value = 40;
    npsAnnuityRate.value = 6;
    calculateNPS();
    showToast('🔄 Reset!');
}

function copyNPS() {
    const txt = `🎯 NPS Calculator\n\nAge: ${npsAge.value}\nMonthly Investment: ${fmtINR(parseFloat(npsMonthly.value))}\nExpected Return: ${npsRate.value}%\n\nTotal Corpus: ${$('npsCorpus').textContent}\nLump Sum (60%): ${$('npsLumpSum').textContent}\nAnnuity (40%): ${$('npsAnnuityAmt').textContent}\nMonthly Pension: ${$('npsMonthlyPension').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/nps-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareNPS() {
    shareContent('NPS Calculator - AI ToolCor', `My NPS retirement plan: ${$('npsCorpus').textContent} corpus + ${$('npsMonthlyPension').textContent}/month pension!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateNPS();
    renderRelatedTools('nps-calculator', 'finance', 6);
    console.log('✅ NPS Calculator Loaded');
});
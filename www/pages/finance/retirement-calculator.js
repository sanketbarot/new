'use strict';

const $ = id => document.getElementById(id);
const retCurrentAge = $('retCurrentAge');
const retAge = $('retAge');
const retMonthly = $('retMonthly');
const retInflation = $('retInflation');
const retReturn = $('retReturn');
const retLifeExp = $('retLifeExp');
const retCurrentAgeRange = $('retCurrentAgeRange');
const retAgeRange = $('retAgeRange');
const retMonthlyRange = $('retMonthlyRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateRetirement() {
    const currentAge = parseFloat(retCurrentAge.value) || 30;
    const retirementAge = parseFloat(retAge.value) || 60;
    const monthlyExp = parseFloat(retMonthly.value) || 0;
    const inflation = parseFloat(retInflation.value) || 6;
    const returns = parseFloat(retReturn.value) || 12;
    const lifeExp = parseFloat(retLifeExp.value) || 80;
    
    if (currentAge >= retirementAge) {
        showToast('⚠️ Retirement age should be after current age');
        return;
    }
    
    const yearsToSave = retirementAge - currentAge;
    const postRetireYears = lifeExp - retirementAge;
    
    if (postRetireYears <= 0) {
        showToast('⚠️ Life expectancy should be after retirement');
        return;
    }
    
    // Future monthly expenses (inflation adjusted)
    const futureMonthly = monthlyExp * Math.pow(1 + inflation/100, yearsToSave);
    const futureAnnual = futureMonthly * 12;
    
    // Post-retirement return (assume conservative 8% post-retire vs 12% pre-retire)
    const postRetireReturn = 8;
    const realReturn = ((1 + postRetireReturn/100) / (1 + inflation/100) - 1) * 100;
    
    // Corpus needed using PV of annuity formula
    // PV = PMT × [(1 - (1+r)^-n) / r]
    let corpus;
    if (realReturn === 0) {
        corpus = futureAnnual * postRetireYears;
    } else {
        const r = realReturn / 100;
        corpus = futureAnnual * (1 - Math.pow(1 + r, -postRetireYears)) / r;
    }
    
    // Monthly SIP needed
    // FV = P × ((1+i)^n - 1)/i × (1+i)
    const months = yearsToSave * 12;
    const monthlyRate = returns / 12 / 100;
    let monthlySIP;
    if (monthlyRate === 0) {
        monthlySIP = corpus / months;
    } else {
        monthlySIP = corpus / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }
    
    $('retCorpus').textContent = fmtINR(corpus);
    $('retSIP').textContent = fmtINR(monthlySIP);
    $('retYears').textContent = yearsToSave;
    $('retFutureNeed').textContent = fmtINR(futureMonthly);
    $('retPostYears').textContent = postRetireYears;
    $('retCorpusSub').textContent = `At age ${retirementAge}`;
    
    $('retBreakdown').innerHTML = `
        <div class="tax-row"><span>Years to Save</span><strong>${yearsToSave} years</strong></div>
        <div class="tax-row"><span>Current Monthly Expenses</span><strong>${fmtINR(monthlyExp)}</strong></div>
        <div class="tax-row"><span>Future Monthly Expenses</span><strong>${fmtINR(futureMonthly)}</strong></div>
        <div class="tax-row"><span>Annual Expenses (Future)</span><strong>${fmtINR(futureAnnual)}</strong></div>
        <div class="tax-row"><span>Post-Retirement Period</span><strong>${postRetireYears} years</strong></div>
        <div class="tax-row total">
            <span>Required Corpus</span>
            <strong style="color:#059669;">${fmtINR(corpus)}</strong>
        </div>
        <div class="tax-row">
            <span>Monthly SIP Required</span>
            <strong style="color:#DC2626;">${fmtINR(monthlySIP)}</strong>
        </div>
    `;
    
    let insight = '';
    const sipPctOfExpense = (monthlySIP / monthlyExp) * 100;
    if (sipPctOfExpense <= 30) {
        insight = `✅ Achievable! Save ${fmtINR(monthlySIP)}/month (${sipPctOfExpense.toFixed(0)}% of current expenses) for comfortable retirement.`;
    } else if (sipPctOfExpense <= 50) {
        insight = `⚠️ Stretch goal! Save ${fmtINR(monthlySIP)}/month. Consider starting earlier or longer working years.`;
    } else {
        insight = `🚨 Very challenging! Need ${fmtINR(monthlySIP)}/month savings. Consider: longer career, lower expenses, or aggressive returns.`;
    }
    $('retInsight').textContent = insight;
}

function setupSync() {
    retCurrentAgeRange.addEventListener('input', () => { retCurrentAge.value = retCurrentAgeRange.value; calculateRetirement(); });
    retCurrentAge.addEventListener('input', () => { retCurrentAgeRange.value = retCurrentAge.value; calculateRetirement(); });
    retAgeRange.addEventListener('input', () => { retAge.value = retAgeRange.value; calculateRetirement(); });
    retAge.addEventListener('input', () => { retAgeRange.value = retAge.value; calculateRetirement(); });
    retMonthlyRange.addEventListener('input', () => { retMonthly.value = retMonthlyRange.value; calculateRetirement(); });
    retMonthly.addEventListener('input', () => { retMonthlyRange.value = retMonthly.value; calculateRetirement(); });
    [retInflation, retReturn, retLifeExp].forEach(el => el.addEventListener('input', calculateRetirement));
}

function resetRetirement() {
    retCurrentAge.value = 30; retCurrentAgeRange.value = 30;
    retAge.value = 60; retAgeRange.value = 60;
    retMonthly.value = 50000; retMonthlyRange.value = 50000;
    retInflation.value = 6;
    retReturn.value = 12;
    retLifeExp.value = 80;
    calculateRetirement();
    showToast('🔄 Reset!');
}

function copyRet() {
    const txt = `🎯 Retirement Calculator\n\nCurrent Age: ${retCurrentAge.value}\nRetirement Age: ${retAge.value}\nMonthly Expenses: ${fmtINR(parseFloat(retMonthly.value))}\n\nCorpus Needed: ${$('retCorpus').textContent}\nMonthly SIP: ${$('retSIP').textContent}\nFuture Monthly Need: ${$('retFutureNeed').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/retirement-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareRet() {
    shareContent('Retirement Calculator', `I need ${$('retCorpus').textContent} for retirement at ${retAge.value}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateRetirement();
    renderRelatedTools('retirement-calculator', 'finance', 6);
    console.log('✅ Retirement Calculator Loaded');
});
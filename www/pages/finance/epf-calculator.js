'use strict';

const $ = id => document.getElementById(id);
const epfAge = $('epfAge');
const epfBasic = $('epfBasic');
const epfIncrement = $('epfIncrement');
const epfRate = $('epfRate');
const epfAgeRange = $('epfAgeRange');
const epfBasicRange = $('epfBasicRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateEPF() {
    const age = parseFloat(epfAge.value) || 25;
    let basic = parseFloat(epfBasic.value) || 0;
    const inc = parseFloat(epfIncrement.value) || 0;
    const rate = parseFloat(epfRate.value) || 8.25;
    
    if (basic <= 0 || rate <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const yearsToRetire = 58 - age;
    if (yearsToRetire <= 0) {
        showToast('⚠️ You should be below 58 years');
        return;
    }
    
    const monthlyRate = rate / 12 / 100;
    let employeeTotal = 0;
    let employerTotal = 0;
    let balance = 0;
    
    let currentBasic = basic;
    
    // Year-wise calculation with increment
    for (let year = 1; year <= yearsToRetire; year++) {
        const monthlyEmployee = currentBasic * 0.12;
        const monthlyEmployer = currentBasic * 0.0367; // EPF portion only (3.67%)
        
        // 12 months of contributions
        for (let month = 1; month <= 12; month++) {
            balance += monthlyEmployee + monthlyEmployer;
            balance *= (1 + monthlyRate);
        }
        
        employeeTotal += monthlyEmployee * 12;
        employerTotal += monthlyEmployer * 12;
        
        // Apply annual increment
        currentBasic = currentBasic * (1 + inc / 100);
    }
    
    const corpus = balance;
    const totalDeposited = employeeTotal + employerTotal;
    const interest = corpus - totalDeposited;
    const depPct = (totalDeposited / corpus) * 100;
    const intPct = (interest / corpus) * 100;
    
    $('epfCorpus').textContent = fmtINR(corpus);
    $('epfEmployee').textContent = fmtINR(employeeTotal);
    $('epfEmployer').textContent = fmtINR(employerTotal);
    $('epfDeposited').textContent = fmtINR(totalDeposited);
    $('epfInterest').textContent = fmtINR(interest);
    $('epfSub').textContent = `In ${yearsToRetire} years`;
    
    $('epfBarDep').style.width = depPct.toFixed(1) + '%';
    $('epfBarInt').style.width = intPct.toFixed(1) + '%';
    $('epfLegDep').textContent = `${fmtINR(totalDeposited)} (${depPct.toFixed(0)}%)`;
    $('epfLegInt').textContent = `${fmtINR(interest)} (${intPct.toFixed(0)}%)`;
    
    let insight = '';
    if (corpus >= 20000000) {
        insight = `🚀 Outstanding! ₹${(corpus/10000000).toFixed(1)} Cr EPF corpus at retirement. Fully tax-free under EEE!`;
    } else if (corpus >= 10000000) {
        insight = `🎯 Excellent! ${fmtINR(corpus)} EPF corpus. Power of compounding + employer contribution!`;
    } else {
        insight = `💡 Good corpus building! EPF is EEE - tax-free withdrawal after 5+ years service.`;
    }
    $('epfInsight').textContent = insight;
}

function setupSync() {
    epfAgeRange.addEventListener('input', () => { epfAge.value = epfAgeRange.value; calculateEPF(); });
    epfAge.addEventListener('input', () => { epfAgeRange.value = epfAge.value; calculateEPF(); });
    epfBasicRange.addEventListener('input', () => { epfBasic.value = epfBasicRange.value; calculateEPF(); });
    epfBasic.addEventListener('input', () => { epfBasicRange.value = epfBasic.value; calculateEPF(); });
    epfIncrement.addEventListener('input', calculateEPF);
    epfRate.addEventListener('input', calculateEPF);
}

function resetEPF() {
    epfAge.value = 25; epfAgeRange.value = 25;
    epfBasic.value = 25000; epfBasicRange.value = 25000;
    epfIncrement.value = 10;
    epfRate.value = 8.25;
    calculateEPF();
    showToast('🔄 Reset!');
}

function copyEPF() {
    const txt = `💼 EPF Calculator\n\nAge: ${epfAge.value}\nBasic Salary: ${fmtINR(parseFloat(epfBasic.value))}\nIncrement: ${epfIncrement.value}%\nEPF Rate: ${epfRate.value}%\n\nCorpus at 58: ${$('epfCorpus').textContent}\nYour Contribution: ${$('epfEmployee').textContent}\nEmployer's: ${$('epfEmployer').textContent}\nInterest: ${$('epfInterest').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/epf-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareEPF() {
    shareContent('EPF Calculator - AI ToolCor', `My EPF will grow to ${$('epfCorpus').textContent} at retirement!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateEPF();
    renderRelatedTools('epf-calculator', 'finance', 6);
    console.log('✅ EPF Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const loanType = $('loanType');
const loanAmt = $('loanAmt');
const loanIntRate = $('loanIntRate');
const loanYrs = $('loanYrs');
const loanAmtRange = $('loanAmtRange');
const loanIntRateRange = $('loanIntRateRange');
const loanYrsRange = $('loanYrsRange');

const LOAN_TYPES = {
    personal: { name: 'Personal Loan', rate: 14, maxYears: 5 },
    home: { name: 'Home Loan', rate: 8.5, maxYears: 30 },
    car: { name: 'Car Loan', rate: 10, maxYears: 7 },
    education: { name: 'Education Loan', rate: 9, maxYears: 15 },
    business: { name: 'Business Loan', rate: 15, maxYears: 10 },
    gold: { name: 'Gold Loan', rate: 11, maxYears: 3 }
};

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function setLoanType() {
    const type = LOAN_TYPES[loanType.value];
    loanIntRate.value = type.rate;
    loanIntRateRange.value = type.rate;
    calculateLoan();
}

function calculateLoan() {
    const P = parseFloat(loanAmt.value) || 0;
    const annualRate = parseFloat(loanIntRate.value) || 0;
    const years = parseFloat(loanYrs.value) || 0;
    
    if (P <= 0 || annualRate <= 0 || years <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const r = annualRate / 12 / 100;
    const n = years * 12;
    
    let emi;
    if (r === 0) {
        emi = P / n;
    } else {
        emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - P;
    const prinPct = (P / totalRepayment) * 100;
    const intPct = (totalInterest / totalRepayment) * 100;
    const intRatio = (totalInterest / P) * 100;
    
    $('loanEMI').textContent = fmtINR(emi);
    $('loanTotalInt').textContent = fmtINR(totalInterest);
    $('loanTotalRepay').textContent = fmtINR(totalRepayment);
    $('loanSub').textContent = `For ${years} year${years !== 1 ? 's' : ''}`;
    
    $('loanBarPrin').style.width = prinPct.toFixed(1) + '%';
    $('loanBarInt').style.width = intPct.toFixed(1) + '%';
    $('loanLegPrin').textContent = `${fmtINR(P)} (${prinPct.toFixed(0)}%)`;
    $('loanLegInt').textContent = `${fmtINR(totalInterest)} (${intPct.toFixed(0)}%)`;
    
    let insight = '';
    if (intRatio < 30) {
        insight = `🎯 Excellent! Low interest cost (${intRatio.toFixed(0)}% of principal). Good loan terms!`;
    } else if (intRatio < 70) {
        insight = `👍 Reasonable! Interest is ${intRatio.toFixed(0)}% of principal. Consider prepayment to save.`;
    } else {
        insight = `⚠️ High interest cost (${intRatio.toFixed(0)}% of principal). Consider shorter tenure or lower rate.`;
    }
    $('loanInsight').textContent = insight;
}

function setupSync() {
    loanAmtRange.addEventListener('input', () => { loanAmt.value = loanAmtRange.value; calculateLoan(); });
    loanAmt.addEventListener('input', () => { loanAmtRange.value = loanAmt.value; calculateLoan(); });
    loanIntRateRange.addEventListener('input', () => { loanIntRate.value = loanIntRateRange.value; calculateLoan(); });
    loanIntRate.addEventListener('input', () => { loanIntRateRange.value = loanIntRate.value; calculateLoan(); });
    loanYrsRange.addEventListener('input', () => { loanYrs.value = loanYrsRange.value; calculateLoan(); });
    loanYrs.addEventListener('input', () => { loanYrsRange.value = loanYrs.value; calculateLoan(); });
}

function resetLoan() {
    loanType.value = 'personal';
    loanAmt.value = 500000; loanAmtRange.value = 500000;
    loanIntRate.value = 14; loanIntRateRange.value = 14;
    loanYrs.value = 5; loanYrsRange.value = 5;
    calculateLoan();
    showToast('🔄 Reset!');
}

function copyLoan() {
    const txt = `💰 Loan Calculator\n\nType: ${LOAN_TYPES[loanType.value].name}\nAmount: ${fmtINR(parseFloat(loanAmt.value))}\nRate: ${loanIntRate.value}%\nTenure: ${loanYrs.value} years\n\nEMI: ${$('loanEMI').textContent}\nTotal Interest: ${$('loanTotalInt').textContent}\nTotal Repayment: ${$('loanTotalRepay').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/loan-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareLoan() {
    shareContent('Loan Calculator - AI ToolCor', `My loan EMI: ${$('loanEMI').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateLoan();
    renderRelatedTools('loan-calculator', 'finance', 6);
    console.log('✅ Loan Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const ccBalance = $('ccBalance');
const ccRate = $('ccRate');
const ccMonthlyPay = $('ccMonthlyPay');
const ccBalanceRange = $('ccBalanceRange');
const ccRateRange = $('ccRateRange');
const ccMonthlyPayRange = $('ccMonthlyPayRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateCC() {
    const balance = parseFloat(ccBalance.value) || 0;
    const annualRate = parseFloat(ccRate.value) || 0;
    const monthlyPay = parseFloat(ccMonthlyPay.value) || 0;
    
    if (balance <= 0 || annualRate <= 0 || monthlyPay <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const monthlyInterest = balance * monthlyRate;
    const minPayment = Math.max(balance * 0.05, 500);
    
    if (monthlyPay <= monthlyInterest) {
        showToast('⚠️ Payment must be more than monthly interest!');
        $('ccInterest').textContent = '∞';
        $('ccMonths').textContent = '∞';
        $('ccTotal').textContent = '∞';
        $('ccInsight').textContent = '🚨 Your monthly payment is less than interest! You will NEVER pay off this debt!';
        return;
    }
    
    // Calculate months and total interest
    let remaining = balance;
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 600; // 50 years cap
    
    while (remaining > 0 && months < maxMonths) {
        const interest = remaining * monthlyRate;
        totalInterest += interest;
        
        const principalPayment = Math.min(monthlyPay - interest, remaining);
        remaining -= principalPayment;
        
        months++;
        
        if (remaining < 1) break;
    }
    
    const totalPayment = balance + totalInterest;
    
    $('ccInterest').textContent = fmtINR(totalInterest);
    $('ccMonths').textContent = months;
    $('ccTotal').textContent = fmtINR(totalPayment);
    $('ccMinPay').textContent = fmtINR(minPayment);
    $('ccMonthlyInt').textContent = fmtINR(monthlyInterest);
    $('ccSub').textContent = `If paying ${fmtINR(monthlyPay)}/month`;
    
    // Calculate min payment scenario
    let minRemaining = balance;
    let minMonths = 0;
    let minTotalInt = 0;
    while (minRemaining > 0 && minMonths < maxMonths) {
        const interest = minRemaining * monthlyRate;
        minTotalInt += interest;
        const minPay = Math.max(minRemaining * 0.05, 500);
        const principalPayment = Math.min(minPay - interest, minRemaining);
        if (principalPayment <= 0) break;
        minRemaining -= principalPayment;
        minMonths++;
    }
    
    $('ccBreakdown').innerHTML = `
        <div class="tax-row"><span>Outstanding Balance</span><strong>${fmtINR(balance)}</strong></div>
        <div class="tax-row"><span>Monthly Interest Rate</span><strong>${(monthlyRate * 100).toFixed(2)}%</strong></div>
        <div class="tax-row"><span>Monthly Interest Charge</span><strong style="color:#DC2626;">${fmtINR(monthlyInterest)}</strong></div>
        <div class="tax-row"><span>Your Monthly Payment</span><strong>${fmtINR(monthlyPay)}</strong></div>
        <div class="tax-row total">
            <span>Time to Pay Off</span>
            <strong style="color:#059669;">${months} months (${(months/12).toFixed(1)} years)</strong>
        </div>
        <div class="tax-row"><span>Total Interest Paid</span><strong style="color:#DC2626;">${fmtINR(totalInterest)}</strong></div>
        <div class="tax-row"><span>Total Amount Paid</span><strong>${fmtINR(totalPayment)}</strong></div>
        ${minMonths < maxMonths ? `
        <div class="tax-row" style="background:rgba(220,38,38,0.05);padding:8px 12px;border-radius:8px;margin-top:8px;">
            <span>⚠️ With Min Payment Only</span>
            <strong style="color:#DC2626;">${minMonths} months, Interest: ${fmtINR(minTotalInt)}</strong>
        </div>` : `
        <div class="tax-row" style="background:rgba(220,38,38,0.1);padding:8px 12px;border-radius:8px;">
            <span>⚠️ Min Payment Only</span>
            <strong style="color:#DC2626;">Will take 50+ years!</strong>
        </div>`}
    `;
    
    const intPctOfBalance = (totalInterest / balance) * 100;
    let insight = '';
    if (intPctOfBalance < 15) {
        insight = `✅ Good payment plan! You'll pay only ${intPctOfBalance.toFixed(0)}% extra in interest. Pay it off in ${months} months.`;
    } else if (intPctOfBalance < 40) {
        insight = `⚠️ Paying ${intPctOfBalance.toFixed(0)}% extra in interest. Increase monthly payment to save more.`;
    } else {
        insight = `🚨 Heavy interest cost (${intPctOfBalance.toFixed(0)}% of balance)! Consider EMI conversion or balance transfer to save big.`;
    }
    $('ccInsight').textContent = insight;
}

function setupSync() {
    ccBalanceRange.addEventListener('input', () => { ccBalance.value = ccBalanceRange.value; calculateCC(); });
    ccBalance.addEventListener('input', () => { ccBalanceRange.value = ccBalance.value; calculateCC(); });
    ccRateRange.addEventListener('input', () => { ccRate.value = ccRateRange.value; calculateCC(); });
    ccRate.addEventListener('input', () => { ccRateRange.value = ccRate.value; calculateCC(); });
    ccMonthlyPayRange.addEventListener('input', () => { ccMonthlyPay.value = ccMonthlyPayRange.value; calculateCC(); });
    ccMonthlyPay.addEventListener('input', () => { ccMonthlyPayRange.value = ccMonthlyPay.value; calculateCC(); });
}

function resetCC() {
    ccBalance.value = 50000; ccBalanceRange.value = 50000;
    ccRate.value = 36; ccRateRange.value = 36;
    ccMonthlyPay.value = 5000; ccMonthlyPayRange.value = 5000;
    calculateCC();
    showToast('🔄 Reset!');
}

function copyCC() {
    const txt = `💳 Credit Card Interest\n\nBalance: ${fmtINR(parseFloat(ccBalance.value))}\nRate: ${ccRate.value}% p.a.\nMonthly Payment: ${fmtINR(parseFloat(ccMonthlyPay.value))}\n\nMonths to Pay: ${$('ccMonths').textContent}\nTotal Interest: ${$('ccInterest').textContent}\nTotal Payment: ${$('ccTotal').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/credit-card-interest-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareCC() {
    shareContent('CC Calculator', `CC interest will cost ${$('ccInterest').textContent} extra!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateCC();
    renderRelatedTools('credit-card-interest-calculator', 'finance', 6);
    console.log('✅ CC Calculator Loaded');
});
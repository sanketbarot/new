'use strict';

const $ = id => document.getElementById(id);
const flIncome = $('flIncome');
const flExpenses = $('flExpenses');
const flTax = $('flTax');
const flWeeks = $('flWeeks');
const flHours = $('flHours');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateFreelance() {
    const income = parseFloat(flIncome.value) || 0;
    const expenses = parseFloat(flExpenses.value) || 0;
    const tax = parseFloat(flTax.value) || 0;
    const weeks = parseFloat(flWeeks.value) || 0;
    const hours = parseFloat(flHours.value) || 0;
    
    if (income <= 0 || weeks <= 0 || hours <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // Calculate required revenue
    // Income / (1 - tax%) gives pre-tax income
    const preTaxIncome = income / (1 - tax/100);
    const totalRevenue = preTaxIncome + expenses;
    
    // Total billable hours
    const totalHours = weeks * hours;
    
    // Hourly rate
    const hourlyRate = totalRevenue / totalHours;
    const dailyRate = hourlyRate * 8;
    const weeklyRate = hourlyRate * hours;
    const monthlyRate = (totalRevenue / 12);
    const projectRate = hourlyRate * 40; // Typical project
    
    $('flHourlyRate').textContent = fmtINR(hourlyRate);
    $('flDaily').textContent = fmtINR(dailyRate);
    $('flProject').textContent = fmtINR(projectRate);
    
    $('flBreakdown').innerHTML = `
        <div class="tax-row"><span>Desired Take-Home</span><strong>${fmtINR(income)}</strong></div>
        <div class="tax-row"><span>Tax (${tax}%)</span><strong>${fmtINR(preTaxIncome - income)}</strong></div>
        <div class="tax-row"><span>Pre-Tax Income</span><strong>${fmtINR(preTaxIncome)}</strong></div>
        <div class="tax-row"><span>Business Expenses</span><strong>${fmtINR(expenses)}</strong></div>
        <div class="tax-row total"><span>Total Revenue Needed</span><strong style="color:#059669;">${fmtINR(totalRevenue)}</strong></div>
        <div class="tax-row"><span>Total Billable Hours/Year</span><strong>${totalHours.toLocaleString()} hrs</strong></div>
        <div class="tax-row"><span>Monthly Revenue Target</span><strong>${fmtINR(monthlyRate)}</strong></div>
        <div class="tax-row"><span>Weekly Revenue Target</span><strong>${fmtINR(weeklyRate)}</strong></div>
        <div class="tax-row total"><span>Hourly Rate</span><strong style="color:#DC2626;">${fmtINR(hourlyRate)}/hour</strong></div>
    `;
    
    let insight = '';
    if (hourlyRate < 500) {
        insight = `📊 Low rate (${fmtINR(hourlyRate)}/hr). Consider: niche skills, better positioning, international clients.`;
    } else if (hourlyRate < 1500) {
        insight = `👍 Standard rate. Negotiate for ${fmtINR(hourlyRate * 1.2)}/hr (20% buffer for negotiations).`;
    } else if (hourlyRate < 3000) {
        insight = `💎 Professional rate! ${fmtINR(hourlyRate)}/hr reflects expert level.`;
    } else {
        insight = `🚀 Premium rate (${fmtINR(hourlyRate)}/hr)! Focus on high-value clients & specialized work.`;
    }
    $('flInsight').textContent = insight;
}

function resetFreelance() {
    flIncome.value = 1200000;
    flExpenses.value = 200000;
    flTax.value = 20;
    flWeeks.value = 48;
    flHours.value = 25;
    calculateFreelance();
    showToast('🔄 Reset!');
}

function copyFL() {
    const txt = `💼 Freelance Rate\n\nDesired Income: ${fmtINR(parseFloat(flIncome.value))}\nExpenses: ${fmtINR(parseFloat(flExpenses.value))}\n\nHourly Rate: ${$('flHourlyRate').textContent}\nDaily Rate: ${$('flDaily').textContent}\nProject Rate (40h): ${$('flProject').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/freelance-rate-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareFL() {
    shareContent('Freelance Rate', `My freelance rate: ${$('flHourlyRate').textContent}/hour`, location.href);
}

[flIncome, flExpenses, flTax, flWeeks, flHours].forEach(el => el.addEventListener('input', calculateFreelance));

document.addEventListener('DOMContentLoaded', () => {
    calculateFreelance();
    renderRelatedTools('freelance-rate-calculator', 'business', 6);
    console.log('✅ Freelance Rate Calculator Loaded');
});
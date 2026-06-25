'use strict';

const $ = id => document.getElementById(id);
const salCTC = $('salCTC');
const salBonus = $('salBonus');
const salDeductions = $('salDeductions');
const salCTCRange = $('salCTCRange');
let salRegime = 'new';

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function setSalRegime(regime, event) {
    salRegime = regime;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('salDeductionsGroup').style.display = regime === 'old' ? 'block' : 'none';
    calculateSalary();
}

function calculateNewRegimeTax(income) {
    let tax = 0;
    const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 0.05 },
        { limit: 1200000, rate: 0.10 },
        { limit: 1600000, rate: 0.15 },
        { limit: 2000000, rate: 0.20 },
        { limit: 2400000, rate: 0.25 },
        { limit: Infinity, rate: 0.30 }
    ];
    let prevLimit = 0;
    for (const slab of slabs) {
        if (income <= prevLimit) break;
        const slabAmount = Math.min(income, slab.limit) - prevLimit;
        if (slabAmount > 0) tax += slabAmount * slab.rate;
        prevLimit = slab.limit;
    }
    if (income <= 1200000) tax = 0; // Sec 87A Rebate
    return tax;
}

function calculateOldRegimeTax(income) {
    let tax = 0;
    if (income > 250000) {
        const slab1 = Math.min(income, 500000) - 250000;
        if (slab1 > 0) tax += slab1 * 0.05;
        if (income > 500000) {
            const slab2 = Math.min(income, 1000000) - 500000;
            if (slab2 > 0) tax += slab2 * 0.20;
        }
        if (income > 1000000) {
            const slab3 = income - 1000000;
            tax += slab3 * 0.30;
        }
    }
    if (income <= 500000) tax = Math.max(0, tax - 12500);
    return tax;
}

function calculateSalary() {
    const ctc = parseFloat(salCTC.value) || 0;
    const bonus = parseFloat(salBonus.value) || 0;
    const deductions = parseFloat(salDeductions.value) || 0;
    
    if (ctc <= 0) {
        showToast('⚠️ Enter valid CTC');
        return;
    }
    
    // Typical salary structure (India)
    // Basic: 40% of CTC
    // HRA: 50% of Basic (metro)
    // Special Allowance: Remainder
    
    const basic = ctc * 0.40;
    const hra = basic * 0.50;
    const employerEPF = Math.min(basic * 0.12, 21600); // Max 1800/month
    const employeeEPF = employerEPF; // Same as employer
    const gratuity = basic * 0.0481; // 4.81%
    
    const grossSalary = ctc - employerEPF - gratuity;
    const specialAllowance = grossSalary - basic - hra;
    
    // Income tax calculation
    let taxableIncome, incomeTax;
    
    if (salRegime === 'new') {
        const standardDeduction = 75000;
        taxableIncome = Math.max(0, grossSalary + bonus - standardDeduction);
        incomeTax = calculateNewRegimeTax(taxableIncome);
    } else {
        const standardDeduction = 50000;
        taxableIncome = Math.max(0, grossSalary + bonus - standardDeduction - deductions);
        incomeTax = calculateOldRegimeTax(taxableIncome);
    }
    
    const cess = incomeTax * 0.04;
    const totalTax = incomeTax + cess;
    const professionalTax = 2400; // ₹200/month
    
    const totalDeductions = employeeEPF + totalTax + professionalTax;
    const annualTakeHome = grossSalary - totalDeductions + bonus;
    const monthlyTakeHome = annualTakeHome / 12;
    const monthlyGross = grossSalary / 12;
    const monthlyDeductions = totalDeductions / 12;
    
    $('salMonthly').textContent = fmtINR(monthlyTakeHome);
    $('salAnnualSub').textContent = fmtINR(annualTakeHome) + '/year';
    $('salGrossMonthly').textContent = fmtINR(monthlyGross);
    $('salDeductionsTotal').textContent = fmtINR(monthlyDeductions);
    
    $('salBreakdown').innerHTML = `
        <div class="tax-row"><span><strong>Annual CTC</strong></span><strong>${fmtINR(ctc)}</strong></div>
        <div class="tax-row"><span>Basic Salary (40%)</span><strong>${fmtINR(basic)}</strong></div>
        <div class="tax-row"><span>HRA (50% of Basic)</span><strong>${fmtINR(hra)}</strong></div>
        <div class="tax-row"><span>Special Allowance</span><strong>${fmtINR(specialAllowance)}</strong></div>
        <div class="tax-row"><span>Employer EPF</span><strong style="color:#DC2626;">- ${fmtINR(employerEPF)}</strong></div>
        <div class="tax-row"><span>Gratuity</span><strong style="color:#DC2626;">- ${fmtINR(gratuity)}</strong></div>
        <div class="tax-row total"><span>Gross Salary</span><strong>${fmtINR(grossSalary)}</strong></div>
        <div class="tax-row"><span>+ Bonus</span><strong style="color:#059669;">+ ${fmtINR(bonus)}</strong></div>
        <div class="tax-row"><span>Employee EPF</span><strong style="color:#DC2626;">- ${fmtINR(employeeEPF)}</strong></div>
        <div class="tax-row"><span>Income Tax</span><strong style="color:#DC2626;">- ${fmtINR(incomeTax)}</strong></div>
        <div class="tax-row"><span>Cess (4%)</span><strong style="color:#DC2626;">- ${fmtINR(cess)}</strong></div>
        <div class="tax-row"><span>Professional Tax</span><strong style="color:#DC2626;">- ${fmtINR(professionalTax)}</strong></div>
        <div class="tax-row total"><span><strong>Annual Take-Home</strong></span><strong style="color:#059669;">${fmtINR(annualTakeHome)}</strong></div>
        <div class="tax-row"><span>Monthly Take-Home</span><strong>${fmtINR(monthlyTakeHome)}</strong></div>
    `;
    
    const takeHomeRatio = (annualTakeHome / ctc) * 100;
    let insight = '';
    if (takeHomeRatio >= 85) {
        insight = `✅ Excellent! ${takeHomeRatio.toFixed(0)}% take-home ratio. Low tax burden with new regime!`;
    } else if (takeHomeRatio >= 75) {
        insight = `👍 Good ratio (${takeHomeRatio.toFixed(0)}%). Consider tax-saving investments to improve.`;
    } else {
        insight = `📊 Take-home is ${takeHomeRatio.toFixed(0)}% of CTC. Higher tax bracket. Use deductions effectively.`;
    }
    $('salInsight').textContent = insight;
}

function setupSync() {
    salCTCRange.addEventListener('input', () => { salCTC.value = salCTCRange.value; calculateSalary(); });
    salCTC.addEventListener('input', () => { salCTCRange.value = salCTC.value; calculateSalary(); });
    salBonus.addEventListener('input', calculateSalary);
    salDeductions.addEventListener('input', calculateSalary);
}

function resetSalary() {
    salCTC.value = 1000000; salCTCRange.value = 1000000;
    salBonus.value = 50000;
    salDeductions.value = 150000;
    salRegime = 'new';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    setSalRegime('new');
    showToast('🔄 Reset!');
}

function copySalary() {
    const txt = `💼 Salary Calculator\n\nCTC: ${fmtINR(parseFloat(salCTC.value))}\nBonus: ${fmtINR(parseFloat(salBonus.value))}\nRegime: ${salRegime === 'new' ? 'New' : 'Old'}\n\nMonthly Take-Home: ${$('salMonthly').textContent}\nAnnual Take-Home: ${$('salAnnualSub').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/salary-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareSalary() {
    shareContent('Salary Calculator', `My take-home: ${$('salMonthly').textContent}/month`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateSalary();
    renderRelatedTools('salary-calculator', 'business', 6);
    console.log('✅ Salary Calculator Loaded');
});
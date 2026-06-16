'use strict';

const $ = id => document.getElementById(id);
const gratuitySalary = $('gratuitySalary');
const gratuityYears = $('gratuityYears');
const gratuitySalaryRange = $('gratuitySalaryRange');
const gratuityYearsRange = $('gratuityYearsRange');
let companyType = 'covered';

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function setCompanyType(type, event) {
    companyType = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('companyHint').textContent = type === 'covered' 
        ? 'Companies with 10+ employees (Payment of Gratuity Act 1972)' 
        : 'Smaller companies or non-applicable cases';
    calculateGratuity();
}

function calculateGratuity() {
    const salary = parseFloat(gratuitySalary.value) || 0;
    const years = parseFloat(gratuityYears.value) || 0;
    
    if (salary <= 0) {
        showToast('⚠️ Enter valid salary');
        return;
    }
    
    if (companyType === 'covered' && years < 5) {
        showToast('ℹ️ Min 5 years required for Covered Act');
    }
    
    let gratuity = 0;
    const divisor = companyType === 'covered' ? 26 : 30;
    
    // Formula: (Last Salary × 15 × Years) / 26 or 30
    gratuity = (salary * 15 * years) / divisor;
    
    // Cap at ₹20 Lakh (Tax-free limit)
    const maxLimit = 2000000;
    const taxFree = Math.min(gratuity, maxLimit);
    const taxable = Math.max(0, gratuity - maxLimit);
    
    $('gratuityAmount').textContent = fmtINR(gratuity);
    $('gratuityTaxFree').textContent = fmtINR(taxFree);
    $('gratuityTaxable').textContent = fmtINR(taxable);
    $('gratuitySub').textContent = `After ${years} years of service`;
    
    $('gratuityBreakdown').innerHTML = `
        <div class="tax-row">
            <span>Last Drawn Salary (Basic+DA)</span>
            <strong>${fmtINR(salary)}</strong>
        </div>
        <div class="tax-row">
            <span>Years of Service</span>
            <strong>${years}</strong>
        </div>
        <div class="tax-row">
            <span>Formula</span>
            <strong style="font-size:11px;">(₹${salary.toLocaleString('en-IN')} × 15 × ${years}) ÷ ${divisor}</strong>
        </div>
        <div class="tax-row total">
            <span>Total Gratuity</span>
            <strong style="color:#059669;">${fmtINR(gratuity)}</strong>
        </div>
        <div class="tax-row">
            <span>Tax-Free (Sec 10(10))</span>
            <strong>${fmtINR(taxFree)}</strong>
        </div>
        ${taxable > 0 ? `
        <div class="tax-row">
            <span>Taxable (Above ₹20L)</span>
            <strong style="color:#DC2626;">${fmtINR(taxable)}</strong>
        </div>` : ''}
    `;
    
    let insight = '';
    if (taxable === 0) {
        insight = `✅ Your gratuity of ${fmtINR(gratuity)} is FULLY TAX-FREE under Section 10(10) (up to ₹20L limit).`;
    } else {
        insight = `💡 Tax-free: ${fmtINR(taxFree)}. Taxable amount: ${fmtINR(taxable)} (above ₹20L exemption limit).`;
    }
    if (years < 5 && companyType === 'covered') {
        insight = `⚠️ For Covered Act, you need 5+ years of service to be eligible for gratuity.`;
    }
    $('gratuityInsight').textContent = insight;
}

function setupSync() {
    gratuitySalaryRange.addEventListener('input', () => { gratuitySalary.value = gratuitySalaryRange.value; calculateGratuity(); });
    gratuitySalary.addEventListener('input', () => { gratuitySalaryRange.value = gratuitySalary.value; calculateGratuity(); });
    gratuityYearsRange.addEventListener('input', () => { gratuityYears.value = gratuityYearsRange.value; calculateGratuity(); });
    gratuityYears.addEventListener('input', () => { gratuityYearsRange.value = gratuityYears.value; calculateGratuity(); });
}

function resetGratuity() {
    gratuitySalary.value = 50000; gratuitySalaryRange.value = 50000;
    gratuityYears.value = 10; gratuityYearsRange.value = 10;
    companyType = 'covered';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    calculateGratuity();
    showToast('🔄 Reset!');
}

function copyGratuity() {
    const txt = `💰 Gratuity Calculator\n\nLast Salary: ${fmtINR(parseFloat(gratuitySalary.value))}\nYears of Service: ${gratuityYears.value}\nCompany Type: ${companyType === 'covered' ? 'Covered Act' : 'Not Covered'}\n\nTotal Gratuity: ${$('gratuityAmount').textContent}\nTax-Free: ${$('gratuityTaxFree').textContent}\nTaxable: ${$('gratuityTaxable').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/gratuity-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareGratuity() {
    shareContent('Gratuity Calculator - AI ToolCor', `My gratuity: ${$('gratuityAmount').textContent} after ${gratuityYears.value} years!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateGratuity();
    renderRelatedTools('gratuity-calculator', 'finance', 6);
    console.log('✅ Gratuity Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const hraBasic = $('hraBasic');
const hraDA = $('hraDA');
const hraReceived = $('hraReceived');
const hraPaid = $('hraPaid');
let cityType = 'metro';

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function setCityType(type, event) {
    cityType = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('cityHint').textContent = type === 'metro' 
        ? 'Mumbai, Delhi, Chennai, Kolkata = 50% of Basic' 
        : 'Other cities = 40% of Basic';
    calculateHRA();
}

function calculateHRA() {
    const basic = parseFloat(hraBasic.value) || 0;
    const da = parseFloat(hraDA.value) || 0;
    const received = parseFloat(hraReceived.value) || 0;
    const paid = parseFloat(hraPaid.value) || 0;
    
    if (basic <= 0) {
        showToast('⚠️ Enter basic salary');
        return;
    }
    
    const basicDA = basic + da;
    
    // 3 Conditions for HRA Exemption
    // 1. Actual HRA received
    const cond1 = received;
    
    // 2. 50% (Metro) or 40% (Non-Metro) of Basic+DA
    const cond2 = cityType === 'metro' ? basicDA * 0.5 : basicDA * 0.4;
    
    // 3. Rent paid - 10% of Basic+DA
    const cond3 = Math.max(0, paid - (basicDA * 0.10));
    
    // Exemption = Minimum of 3
    const exemption = Math.min(cond1, cond2, cond3);
    const taxable = Math.max(0, received - exemption);
    const taxSaved = exemption * 0.30; // Assuming 30% bracket
    
    $('hraExemption').textContent = fmtINR(exemption);
    $('hraTaxable').textContent = fmtINR(taxable);
    $('hraTaxSaved').textContent = fmtINR(taxSaved);
    
    // Breakdown
    $('hraBreakdown').innerHTML = `
        <div class="tax-row">
            <span>1. Actual HRA Received</span>
            <strong>${fmtINR(cond1)}</strong>
        </div>
        <div class="tax-row">
            <span>2. ${cityType === 'metro' ? '50%' : '40%'} of Basic+DA</span>
            <strong>${fmtINR(cond2)}</strong>
        </div>
        <div class="tax-row">
            <span>3. Rent - 10% of Basic+DA</span>
            <strong>${fmtINR(cond3)}</strong>
        </div>
        <div class="tax-row total">
            <span>HRA Exemption (Minimum)</span>
            <strong style="color:#059669;">${fmtINR(exemption)}</strong>
        </div>
    `;
    
    let insight = '';
    if (exemption === received) {
        insight = `🎯 Maximum benefit! Your entire HRA of ${fmtINR(received)} is tax-exempt. Tax saved: ${fmtINR(taxSaved)} (30% bracket).`;
    } else if (exemption === 0) {
        insight = `⚠️ No HRA exemption. You need to pay rent more than 10% of Basic+DA.`;
    } else {
        insight = `💡 HRA exemption: ${fmtINR(exemption)} out of ${fmtINR(received)}. Increase rent paid to maximize exemption.`;
    }
    $('hraInsight').textContent = insight;
}

function resetHRA() {
    hraBasic.value = 600000;
    hraDA.value = 0;
    hraReceived.value = 240000;
    hraPaid.value = 180000;
    cityType = 'metro';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    calculateHRA();
    showToast('🔄 Reset!');
}

function copyHRA() {
    const txt = `🏠 HRA Calculator\n\nCity: ${cityType === 'metro' ? 'Metro' : 'Non-Metro'}\nBasic Salary: ${fmtINR(parseFloat(hraBasic.value))}\nHRA Received: ${fmtINR(parseFloat(hraReceived.value))}\nRent Paid: ${fmtINR(parseFloat(hraPaid.value))}\n\nHRA Exemption: ${$('hraExemption').textContent}\nTaxable HRA: ${$('hraTaxable').textContent}\nTax Saved: ${$('hraTaxSaved').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/hra-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareHRA() {
    shareContent('HRA Calculator - AI ToolCor', `My HRA exemption: ${$('hraExemption').textContent} - Tax saved ${$('hraTaxSaved').textContent}!`, location.href);
}

[hraBasic, hraDA, hraReceived, hraPaid].forEach(el => el.addEventListener('input', calculateHRA));

document.addEventListener('DOMContentLoaded', () => {
    calculateHRA();
    renderRelatedTools('hra-calculator', 'finance', 6);
    console.log('✅ HRA Calculator Loaded');
});
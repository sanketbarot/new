'use strict';

const $ = id => document.getElementById(id);
const tipBill = $('tipBill');
const tipPercent = $('tipPercent');
const tipPercentRange = $('tipPercentRange');
const tipPeople = $('tipPeople');

function fmtINR(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function setTip(pct) {
    tipPercent.value = pct;
    tipPercentRange.value = pct;
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', parseFloat(b.textContent) === pct);
    });
    calculateTip();
}

function calculateTip() {
    const bill = parseFloat(tipBill.value) || 0;
    const pct = parseFloat(tipPercent.value) || 0;
    const people = parseInt(tipPeople.value) || 1;
    
    if (bill <= 0) {
        showToast('⚠️ Enter valid bill amount');
        return;
    }
    
    const tip = (bill * pct) / 100;
    const total = bill + tip;
    const perPerson = total / people;
    const tipPerPerson = tip / people;
    const billPerPerson = bill / people;
    
    $('tipTotal').textContent = fmtINR(total);
    $('tipAmount').textContent = fmtINR(tip);
    $('tipShare').textContent = fmtINR(perPerson);
    $('tipPerPerson').textContent = people > 1 ? `${fmtINR(perPerson)} per person (${people} people)` : `Single person total`;
    
    $('tipBreakdown').innerHTML = `
        <div class="tax-row"><span>Bill Amount</span><strong>${fmtINR(bill)}</strong></div>
        <div class="tax-row"><span>Tip (${pct}%)</span><strong style="color:#059669;">+ ${fmtINR(tip)}</strong></div>
        <div class="tax-row total"><span>Total Amount</span><strong>${fmtINR(total)}</strong></div>
        ${people > 1 ? `
        <div class="tax-row"><span>Number of People</span><strong>${people}</strong></div>
        <div class="tax-row"><span>Bill per Person</span><strong>${fmtINR(billPerPerson)}</strong></div>
        <div class="tax-row"><span>Tip per Person</span><strong>${fmtINR(tipPerPerson)}</strong></div>
        <div class="tax-row total"><span>Total per Person</span><strong style="color:#059669;">${fmtINR(perPerson)}</strong></div>
        ` : ''}
    `;
    
    let insight = '';
    if (pct >= 20) insight = `🌟 Generous tip (${pct}%)! Server will love you.`;
    else if (pct >= 15) insight = `👍 Standard generous tip (${pct}%). Good service rewarded!`;
    else if (pct >= 10) insight = `✅ Standard tip (${pct}%). Most common in India.`;
    else if (pct >= 5) insight = `📊 Minimum tip (${pct}%). Consider 10% for average service.`;
    else insight = `⚠️ No/low tip. Only skip if service was poor.`;
    $('tipInsight').textContent = insight;
}

function resetTip() {
    tipBill.value = 1000;
    tipPercent.value = 10;
    tipPercentRange.value = 10;
    tipPeople.value = 1;
    document.querySelectorAll('.gst-rate-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === '10%'));
    calculateTip();
    showToast('🔄 Reset!');
}

function copyTip() {
    const txt = `💰 Tip Calculator\n\nBill: ${fmtINR(parseFloat(tipBill.value))}\nTip: ${tipPercent.value}% = ${$('tipAmount').textContent}\nTotal: ${$('tipTotal').textContent}\nPeople: ${tipPeople.value}\nPer Person: ${$('tipShare').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/tip-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareTip() {
    shareContent('Tip Calculator', `Total with tip: ${$('tipTotal').textContent}`, location.href);
}

[tipBill, tipPercent, tipPeople].forEach(el => el.addEventListener('input', calculateTip));
tipPercentRange.addEventListener('input', () => { tipPercent.value = tipPercentRange.value; calculateTip(); });

document.addEventListener('DOMContentLoaded', () => {
    calculateTip();
    renderRelatedTools('tip-calculator', 'daily-use', 6);
    console.log('✅ Tip Calculator Loaded');
});
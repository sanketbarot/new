'use strict';

const $ = id => document.getElementById(id);
const discOriginal = $('discOriginal');
const discPercent = $('discPercent');
const discPercentRange = $('discPercentRange');

function fmtINR(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function setDiscount(pct) {
    discPercent.value = pct;
    discPercentRange.value = pct;
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', parseFloat(b.textContent) === pct);
    });
    calculateDiscount();
}

function calculateDiscount() {
    const original = parseFloat(discOriginal.value) || 0;
    const pct = parseFloat(discPercent.value) || 0;
    
    if (original <= 0) {
        showToast('⚠️ Enter original price');
        return;
    }
    
    const discount = (original * pct) / 100;
    const final = original - discount;
    
    $('discFinal').textContent = fmtINR(final);
    $('discOrigDisp').textContent = fmtINR(original);
    $('discSaved').textContent = fmtINR(discount);
    $('discFinalSub').textContent = `After ${pct}% discount`;
    
    $('discBreakdown').innerHTML = `
        <div class="tax-row">
            <span>Original Price</span>
            <strong>${fmtINR(original)}</strong>
        </div>
        <div class="tax-row">
            <span>Discount (${pct}%)</span>
            <strong style="color:#DC2626;">- ${fmtINR(discount)}</strong>
        </div>
        <div class="tax-row total">
            <span>Final Price</span>
            <strong style="color:#059669;">${fmtINR(final)}</strong>
        </div>
        <div class="tax-row">
            <span>You Save</span>
            <strong>${fmtINR(discount)} (${pct}%)</strong>
        </div>
    `;
    
    let insight = '';
    if (pct >= 70) insight = `🎉 HUGE Savings! ${pct}% off saves you ${fmtINR(discount)}. Amazing deal!`;
    else if (pct >= 50) insight = `🔥 Great deal! Half price or more - save ${fmtINR(discount)}.`;
    else if (pct >= 30) insight = `👍 Good discount! ${pct}% off (₹${Math.round(discount)} saved).`;
    else if (pct >= 10) insight = `💡 Small discount of ${pct}%. Better to wait for bigger sales.`;
    else insight = `📊 Minimal discount. Compare prices before buying.`;
    $('discInsight').textContent = insight;
}

discOriginal.addEventListener('input', calculateDiscount);
discPercent.addEventListener('input', () => { 
    discPercentRange.value = discPercent.value; 
    calculateDiscount();
});
discPercentRange.addEventListener('input', () => { 
    discPercent.value = discPercentRange.value; 
    calculateDiscount();
});

function resetDiscount() {
    discOriginal.value = 2000;
    discPercent.value = 25;
    discPercentRange.value = 25;
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.trim() === '25%');
    });
    calculateDiscount();
    showToast('🔄 Reset!');
}

function copyDisc() {
    const txt = `🏷️ Discount Calculator\n\nOriginal: ${$('discOrigDisp').textContent}\nDiscount: ${discPercent.value}%\nSaved: ${$('discSaved').textContent}\nFinal: ${$('discFinal').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/discount-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareDisc() {
    shareContent('Discount Calculator', `Got ${discPercent.value}% off - saved ${$('discSaved').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    calculateDiscount();
    renderRelatedTools('discount-calculator', 'finance', 6);
    console.log('✅ Discount Calculator Loaded');
});
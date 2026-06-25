'use strict';

const $ = id => document.getElementById(id);
const markCost = $('markCost');
const markPercent = $('markPercent');
const markPercentRange = $('markPercentRange');

function fmtINR(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function setMarkup(pct) {
    markPercent.value = pct;
    markPercentRange.value = pct;
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', parseFloat(b.textContent) === pct);
    });
    calculateMarkup();
}

function calculateMarkup() {
    const cost = parseFloat(markCost.value) || 0;
    const markupPct = parseFloat(markPercent.value) || 0;
    
    if (cost <= 0) {
        showToast('⚠️ Enter valid cost');
        return;
    }
    
    const profit = (cost * markupPct) / 100;
    const sellingPrice = cost + profit;
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    
    $('markSelling').textContent = fmtINR(sellingPrice);
    $('markProfit').textContent = fmtINR(profit);
    $('markMargin').textContent = margin.toFixed(2) + '%';
    $('markSellingSub').textContent = `After ${markupPct}% markup`;
    
    $('markBreakdown').innerHTML = `
        <div class="tax-row"><span>Cost Price</span><strong>${fmtINR(cost)}</strong></div>
        <div class="tax-row"><span>Markup Percentage</span><strong>${markupPct}%</strong></div>
        <div class="tax-row"><span>Profit per Unit</span><strong style="color:#059669;">+ ${fmtINR(profit)}</strong></div>
        <div class="tax-row total"><span>Selling Price</span><strong>${fmtINR(sellingPrice)}</strong></div>
        <div class="tax-row"><span>Profit Margin</span><strong>${margin.toFixed(2)}%</strong></div>
        <div class="tax-row"><span>Markup-to-Margin Conversion</span><strong>Markup ${markupPct}% = Margin ${margin.toFixed(2)}%</strong></div>
    `;
    
    let insight = '';
    if (markupPct >= 100) insight = `💎 Premium markup (${markupPct}%)! Great for luxury/exclusive items.`;
    else if (markupPct >= 50) insight = `📈 Good markup (${markupPct}%) = ${margin.toFixed(1)}% margin. Standard for most retail.`;
    else if (markupPct >= 20) insight = `👍 Moderate markup. Volume-based business model.`;
    else insight = `⚠️ Low markup (${markupPct}%). Need high sales volume to be profitable.`;
    $('markInsight').textContent = insight;
}

function resetMarkup() {
    markCost.value = 100;
    markPercent.value = 50;
    markPercentRange.value = 50;
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.trim() === '50%');
    });
    calculateMarkup();
    showToast('🔄 Reset!');
}

function copyMark() {
    const txt = `🏷️ Markup Calculator\n\nCost: ${fmtINR(parseFloat(markCost.value))}\nMarkup: ${markPercent.value}%\n\nSelling Price: ${$('markSelling').textContent}\nProfit: ${$('markProfit').textContent}\nMargin: ${$('markMargin').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/markup-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareMark() {
    shareContent('Markup Calculator', `Selling price: ${$('markSelling').textContent} at ${markPercent.value}% markup`, location.href);
}

markCost.addEventListener('input', calculateMarkup);
markPercent.addEventListener('input', () => { markPercentRange.value = markPercent.value; calculateMarkup(); });
markPercentRange.addEventListener('input', () => { markPercent.value = markPercentRange.value; calculateMarkup(); });

document.addEventListener('DOMContentLoaded', () => {
    calculateMarkup();
    renderRelatedTools('markup-calculator', 'business', 6);
    console.log('✅ Markup Calculator Loaded');
});
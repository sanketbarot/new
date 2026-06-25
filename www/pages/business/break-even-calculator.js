'use strict';

const $ = id => document.getElementById(id);
const beFixed = $('beFixed');
const beVariable = $('beVariable');
const bePrice = $('bePrice');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateBreakEven() {
    const fixed = parseFloat(beFixed.value) || 0;
    const variable = parseFloat(beVariable.value) || 0;
    const price = parseFloat(bePrice.value) || 0;
    
    if (price <= variable) {
        showToast('⚠️ Price must be greater than variable cost');
        return;
    }
    
    if (fixed <= 0 || price <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const contribution = price - variable;
    const beUnits = fixed / contribution;
    const beRevenue = beUnits * price;
    const contributionMargin = (contribution / price) * 100;
    const beDaily = beUnits / 30;
    
    $('beUnits').textContent = Math.ceil(beUnits).toLocaleString('en-IN');
    $('beRevenue').textContent = fmtINR(beRevenue);
    $('beContribution').textContent = contributionMargin.toFixed(1) + '%';
    
    $('beBreakdown').innerHTML = `
        <div class="tax-row"><span>Fixed Costs (Monthly)</span><strong>${fmtINR(fixed)}</strong></div>
        <div class="tax-row"><span>Variable Cost per Unit</span><strong>${fmtINR(variable)}</strong></div>
        <div class="tax-row"><span>Selling Price per Unit</span><strong>${fmtINR(price)}</strong></div>
        <div class="tax-row"><span>Contribution per Unit</span><strong style="color:#059669;">${fmtINR(contribution)}</strong></div>
        <div class="tax-row total"><span>Break-Even Units</span><strong>${Math.ceil(beUnits).toLocaleString('en-IN')} units</strong></div>
        <div class="tax-row"><span>Break-Even Revenue</span><strong>${fmtINR(beRevenue)}</strong></div>
        <div class="tax-row"><span>Units per Day</span><strong>${Math.ceil(beDaily)} units</strong></div>
        <div class="tax-row"><span>Contribution Margin</span><strong>${contributionMargin.toFixed(2)}%</strong></div>
    `;
    
    let insight = '';
    if (beDaily <= 5) {
        insight = `🚀 Great! Only ${Math.ceil(beDaily)} units/day to break even. Achievable target!`;
    } else if (beDaily <= 50) {
        insight = `👍 Reasonable target: ${Math.ceil(beDaily)} units/day. Plan marketing accordingly.`;
    } else if (beDaily <= 200) {
        insight = `📊 ${Math.ceil(beDaily)} units/day needed. Consider scaling sales or pricing strategy.`;
    } else {
        insight = `⚠️ High target: ${Math.ceil(beDaily)} units/day. Review fixed costs or pricing.`;
    }
    $('beInsight').textContent = insight;
}

function resetBreakEven() {
    beFixed.value = 50000;
    beVariable.value = 60;
    bePrice.value = 100;
    calculateBreakEven();
    showToast('🔄 Reset!');
}

function copyBE() {
    const txt = `⚖️ Break Even Calculator\n\nFixed Costs: ${fmtINR(parseFloat(beFixed.value))}\nVariable Cost: ${fmtINR(parseFloat(beVariable.value))}\nPrice: ${fmtINR(parseFloat(bePrice.value))}\n\nBreak-Even Units: ${$('beUnits').textContent}\nBreak-Even Revenue: ${$('beRevenue').textContent}\nContribution Margin: ${$('beContribution').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/break-even-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareBE() {
    shareContent('Break Even Calculator', `My BEP: ${$('beUnits').textContent} units/month`, location.href);
}

[beFixed, beVariable, bePrice].forEach(el => el.addEventListener('input', calculateBreakEven));

document.addEventListener('DOMContentLoaded', () => {
    calculateBreakEven();
    renderRelatedTools('break-even-calculator', 'business', 6);
    console.log('✅ Break Even Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const pmCost = $('pmCost');
const pmRevenue = $('pmRevenue');
const pmExpenses = $('pmExpenses');

function fmtINR(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function calculateProfit() {
    const cost = parseFloat(pmCost.value) || 0;
    const revenue = parseFloat(pmRevenue.value) || 0;
    const expenses = parseFloat(pmExpenses.value) || 0;
    
    if (cost <= 0 || revenue <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const grossProfit = revenue - cost;
    const netProfit = grossProfit - expenses;
    const grossMargin = (grossProfit / revenue) * 100;
    const netMargin = (netProfit / revenue) * 100;
    const markup = (grossProfit / cost) * 100;
    const breakeven = cost + expenses;
    
    $('pmMargin').textContent = grossMargin.toFixed(2) + '%';
    $('pmGrossProfit').textContent = fmtINR(grossProfit);
    $('pmNetProfit').textContent = fmtINR(netProfit);
    $('pmMarkup').textContent = markup.toFixed(1) + '%';
    $('pmNetMargin').textContent = netMargin.toFixed(2) + '%';
    
    $('pmBreakdown').innerHTML = `
        <div class="tax-row"><span>Revenue (Selling Price)</span><strong>${fmtINR(revenue)}</strong></div>
        <div class="tax-row"><span>Cost of Goods Sold (COGS)</span><strong style="color:#DC2626;">- ${fmtINR(cost)}</strong></div>
        <div class="tax-row total"><span>Gross Profit</span><strong style="color:#059669;">${fmtINR(grossProfit)}</strong></div>
        <div class="tax-row"><span>Operating Expenses</span><strong style="color:#DC2626;">- ${fmtINR(expenses)}</strong></div>
        <div class="tax-row total"><span>Net Profit</span><strong style="color:#059669;">${fmtINR(netProfit)}</strong></div>
        <div class="tax-row"><span>Break-even Point</span><strong>${fmtINR(breakeven)}</strong></div>
    `;
    
    let insight = '';
    if (grossMargin >= 50) {
        insight = `🚀 Excellent! ${grossMargin.toFixed(1)}% gross margin is premium. Maintain quality and customer value.`;
    } else if (grossMargin >= 30) {
        insight = `👍 Healthy! ${grossMargin.toFixed(1)}% gross margin is good. Industry average is 25-40%.`;
    } else if (grossMargin >= 15) {
        insight = `⚠️ Tight margins (${grossMargin.toFixed(1)}%). Consider reducing costs or premium pricing.`;
    } else if (grossMargin > 0) {
        insight = `🚨 Low margin (${grossMargin.toFixed(1)}%). Review pricing strategy and cost structure urgently.`;
    } else {
        insight = `❌ Loss! You're selling below cost. Increase prices or reduce costs immediately.`;
    }
    $('pmInsight').textContent = insight;
}

function resetProfit() {
    pmCost.value = 100;
    pmRevenue.value = 150;
    pmExpenses.value = 20;
    calculateProfit();
    showToast('🔄 Reset!');
}

function copyProfit() {
    const txt = `💰 Profit Margin Calculator\n\nCost: ${fmtINR(parseFloat(pmCost.value))}\nRevenue: ${fmtINR(parseFloat(pmRevenue.value))}\nExpenses: ${fmtINR(parseFloat(pmExpenses.value))}\n\nGross Profit: ${$('pmGrossProfit').textContent}\nGross Margin: ${$('pmMargin').textContent}\nNet Profit: ${$('pmNetProfit').textContent}\nMarkup: ${$('pmMarkup').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/profit-margin-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareProfit() {
    shareContent('Profit Margin', `My profit margin: ${$('pmMargin').textContent}`, location.href);
}

[pmCost, pmRevenue, pmExpenses].forEach(el => el.addEventListener('input', calculateProfit));

document.addEventListener('DOMContentLoaded', () => {
    calculateProfit();
    renderRelatedTools('profit-margin-calculator', 'business', 6);
    console.log('✅ Profit Margin Calculator Loaded');
});
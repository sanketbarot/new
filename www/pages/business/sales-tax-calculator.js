'use strict';

const $ = id => document.getElementById(id);
const stAmount = $('stAmount');
const stRate = $('stRate');
const stRateRange = $('stRateRange');
let stType = 'add';

function fmtINR(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function setStType(type, event) {
    stType = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('stMainLabel').textContent = type === 'add' ? 'Total Amount' : 'Original Amount';
    calculateSalesTax();
}

function setStRate(rate) {
    stRate.value = rate;
    stRateRange.value = rate;
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', parseFloat(b.textContent) === rate);
    });
    calculateSalesTax();
}

function calculateSalesTax() {
    const amount = parseFloat(stAmount.value) || 0;
    const rate = parseFloat(stRate.value) || 0;
    
    if (amount <= 0) {
        showToast('⚠️ Enter valid amount');
        return;
    }
    
    let net, tax, total;
    
    if (stType === 'add') {
        net = amount;
        tax = (amount * rate) / 100;
        total = net + tax;
    } else {
        total = amount;
        net = amount / (1 + rate / 100);
        tax = total - net;
    }
    
    $('stTotal').textContent = fmtINR(stType === 'add' ? total : net);
    $('stNet').textContent = fmtINR(net);
    $('stTaxAmt').textContent = fmtINR(tax);
    $('stSub').textContent = stType === 'add' ? `Including ${rate}% tax` : `Before ${rate}% tax`;
    
    $('stBreakdown').innerHTML = `
        <div class="tax-row"><span>Net Amount</span><strong>${fmtINR(net)}</strong></div>
        <div class="tax-row"><span>Tax Rate</span><strong>${rate}%</strong></div>
        <div class="tax-row"><span>Tax Amount</span><strong style="color:#DC2626;">+ ${fmtINR(tax)}</strong></div>
        <div class="tax-row total"><span>${stType === 'add' ? 'Total (with tax)' : 'Original (with tax)'}</span><strong>${fmtINR(stType === 'add' ? total : amount)}</strong></div>
    `;
    
    $('stInsight').textContent = `📊 Tax of ${fmtINR(tax)} at ${rate}% rate. ${stType === 'add' ? 'Added to' : 'Removed from'} ${fmtINR(stType === 'add' ? net : amount)}.`;
}

function resetSalesTax() {
    stAmount.value = 1000;
    stRate.value = 10;
    stRateRange.value = 10;
    stType = 'add';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    document.querySelectorAll('.gst-rate-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === '10%'));
    calculateSalesTax();
    showToast('🔄 Reset!');
}

function copySalesTax() {
    const txt = `📊 Sales Tax\n\nAmount: ${fmtINR(parseFloat(stAmount.value))}\nRate: ${stRate.value}%\n\nNet: ${$('stNet').textContent}\nTax: ${$('stTaxAmt').textContent}\nTotal: ${$('stTotal').textContent}\n\nhttps://calculator.aitoolcor.com/pages/business/sales-tax-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareSalesTax() {
    shareContent('Sales Tax Calculator', `Tax: ${$('stTaxAmt').textContent} at ${stRate.value}%`, location.href);
}

stAmount.addEventListener('input', calculateSalesTax);
stRate.addEventListener('input', () => { stRateRange.value = stRate.value; calculateSalesTax(); });
stRateRange.addEventListener('input', () => { stRate.value = stRateRange.value; calculateSalesTax(); });

document.addEventListener('DOMContentLoaded', () => {
    calculateSalesTax();
    renderRelatedTools('sales-tax-calculator', 'business', 6);
    console.log('✅ Sales Tax Calculator Loaded');
});
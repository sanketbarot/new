'use strict';

const $ = id => document.getElementById(id);

function setPow(base, exp) {
    $('powBase').value = base;
    $('powExp').value = exp;
    calculatePower();
}

function calculatePower() {
    const base = parseFloat($('powBase').value) || 0;
    const exp = parseFloat($('powExp').value) || 0;
    
    const result = Math.pow(base, exp);
    
    if (!isFinite(result)) {
        showToast('⚠️ Result too large/infinite');
        return;
    }
    
    const formatted = Math.abs(result) >= 1e15 
        ? result.toExponential(6)
        : result.toLocaleString('en-IN', { maximumFractionDigits: 8 });
    
    $('powResult').textContent = formatted;
    $('powSub').textContent = `${base}^${exp} = ${formatted}`;
    
    // Power table
    let breakdown = '';
    for (let i = 1; i <= 10; i++) {
        const r = Math.pow(base, i);
        breakdown += `<div class="tax-row ${i === exp ? 'total' : ''}"><span>${base}^${i}</span><strong>${r.toLocaleString('en-IN', { maximumFractionDigits: 6 })}</strong></div>`;
    }
    
    $('powBreakdown').innerHTML = breakdown;
    
    let insight = `📐 ${base}^${exp} = ${formatted}`;
    if (base === 2 && exp === 10) insight += ' (Kilobyte)';
    if (base === 10 && exp === 6) insight += ' (Million)';
    if (base === 10 && exp === 9) insight += ' (Billion)';
    $('powInsight').textContent = insight;
}

function resetPower() {
    $('powBase').value = 2;
    $('powExp').value = 10;
    calculatePower();
    showToast('🔄 Reset!');
}

function copyPow() {
    const txt = `^ Power Calculator\n\n${$('powSub').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/power-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function sharePow() {
    shareContent('Power Calculator', $('powSub').textContent, location.href);
}

['powBase', 'powExp'].forEach(id => $(id).addEventListener('input', calculatePower));

document.addEventListener('DOMContentLoaded', () => {
    calculatePower();
    renderRelatedTools('power-calculator', 'math', 6);
    console.log('✅ Power Calculator Loaded');
});
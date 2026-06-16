'use strict';

const $ = id => document.getElementById(id);
const sqrtNumber = $('sqrtNumber');
const sqrtType = $('sqrtType');
const sqrtN = $('sqrtN');

function changeSqrtType() {
    $('customNRoot').style.display = sqrtType.value === 'n' ? 'block' : 'none';
    calculateSqrt();
}

function calculateSqrt() {
    const num = parseFloat(sqrtNumber.value) || 0;
    let n = sqrtType.value === 'n' ? parseInt(sqrtN.value) : parseInt(sqrtType.value);
    
    if (n < 2) {
        showToast('⚠️ Root must be 2 or more');
        return;
    }
    
    if (num < 0 && n % 2 === 0) {
        showToast('⚠️ Even root of negative number not real');
        return;
    }
    
    let result;
    if (num < 0) {
        result = -Math.pow(-num, 1/n);
    } else {
        result = Math.pow(num, 1/n);
    }
    
    const isPerfect = Math.abs(Math.round(result) - result) < 1e-10;
    const labels = { 2: 'Square Root', 3: 'Cube Root', 4: '4th Root', 5: '5th Root' };
    const symbols = { 2: '√', 3: '∛', 4: '∜', 5: '⁵√' };
    
    const label = labels[n] || `${n}th Root`;
    const symbol = symbols[n] || `${n}√`;
    
    $('sqrtLabel').textContent = label;
    $('sqrtResult').textContent = isPerfect ? Math.round(result) : result.toFixed(6).replace(/\.?0+$/, '');
    $('sqrtSub').textContent = `${symbol}${num} = ${isPerfect ? Math.round(result) : result.toFixed(4)}`;
    
    // All roots breakdown
    let breakdown = '';
    for (let i = 2; i <= 6; i++) {
        let r;
        if (num < 0 && i % 2 === 0) {
            r = 'Not real';
        } else if (num < 0) {
            r = (-Math.pow(-num, 1/i)).toFixed(4).replace(/\.?0+$/, '');
        } else {
            r = Math.pow(num, 1/i).toFixed(6).replace(/\.?0+$/, '');
        }
        const sym = {2:'√', 3:'∛', 4:'∜', 5:'⁵√', 6:'⁶√'}[i];
        breakdown += `<div class="tax-row ${i === n ? 'total' : ''}"><span>${sym}${num} (${i}${i===2?'nd':i===3?'rd':'th'} root)</span><strong>${r}</strong></div>`;
    }
    
    if (num >= 0) {
        breakdown += `<div class="tax-row"><span>Square (${num}²)</span><strong>${(num * num).toLocaleString('en-IN')}</strong></div>`;
        breakdown += `<div class="tax-row"><span>Cube (${num}³)</span><strong>${(num ** 3).toLocaleString('en-IN')}</strong></div>`;
    }
    
    $('sqrtBreakdown').innerHTML = breakdown;
    
    let insight = '';
    if (isPerfect) {
        insight = `🎯 Perfect ${label.toLowerCase()}! ${symbol}${num} = ${Math.round(result)}`;
    } else {
        insight = `📐 ${symbol}${num} = ${result.toFixed(6).replace(/\.?0+$/, '')} (irrational number)`;
    }
    $('sqrtInsight').textContent = insight;
}

function resetSqrt() {
    sqrtNumber.value = 144;
    sqrtType.value = '2';
    sqrtN.value = 3;
    $('customNRoot').style.display = 'none';
    calculateSqrt();
    showToast('🔄 Reset!');
}

function copySqrt() {
    const txt = `√ Square Root\n\n${$('sqrtSub').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/square-root-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareSqrt() {
    shareContent('Square Root Calculator', $('sqrtSub').textContent, location.href);
}

[sqrtNumber, sqrtType, sqrtN].forEach(el => el.addEventListener('input', calculateSqrt));
sqrtType.addEventListener('change', changeSqrtType);

document.addEventListener('DOMContentLoaded', () => {
    calculateSqrt();
    renderRelatedTools('square-root-calculator', 'math', 6);
    console.log('✅ Square Root Calculator Loaded');
});
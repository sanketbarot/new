'use strict';

const $ = id => document.getElementById(id);
let fracOp = '+';

function setFracOp(op, event) {
    fracOp = op;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateFraction();
}

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function simplify(num, den) {
    if (den === 0) return [NaN, NaN];
    if (num === 0) return [0, 1];
    const g = gcd(num, den);
    let n = num / g, d = den / g;
    if (d < 0) { n = -n; d = -d; }
    return [n, d];
}

function calculateFraction() {
    const n1 = parseInt($('frac1Num').value) || 0;
    const d1 = parseInt($('frac1Den').value) || 1;
    const n2 = parseInt($('frac2Num').value) || 0;
    const d2 = parseInt($('frac2Den').value) || 1;
    
    if (d1 === 0 || d2 === 0) {
        showToast('⚠️ Denominator cannot be zero');
        return;
    }
    
    let resultNum, resultDen, steps;
    
    if (fracOp === '+') {
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        steps = `(${n1} × ${d2}) + (${n2} × ${d1}) / (${d1} × ${d2}) = ${resultNum}/${resultDen}`;
    } else if (fracOp === '-') {
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        steps = `(${n1} × ${d2}) - (${n2} × ${d1}) / (${d1} × ${d2}) = ${resultNum}/${resultDen}`;
    } else if (fracOp === '*') {
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        steps = `${n1} × ${n2} / ${d1} × ${d2} = ${resultNum}/${resultDen}`;
    } else { // division
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        steps = `${n1}/${d1} ÷ ${n2}/${d2} = ${n1}/${d1} × ${d2}/${n2} = ${resultNum}/${resultDen}`;
    }
    
    if (resultDen === 0) {
        showToast('⚠️ Result undefined');
        return;
    }
    
    const [simpNum, simpDen] = simplify(resultNum, resultDen);
    const decimal = simpNum / simpDen;
    
    let resultStr = simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
    
    // Mixed number if applicable
    let mixed = '';
    if (Math.abs(simpNum) >= Math.abs(simpDen) && simpDen !== 1) {
        const whole = Math.trunc(simpNum / simpDen);
        const remainder = Math.abs(simpNum % simpDen);
        if (remainder > 0) {
            mixed = ` = ${whole} ${remainder}/${Math.abs(simpDen)}`;
        }
    }
    
    $('fracResult').textContent = resultStr;
    $('fracDecimal').textContent = `= ${decimal.toFixed(6).replace(/\.?0+$/, '')}${mixed}`;
    
    $('fracSteps').innerHTML = `
        <div class="tax-row"><span>Fraction 1</span><strong>${n1}/${d1}</strong></div>
        <div class="tax-row"><span>Operation</span><strong>${fracOp}</strong></div>
        <div class="tax-row"><span>Fraction 2</span><strong>${n2}/${d2}</strong></div>
        <div class="tax-row"><span>Calculation</span><strong style="font-size:12px;">${steps}</strong></div>
        <div class="tax-row total"><span>Result (Simplified)</span><strong style="color:#059669;">${resultStr}</strong></div>
        <div class="tax-row"><span>Decimal</span><strong>${decimal.toFixed(6).replace(/\.?0+$/, '')}</strong></div>
        ${mixed ? `<div class="tax-row"><span>Mixed Number</span><strong>${mixed.replace(' = ', '')}</strong></div>` : ''}
    `;
    
    $('fracInsight').textContent = `📐 ${n1}/${d1} ${fracOp} ${n2}/${d2} = ${resultStr} = ${decimal.toFixed(4)}`;
}

function resetFraction() {
    $('frac1Num').value = 1; $('frac1Den').value = 2;
    $('frac2Num').value = 1; $('frac2Den').value = 4;
    fracOp = '+';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    calculateFraction();
    showToast('🔄 Reset!');
}

function copyFrac() {
    const txt = `➗ Fraction Calculator\n\n${$('frac1Num').value}/${$('frac1Den').value} ${fracOp} ${$('frac2Num').value}/${$('frac2Den').value} = ${$('fracResult').textContent}\nDecimal: ${$('fracDecimal').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/fraction-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareFrac() {
    shareContent('Fraction Calculator', `Result: ${$('fracResult').textContent}`, location.href);
}

['frac1Num', 'frac1Den', 'frac2Num', 'frac2Den'].forEach(id => 
    $(id).addEventListener('input', calculateFraction)
);

document.addEventListener('DOMContentLoaded', () => {
    calculateFraction();
    renderRelatedTools('fraction-calculator', 'math', 6);
    console.log('✅ Fraction Calculator Loaded');
});
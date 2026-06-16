'use strict';

let calcExpr = '';
let calcHistory = '';

function appendCalc(val) {
    if (calcExpr === '0' && !'+-*/.'.includes(val)) {
        calcExpr = val;
    } else {
        calcExpr += val;
    }
    updateDisplay();
}

function clearCalc() {
    calcExpr = '';
    calcHistory = '';
    updateDisplay();
}

function backspaceCalc() {
    calcExpr = calcExpr.slice(0, -1);
    updateDisplay();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function calculateCalc() {
    try {
        let expr = calcExpr;
        // Handle factorial
        expr = expr.replace(/(\d+)!/g, (m, n) => factorial(parseInt(n)));
        
        const result = eval(expr);
        if (isNaN(result) || !isFinite(result)) {
            calcExpr = 'Error';
        } else {
            calcHistory = calcExpr + ' =';
            calcExpr = String(Math.round(result * 1e10) / 1e10);
        }
    } catch (e) {
        calcExpr = 'Error';
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('calcCurrent').textContent = calcExpr || '0';
    document.getElementById('calcHistory').textContent = calcHistory;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendCalc(e.key);
    else if (e.key === '.') appendCalc('.');
    else if (e.key === '+') appendCalc('+');
    else if (e.key === '-') appendCalc('-');
    else if (e.key === '*') appendCalc('*');
    else if (e.key === '/') { e.preventDefault(); appendCalc('/'); }
    else if (e.key === '(') appendCalc('(');
    else if (e.key === ')') appendCalc(')');
    else if (e.key === 'Enter' || e.key === '=') calculateCalc();
    else if (e.key === 'Backspace') backspaceCalc();
    else if (e.key === 'Escape') clearCalc();
});

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    renderRelatedTools('scientific-calculator', 'math', 6);
    console.log('✅ Scientific Calculator Loaded');
});
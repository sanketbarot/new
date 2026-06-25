'use strict';

const $ = id => document.getElementById(id);

function changeProbType() {
    const type = $('probType').value;
    $('singleInputs').style.display = type === 'single' ? 'block' : 'none';
    $('multiInputs').style.display = type !== 'single' ? 'block' : 'none';
    $('probIntersectGroup').style.display = type === 'conditional' ? 'block' : 'none';
    calculateProb();
}

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function decimalToFraction(decimal) {
    if (decimal === 0) return '0/1';
    const tolerance = 1e-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
    do {
        const a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    return `${h1}/${k1}`;
}

function calculateProb() {
    const type = $('probType').value;
    let prob;
    let breakdown;
    
    if (type === 'single') {
        const fav = parseFloat($('probEvents').value) || 0;
        const total = parseFloat($('probTotal').value) || 0;
        
        if (total <= 0 || fav > total) {
            showToast('⚠️ Invalid values');
            return;
        }
        
        prob = fav / total;
        breakdown = `
            <div class="tax-row"><span>Favorable Outcomes</span><strong>${fav}</strong></div>
            <div class="tax-row"><span>Total Outcomes</span><strong>${total}</strong></div>
            <div class="tax-row"><span>Formula</span><strong>P(E) = ${fav}/${total}</strong></div>
            <div class="tax-row total"><span>Probability</span><strong style="color:#059669;">${(prob * 100).toFixed(2)}%</strong></div>
        `;
    } else if (type === 'and') {
        const pA = parseFloat($('probA').value) || 0;
        const pB = parseFloat($('probB').value) || 0;
        prob = pA * pB;
        breakdown = `
            <div class="tax-row"><span>P(A)</span><strong>${pA}</strong></div>
            <div class="tax-row"><span>P(B)</span><strong>${pB}</strong></div>
            <div class="tax-row"><span>Formula</span><strong>P(A ∩ B) = P(A) × P(B)</strong></div>
            <div class="tax-row total"><span>P(A AND B)</span><strong style="color:#059669;">${(prob * 100).toFixed(2)}%</strong></div>
        `;
    } else if (type === 'or') {
        const pA = parseFloat($('probA').value) || 0;
        const pB = parseFloat($('probB').value) || 0;
        const intersect = pA * pB; // assuming independent
        prob = pA + pB - intersect;
        breakdown = `
            <div class="tax-row"><span>P(A)</span><strong>${pA}</strong></div>
            <div class="tax-row"><span>P(B)</span><strong>${pB}</strong></div>
            <div class="tax-row"><span>P(A ∩ B)</span><strong>${intersect.toFixed(4)}</strong></div>
            <div class="tax-row"><span>Formula</span><strong>P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</strong></div>
            <div class="tax-row total"><span>P(A OR B)</span><strong style="color:#059669;">${(prob * 100).toFixed(2)}%</strong></div>
        `;
    } else { // conditional
        const pIntersect = parseFloat($('probIntersect').value) || 0;
        const pB = parseFloat($('probB').value) || 0;
        if (pB === 0) { showToast('⚠️ P(B) cannot be 0'); return; }
        prob = pIntersect / pB;
        breakdown = `
            <div class="tax-row"><span>P(A ∩ B)</span><strong>${pIntersect}</strong></div>
            <div class="tax-row"><span>P(B)</span><strong>${pB}</strong></div>
            <div class="tax-row"><span>Formula</span><strong>P(A|B) = P(A ∩ B) / P(B)</strong></div>
            <div class="tax-row total"><span>P(A | B)</span><strong style="color:#059669;">${(prob * 100).toFixed(2)}%</strong></div>
        `;
    }
    
    const percent = (prob * 100).toFixed(2);
    const fraction = decimalToFraction(prob);
    const odds = prob > 0 ? `${Math.round(prob * 100)}:${Math.round((1 - prob) * 100)}` : '0:100';
    
    $('probResult').textContent = percent + '%';
    $('probDecimal').textContent = `= ${prob.toFixed(4)} = ${fraction}`;
    $('probFraction').textContent = fraction;
    $('probOdds').textContent = odds;
    $('probBreakdown').innerHTML = breakdown;
    
    let insight = '';
    if (prob === 0) insight = '🚫 Impossible event (0% chance).';
    else if (prob < 0.1) insight = `🎲 Very unlikely (${percent}%). Like winning a lottery!`;
    else if (prob < 0.3) insight = `🎯 Unlikely (${percent}%). Don't bet on it.`;
    else if (prob < 0.5) insight = `📊 Less than 50% chance (${percent}%).`;
    else if (prob < 0.7) insight = `👍 More than 50% chance (${percent}%). Reasonable.`;
    else if (prob < 0.9) insight = `🎯 Likely (${percent}%). Good chance!`;
    else if (prob < 1) insight = `🌟 Very likely (${percent}%). Almost certain.`;
    else insight = `✅ Certain event (100% chance).`;
    $('probInsight').textContent = insight;
}

function resetProb() {
    $('probType').value = 'single';
    $('probEvents').value = 1;
    $('probTotal').value = 6;
    $('probA').value = 0.5;
    $('probB').value = 0.5;
    $('probIntersect').value = 0.25;
    changeProbType();
    showToast('🔄 Reset!');
}

function copyProb() {
    const txt = `🎲 Probability\n\nResult: ${$('probResult').textContent}\n${$('probDecimal').textContent}\nOdds: ${$('probOdds').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/probability-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareProb() {
    shareContent('Probability Calculator', `Probability: ${$('probResult').textContent}`, location.href);
}

['probEvents', 'probTotal', 'probA', 'probB', 'probIntersect'].forEach(id => 
    $(id).addEventListener('input', calculateProb)
);

document.addEventListener('DOMContentLoaded', () => {
    calculateProb();
    renderRelatedTools('probability-calculator', 'math', 6);
    console.log('✅ Probability Calculator Loaded');
});
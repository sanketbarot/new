'use strict';

const $ = id => document.getElementById(id);

function setRng(min, max, count) {
    $('rngMin').value = min;
    $('rngMax').value = max;
    $('rngCount').value = count;
    generateRandom();
}

function generateRandom() {
    const min = parseInt($('rngMin').value);
    const max = parseInt($('rngMax').value);
    const count = parseInt($('rngCount').value) || 1;
    const unique = $('rngUnique').checked;
    const sorted = $('rngSorted').checked;
    
    if (min >= max) {
        showToast('⚠️ Min must be less than Max');
        return;
    }
    
    if (unique && count > (max - min + 1)) {
        showToast('⚠️ Cannot generate unique numbers in this range');
        return;
    }
    
    if (count > 1000) {
        showToast('⚠️ Max 1000 numbers at once');
        return;
    }
    
    const numbers = [];
    const used = new Set();
    
    while (numbers.length < count) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        const num = min + (array[0] % (max - min + 1));
        
        if (unique && used.has(num)) continue;
        
        numbers.push(num);
        if (unique) used.add(num);
    }
    
    if (sorted) numbers.sort((a, b) => a - b);
    
    const resultText = numbers.length === 1 
        ? numbers[0].toLocaleString('en-IN')
        : numbers.join(', ');
    
    $('rngResult').textContent = resultText;
    $('rngSub').textContent = `${count} number(s) between ${min} and ${max}`;
    
    // Stats
    const sum = numbers.reduce((a, b) => a + b, 0);
    const avg = sum / numbers.length;
    const minVal = Math.min(...numbers);
    const maxVal = Math.max(...numbers);
    
    $('rngStats').innerHTML = `
        <div class="tax-row"><span>Count</span><strong>${count}</strong></div>
        <div class="tax-row"><span>Range</span><strong>${min} - ${max}</strong></div>
        <div class="tax-row"><span>Sum</span><strong>${sum.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Average</span><strong>${avg.toFixed(2)}</strong></div>
        <div class="tax-row"><span>Min in Result</span><strong>${minVal}</strong></div>
        <div class="tax-row"><span>Max in Result</span><strong>${maxVal}</strong></div>
        <div class="tax-row"><span>Unique</span><strong>${unique ? 'Yes' : 'No (may have duplicates)'}</strong></div>
    `;
    
    $('rngInsight').textContent = `🎲 Generated ${count} random number(s) in range [${min}, ${max}] using crypto-secure random.`;
}

function resetRng() {
    $('rngMin').value = 1;
    $('rngMax').value = 100;
    $('rngCount').value = 1;
    $('rngUnique').checked = false;
    $('rngSorted').checked = false;
    generateRandom();
    showToast('🔄 Reset!');
}

function copyRng() {
    const txt = $('rngResult').textContent;
    copyToClipboard(txt, '✅ Copied!');
}

function shareRng() {
    shareContent('Random Number Generator', `Random: ${$('rngResult').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    generateRandom();
    renderRelatedTools('random-number-generator', 'utility', 6);
    console.log('✅ Random Number Generator Loaded');
});
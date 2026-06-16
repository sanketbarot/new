'use strict';

const $ = id => document.getElementById(id);
const lcmNumbers = $('lcmNumbers');

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

function primeFactors(n) {
    const factors = {};
    n = Math.abs(n);
    for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
            factors[i] = (factors[i] || 0) + 1;
            n /= i;
        }
    }
    return factors;
}

function setLcmExample(val) {
    lcmNumbers.value = val;
    calculateLCMHCF();
}

function calculateLCMHCF() {
    const input = lcmNumbers.value;
    const nums = input.split(/[,\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
    
    if (nums.length < 2) {
        showToast('⚠️ Enter at least 2 positive numbers');
        return;
    }
    
    let hcfResult = nums[0];
    let lcmResult = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        hcfResult = gcd(hcfResult, nums[i]);
        lcmResult = lcm(lcmResult, nums[i]);
    }
    
    $('lcmValue').textContent = `${lcmResult} × ${hcfResult}`;
    $('lcmSub').textContent = `For ${nums.join(', ')}`;
    $('lcmResult').textContent = lcmResult.toLocaleString('en-IN');
    $('hcfResult').textContent = hcfResult.toLocaleString('en-IN');
    
    // Prime factorization
    let breakdown = '';
    nums.forEach(n => {
        const factors = primeFactors(n);
        const factorStr = Object.keys(factors).map(p => 
            factors[p] === 1 ? p : `${p}<sup>${factors[p]}</sup>`
        ).join(' × ');
        breakdown += `<div class="tax-row"><span>${n}</span><strong>${factorStr}</strong></div>`;
    });
    
    breakdown += `<div class="tax-row total"><span>LCM</span><strong style="color:#10B981;">${lcmResult}</strong></div>`;
    breakdown += `<div class="tax-row total"><span>HCF (GCD)</span><strong style="color:#059669;">${hcfResult}</strong></div>`;
    
    if (nums.length === 2) {
        const product = nums[0] * nums[1];
        breakdown += `<div class="tax-row"><span>Product of numbers</span><strong>${product}</strong></div>`;
        breakdown += `<div class="tax-row"><span>LCM × HCF</span><strong>${lcmResult * hcfResult}</strong></div>`;
    }
    
    $('lcmBreakdown').innerHTML = breakdown;
    
    let insight = '';
    if (hcfResult === 1) insight = `📐 Numbers are co-prime! HCF = 1, LCM = ${lcmResult}.`;
    else insight = `📐 LCM = ${lcmResult}, HCF = ${hcfResult}. Product of numbers / HCF = LCM.`;
    $('lcmInsight').textContent = insight;
}

function resetLCM() {
    lcmNumbers.value = '12, 18, 24';
    calculateLCMHCF();
    showToast('🔄 Reset!');
}

function copyLCM() {
    const txt = `🔢 LCM & HCF\n\nNumbers: ${lcmNumbers.value}\nLCM: ${$('lcmResult').textContent}\nHCF: ${$('hcfResult').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/lcm-hcf-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareLCM() {
    shareContent('LCM HCF Calculator', `LCM: ${$('lcmResult').textContent}, HCF: ${$('hcfResult').textContent}`, location.href);
}

lcmNumbers.addEventListener('input', calculateLCMHCF);

document.addEventListener('DOMContentLoaded', () => {
    calculateLCMHCF();
    renderRelatedTools('lcm-hcf-calculator', 'math', 6);
    console.log('✅ LCM HCF Calculator Loaded');
});
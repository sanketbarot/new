'use strict';

const $ = id => document.getElementById(id);

function setLogBase(base) {
    $('logBase').value = base;
    document.querySelectorAll('.gst-rate-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateLog();
}

function calculateLog() {
    const num = parseFloat($('logNumber').value) || 0;
    const base = parseFloat($('logBase').value) || 10;
    
    if (num <= 0) {
        showToast('⚠️ Number must be positive');
        return;
    }
    
    if (base <= 0 || base === 1) {
        showToast('⚠️ Base must be > 0 and ≠ 1');
        return;
    }
    
    // log_base(num) = ln(num) / ln(base)
    const result = Math.log(num) / Math.log(base);
    
    let label, sub;
    if (Math.abs(base - 10) < 0.01) {
        label = 'log₁₀';
        sub = `log₁₀(${num}) = ${result.toFixed(6).replace(/\.?0+$/, '')}`;
    } else if (Math.abs(base - Math.E) < 0.01) {
        label = 'ln (Natural Log)';
        sub = `ln(${num}) = ${result.toFixed(6).replace(/\.?0+$/, '')}`;
    } else if (Math.abs(base - 2) < 0.01) {
        label = 'log₂';
        sub = `log₂(${num}) = ${result.toFixed(6).replace(/\.?0+$/, '')}`;
    } else {
        label = `log base ${base}`;
        sub = `log_${base}(${num}) = ${result.toFixed(6).replace(/\.?0+$/, '')}`;
    }
    
    $('logLabel').textContent = label;
    $('logResult').textContent = result.toFixed(6).replace(/\.?0+$/, '');
    $('logSub').textContent = sub;
    
    // All bases
    const log10 = Math.log10(num);
    const ln = Math.log(num);
    const log2 = Math.log2(num);
    
    $('logBreakdown').innerHTML = `
        <div class="tax-row"><span>log₁₀ (Common Log)</span><strong>${log10.toFixed(6).replace(/\.?0+$/, '')}</strong></div>
        <div class="tax-row"><span>ln (Natural Log, base e)</span><strong>${ln.toFixed(6).replace(/\.?0+$/, '')}</strong></div>
        <div class="tax-row"><span>log₂ (Binary Log)</span><strong>${log2.toFixed(6).replace(/\.?0+$/, '')}</strong></div>
        <div class="tax-row total"><span>log_${base.toFixed(2)} (Selected)</span><strong style="color:#059669;">${result.toFixed(6).replace(/\.?0+$/, '')}</strong></div>
    `;
    
    // Verification
    const verification = Math.pow(base, result);
    $('logInsight').textContent = `📐 Verification: ${base}^${result.toFixed(4)} = ${verification.toFixed(4)} ${Math.abs(verification - num) < 0.001 ? '✓' : ''}`;
}

function resetLog() {
    $('logNumber').value = 100;
    $('logBase').value = 10;
    document.querySelectorAll('.gst-rate-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    calculateLog();
    showToast('🔄 Reset!');
}

function copyLog() {
    const txt = `📐 Logarithm\n\n${$('logSub').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/logarithm-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareLog() {
    shareContent('Logarithm Calculator', $('logSub').textContent, location.href);
}

['logNumber', 'logBase'].forEach(id => $(id).addEventListener('input', calculateLog));

document.addEventListener('DOMContentLoaded', () => {
    calculateLog();
    renderRelatedTools('logarithm-calculator', 'math', 6);
    console.log('✅ Logarithm Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const mfAmount = $('mfAmount');
const mfRate = $('mfRate');
const mfYears = $('mfYears');
const mfAmountRange = $('mfAmountRange');
const mfRateRange = $('mfRateRange');
const mfYearsRange = $('mfYearsRange');
let mfType = 'sip';

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function setMFType(type, event) {
    mfType = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    
    const label = $('mfAmountLabel');
    if (type === 'sip') {
        label.innerHTML = '<i class="fa-solid fa-indian-rupee-sign"></i> Monthly Investment (₹)';
        mfAmount.value = 5000;
        mfAmountRange.min = 500;
        mfAmountRange.max = 100000;
        mfAmountRange.step = 500;
        mfAmountRange.value = 5000;
    } else {
        label.innerHTML = '<i class="fa-solid fa-indian-rupee-sign"></i> Lumpsum Investment (₹)';
        mfAmount.value = 100000;
        mfAmountRange.min = 10000;
        mfAmountRange.max = 10000000;
        mfAmountRange.step = 10000;
        mfAmountRange.value = 100000;
    }
    calculateMF();
}

function calculateMF() {
    const P = parseFloat(mfAmount.value) || 0;
    const r = parseFloat(mfRate.value) || 0;
    const t = parseFloat(mfYears.value) || 0;
    
    if (P <= 0 || r <= 0 || t <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    let maturity, invested;
    
    if (mfType === 'sip') {
        // SIP Formula
        const i = r / 12 / 100;
        const n = t * 12;
        if (i === 0) {
            maturity = P * n;
        } else {
            maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        }
        invested = P * n;
    } else {
        // Lumpsum
        maturity = P * Math.pow(1 + r/100, t);
        invested = P;
    }
    
    const returns = maturity - invested;
    const invPct = (invested / maturity) * 100;
    const retPct = (returns / maturity) * 100;
    const multiplier = maturity / invested;
    
    $('mfMaturity').textContent = fmtINR(maturity);
    $('mfInvested').textContent = fmtINR(invested);
    $('mfReturns').textContent = fmtINR(returns);
    $('mfSub').textContent = `After ${t} years (${mfType === 'sip' ? 'SIP' : 'Lumpsum'})`;
    
    $('mfBarInv').style.width = invPct.toFixed(1) + '%';
    $('mfBarRet').style.width = retPct.toFixed(1) + '%';
    $('mfLegInv').textContent = `${fmtINR(invested)} (${invPct.toFixed(0)}%)`;
    $('mfLegRet').textContent = `${fmtINR(returns)} (${retPct.toFixed(0)}%)`;
    
    let insight = '';
    if (multiplier >= 5) {
        insight = `🚀 Outstanding! Your investment grows ${multiplier.toFixed(1)}x. Power of compounding + equity returns!`;
    } else if (multiplier >= 3) {
        insight = `🎯 Excellent returns! ${multiplier.toFixed(1)}x growth in ${t} years.`;
    } else if (multiplier >= 2) {
        insight = `👍 Good growth! Your money will more than double in ${t} years.`;
    } else {
        insight = `📊 ${multiplier.toFixed(1)}x growth in ${t} years. Consider longer tenure for better returns.`;
    }
    $('mfInsight').textContent = insight;
}

function setupSync() {
    mfAmountRange.addEventListener('input', () => { mfAmount.value = mfAmountRange.value; calculateMF(); });
    mfAmount.addEventListener('input', () => { mfAmountRange.value = mfAmount.value; calculateMF(); });
    mfRateRange.addEventListener('input', () => { mfRate.value = mfRateRange.value; calculateMF(); });
    mfRate.addEventListener('input', () => { mfRateRange.value = mfRate.value; calculateMF(); });
    mfYearsRange.addEventListener('input', () => { mfYears.value = mfYearsRange.value; calculateMF(); });
    mfYears.addEventListener('input', () => { mfYearsRange.value = mfYears.value; calculateMF(); });
}

function resetMF() {
    mfType = 'sip';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    setMFType('sip');
    mfRate.value = 12; mfRateRange.value = 12;
    mfYears.value = 10; mfYearsRange.value = 10;
    calculateMF();
    showToast('🔄 Reset!');
}

function copyMF() {
    const txt = `📈 Mutual Fund Calculator\n\nType: ${mfType === 'sip' ? 'SIP' : 'Lumpsum'}\nAmount: ${fmtINR(parseFloat(mfAmount.value))}\nRate: ${mfRate.value}%\nYears: ${mfYears.value}\n\nMaturity: ${$('mfMaturity').textContent}\nInvested: ${$('mfInvested').textContent}\nReturns: ${$('mfReturns').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/mutual-fund-returns-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareMF() {
    shareContent('Mutual Fund Calculator', `My MF will grow to ${$('mfMaturity').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateMF();
    renderRelatedTools('mutual-fund-returns-calculator', 'finance', 6);
    console.log('✅ MF Returns Calculator Loaded');
});
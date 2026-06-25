'use strict';

const $ = id => document.getElementById(id);
const pwLength = $('pwLength');

const CHARS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
    exclude: 'il1Lo0O'
};

function generatePassword() {
    const length = parseInt(pwLength.value);
    let chars = '';
    
    if ($('pwUpper').checked) chars += CHARS.upper;
    if ($('pwLower').checked) chars += CHARS.lower;
    if ($('pwNumbers').checked) chars += CHARS.numbers;
    if ($('pwSymbols').checked) chars += CHARS.symbols;
    
    if (!chars) {
        showToast('⚠️ Select at least one character type');
        return;
    }
    
    if ($('pwExclude').checked) {
        chars = chars.split('').filter(c => !CHARS.exclude.includes(c)).join('');
    }
    
    let password = '';
    // Use crypto for secure random
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    
    $('pwResult').textContent = password;
    analyzePassword(password);
}

function analyzePassword(pw) {
    const len = pw.length;
    let score = 0;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    
    let strength, color;
    if (score <= 2) { strength = 'Very Weak'; color = '#DC2626'; }
    else if (score <= 4) { strength = 'Weak'; color = '#F97316'; }
    else if (score <= 5) { strength = 'Medium'; color = '#F59E0B'; }
    else if (score <= 6) { strength = 'Strong'; color = '#10B981'; }
    else { strength = 'Very Strong'; color = '#059669'; }
    
    // Time to crack (rough estimate)
    const charSet = (hasUpper ? 26 : 0) + (hasLower ? 26 : 0) + (hasNumber ? 10 : 0) + (hasSymbol ? 30 : 0);
    const combinations = Math.pow(charSet, len);
    const seconds = combinations / (10e9 * 2); // 10 billion attempts/sec
    
    let timeStr;
    if (seconds < 60) timeStr = `${seconds.toFixed(2)} seconds`;
    else if (seconds < 3600) timeStr = `${(seconds / 60).toFixed(2)} minutes`;
    else if (seconds < 86400) timeStr = `${(seconds / 3600).toFixed(2)} hours`;
    else if (seconds < 31536000) timeStr = `${(seconds / 86400).toFixed(2)} days`;
    else if (seconds < 3.156e10) timeStr = `${(seconds / 31536000).toFixed(2)} years`;
    else timeStr = `${(seconds / 3.156e10).toExponential(2)} centuries`;
    
    $('pwLen').textContent = len;
    $('pwStrength').textContent = strength;
    $('pwResult').style.color = color;
    
    $('pwAnalysis').innerHTML = `
        <div class="tax-row"><span>Length</span><strong>${len} characters</strong></div>
        <div class="tax-row"><span>Uppercase</span><strong>${hasUpper ? '✅ Yes' : '❌ No'}</strong></div>
        <div class="tax-row"><span>Lowercase</span><strong>${hasLower ? '✅ Yes' : '❌ No'}</strong></div>
        <div class="tax-row"><span>Numbers</span><strong>${hasNumber ? '✅ Yes' : '❌ No'}</strong></div>
        <div class="tax-row"><span>Symbols</span><strong>${hasSymbol ? '✅ Yes' : '❌ No'}</strong></div>
        <div class="tax-row total"><span>Strength Score</span><strong style="color:${color};">${score}/7 - ${strength}</strong></div>
        <div class="tax-row"><span>Time to Crack</span><strong>${timeStr}</strong></div>
    `;
    
    let insight = '';
    if (score >= 6) insight = `🔐 Excellent password! Time to crack: ${timeStr}`;
    else if (score >= 4) insight = `👍 Good password. Increase length or add symbols for better security.`;
    else insight = `⚠️ Weak password! Add more characters and complexity.`;
    $('pwInsight').textContent = insight;
}

function copyPassword() {
    const pw = $('pwResult').textContent;
    copyToClipboard(pw, '🔐 Password copied!');
}

function sharePassword() {
    showToast('🔒 Never share passwords! Only copy for personal use.');
}

pwLength.addEventListener('input', () => {
    $('pwLengthDisp').textContent = pwLength.value;
    generatePassword();
});

['pwUpper', 'pwLower', 'pwNumbers', 'pwSymbols', 'pwExclude'].forEach(id =>
    $(id).addEventListener('change', generatePassword)
);

document.addEventListener('DOMContentLoaded', () => {
    generatePassword();
    renderRelatedTools('password-generator', 'utility', 6);
    console.log('✅ Password Generator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const ccText = $('ccText');

function countChars() {
    const text = ccText.value;
    const all = text.length;
    const noSpace = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/\d/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = all - letters - numbers - spaces;
    
    $('ccAll').textContent = all.toLocaleString('en-IN');
    $('ccNoSpace').textContent = noSpace.toLocaleString('en-IN');
    $('ccLetters').textContent = letters.toLocaleString('en-IN');
    $('ccNumbers').textContent = numbers.toLocaleString('en-IN');
    $('ccSpaces').textContent = spaces.toLocaleString('en-IN');
    $('ccSpecial').textContent = special.toLocaleString('en-IN');
    
    // Platform limits
    const platforms = [
        { name: '🐦 Twitter Post', limit: 280, icon: '🐦' },
        { name: '📱 SMS', limit: 160, icon: '📱' },
        { name: '🔍 Meta Description', limit: 160, icon: '🔍' },
        { name: '📰 Title Tag', limit: 60, icon: '📰' },
        { name: '📷 Instagram Bio', limit: 150, icon: '📷' },
        { name: '💼 LinkedIn Headline', limit: 220, icon: '💼' },
        { name: '📘 Facebook Post', limit: 63206, icon: '📘' },
        { name: '🎯 Google Ad Title', limit: 30, icon: '🎯' }
    ];
    
    let html = '';
    platforms.forEach(p => {
        const remaining = p.limit - all;
        const percent = Math.min(100, (all / p.limit) * 100);
        let color = '#10B981';
        if (percent >= 90) color = '#DC2626';
        else if (percent >= 75) color = '#F59E0B';
        
        html += `
            <div style="margin-bottom:10px;padding:10px;background:var(--bg-soft);border-radius:var(--r-sm);">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span style="font-size:12px;font-weight:600;">${p.name}</span>
                    <strong style="color:${color};font-size:12px;">${all}/${p.limit} ${remaining < 0 ? '❌' : remaining < 10 ? '⚠️' : '✅'}</strong>
                </div>
                <div style="height:6px;background:var(--border-line);border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${Math.min(100, percent)}%;background:${color};transition:width 0.3s;"></div>
                </div>
            </div>
        `;
    });
    $('ccLimits').innerHTML = html;
}

function ccPaste() {
    navigator.clipboard.readText().then(text => {
        ccText.value = text;
        countChars();
        showToast('✅ Pasted!');
    }).catch(() => showToast('❌ Paste failed'));
}

function ccClear() {
    ccText.value = '';
    countChars();
    showToast('🗑️ Cleared!');
}

function ccCopy() {
    copyToClipboard(ccText.value, '✅ Copied!');
}

document.addEventListener('DOMContentLoaded', () => {
    countChars();
    renderRelatedTools('character-counter', 'utility', 6);
    console.log('✅ Character Counter Loaded');
});
'use strict';

const $ = id => document.getElementById(id);

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function rgbToCmyk(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

function updateFromHex() {
    const hex = $('colorHex').value;
    if (!/^#?[0-9A-Fa-f]{3,6}$/.test(hex)) return;
    
    const rgb = hexToRgb(hex);
    $('colorR').value = rgb.r;
    $('colorG').value = rgb.g;
    $('colorB').value = rgb.b;
    $('colorPicker').value = '#' + hex.replace('#', '');
    updateDisplay();
}

function updateFromRgb() {
    const r = parseInt($('colorR').value) || 0;
    const g = parseInt($('colorG').value) || 0;
    const b = parseInt($('colorB').value) || 0;
    
    const hex = rgbToHex(r, g, b);
    $('colorHex').value = hex;
    $('colorPicker').value = hex;
    updateDisplay();
}

function updateFromPicker() {
    const hex = $('colorPicker').value;
    $('colorHex').value = hex.toUpperCase();
    const rgb = hexToRgb(hex);
    $('colorR').value = rgb.r;
    $('colorG').value = rgb.g;
    $('colorB').value = rgb.b;
    updateDisplay();
}

function setColor(hex) {
    $('colorHex').value = hex;
    updateFromHex();
}

function updateDisplay() {
    const r = parseInt($('colorR').value) || 0;
    const g = parseInt($('colorG').value) || 0;
    const b = parseInt($('colorB').value) || 0;
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);
    
    // Calculate brightness for text color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const textColor = brightness > 128 ? '#000' : '#fff';
    
    $('colorPreview').style.background = hex;
    $('colorPreview').style.color = textColor;
    $('colorPreview').textContent = hex;
    
    $('colorFormats').innerHTML = `
        <div class="tax-row"><span>HEX</span><strong>${hex}</strong></div>
        <div class="tax-row"><span>RGB</span><strong>rgb(${r}, ${g}, ${b})</strong></div>
        <div class="tax-row"><span>RGBA</span><strong>rgba(${r}, ${g}, ${b}, 1)</strong></div>
        <div class="tax-row"><span>HSL</span><strong>hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)</strong></div>
        <div class="tax-row"><span>HSLA</span><strong>hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)</strong></div>
        <div class="tax-row"><span>CMYK</span><strong>cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)</strong></div>
        <div class="tax-row"><span>HSV</span><strong>hsv(${hsl.h}, ${hsl.s}%, ${Math.round(((r > g ? r : g) > b ? (r > g ? r : g) : b) / 255 * 100)}%)</strong></div>
    `;
    
    // Color variations
    let varHTML = '';
    for (let i = 1; i <= 5; i++) {
        const factor = i * 0.2;
        const lightR = Math.min(255, Math.round(r + (255 - r) * factor));
        const lightG = Math.min(255, Math.round(g + (255 - g) * factor));
        const lightB = Math.min(255, Math.round(b + (255 - b) * factor));
        const lightHex = rgbToHex(lightR, lightG, lightB);
        varHTML += `<button onclick="setColor('${lightHex}')" type="button" style="aspect-ratio:1;background:${lightHex};border:none;border-radius:6px;cursor:pointer;" title="Lighter ${i*20}%"></button>`;
    }
    $('colorVariations').innerHTML = varHTML;
    
    // Color name detection
    let colorName = '';
    if (hsl.h < 15 || hsl.h >= 345) colorName = 'Red';
    else if (hsl.h < 45) colorName = 'Orange';
    else if (hsl.h < 70) colorName = 'Yellow';
    else if (hsl.h < 150) colorName = 'Green';
    else if (hsl.h < 200) colorName = 'Cyan';
    else if (hsl.h < 260) colorName = 'Blue';
    else if (hsl.h < 290) colorName = 'Purple';
    else colorName = 'Magenta';
    
    if (hsl.s < 10) colorName = 'Gray';
    if (hsl.l < 10) colorName = 'Black';
    if (hsl.l > 95) colorName = 'White';
    
    $('colorInsight').textContent = `🎨 ${colorName} | Brightness: ${brightness > 128 ? 'Light' : 'Dark'} | Best text: ${textColor === '#fff' ? 'White' : 'Black'}`;
}

function copyColorHex() {
    copyToClipboard($('colorHex').value, '✅ HEX copied!');
}

function copyColorRGB() {
    const txt = `rgb(${$('colorR').value}, ${$('colorG').value}, ${$('colorB').value})`;
    copyToClipboard(txt, '✅ RGB copied!');
}

function shareColor() {
    shareContent('Color Code', `Color: ${$('colorHex').value}`, location.href);
}

function resetColor() {
    $('colorHex').value = '#7C3AED';
    updateFromHex();
    showToast('🔄 Reset!');
}

$('colorPicker').addEventListener('input', updateFromPicker);
$('colorHex').addEventListener('input', updateFromHex);
['colorR', 'colorG', 'colorB'].forEach(id => $(id).addEventListener('input', updateFromRgb));

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    renderRelatedTools('color-code-converter', 'utility', 6);
    console.log('✅ Color Code Converter Loaded');
});
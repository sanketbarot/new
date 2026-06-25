'use strict';

const $ = id => document.getElementById(id);
const cookType = $('cookType');
const cookValue = $('cookValue');
const cookFrom = $('cookFrom');
const cookTo = $('cookTo');

const COOK_UNITS = {
    volume: {
        'Teaspoon (tsp)': 5,
        'Tablespoon (tbsp)': 15,
        'Cup (US)': 240,
        'Cup (Metric)': 250,
        'Pint (US)': 473.176,
        'Quart (US)': 946.353,
        'Gallon (US)': 3785.41,
        'Fluid Ounce (fl oz)': 29.5735,
        'Milliliter (ml)': 1,
        'Liter (l)': 1000
    },
    weight: {
        'Milligram (mg)': 0.001,
        'Gram (g)': 1,
        'Kilogram (kg)': 1000,
        'Ounce (oz)': 28.3495,
        'Pound (lb)': 453.592,
        'Stone': 6350.29
    },
    temperature: {
        'Celsius (°C)': 'C',
        'Fahrenheit (°F)': 'F',
        'Kelvin (K)': 'K',
        'Gas Mark': 'G'
    }
};

function fmtNum(num) {
    if (Math.abs(num) >= 10000) return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    if (Math.abs(num) < 0.01 && num !== 0) return num.toExponential(2);
    return num.toLocaleString('en-IN', { maximumFractionDigits: 4 });
}

function changeCookType() {
    const type = cookType.value;
    const units = Object.keys(COOK_UNITS[type]);
    
    cookFrom.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    cookTo.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    
    if (type === 'volume') { cookFrom.value = 'Cup (US)'; cookTo.value = 'Milliliter (ml)'; }
    else if (type === 'weight') { cookFrom.value = 'Cup (US)'; cookTo.value = 'Gram (g)'; cookFrom.value = 'Gram (g)'; cookTo.value = 'Ounce (oz)'; }
    else { cookFrom.value = 'Celsius (°C)'; cookTo.value = 'Fahrenheit (°F)'; }
    
    convertCook();
}

function convertTemp(value, from, to) {
    let celsius;
    if (from === 'Celsius (°C)') celsius = value;
    else if (from === 'Fahrenheit (°F)') celsius = (value - 32) * 5/9;
    else if (from === 'Kelvin (K)') celsius = value - 273.15;
    else if (from === 'Gas Mark') celsius = (value * 25) + 100; // Rough conversion
    
    if (to === 'Celsius (°C)') return celsius;
    if (to === 'Fahrenheit (°F)') return (celsius * 9/5) + 32;
    if (to === 'Kelvin (K)') return celsius + 273.15;
    if (to === 'Gas Mark') return (celsius - 100) / 25;
    return celsius;
}

function convertCook() {
    const value = parseFloat(cookValue.value) || 0;
    const type = cookType.value;
    const from = cookFrom.value;
    const to = cookTo.value;
    
    if (!from || !to) return;
    
    let result;
    if (type === 'temperature') {
        result = convertTemp(value, from, to);
    } else {
        const fromFactor = COOK_UNITS[type][from];
        const toFactor = COOK_UNITS[type][to];
        const baseValue = value * fromFactor;
        result = baseValue / toFactor;
    }
    
    $('cookResultLabel').textContent = `${value} ${from} =`;
    $('cookResult').textContent = `${fmtNum(result)}`;
    $('cookResultSub').textContent = to;
    
    // All conversions
    const allUnits = Object.keys(COOK_UNITS[type]);
    let html = '';
    allUnits.forEach(unit => {
        if (unit !== from) {
            let conv;
            if (type === 'temperature') {
                conv = convertTemp(value, from, unit);
            } else {
                const baseVal = value * COOK_UNITS[type][from];
                conv = baseVal / COOK_UNITS[type][unit];
            }
            html += `<div class="tax-row"><span>${unit}</span><strong>${fmtNum(conv)}</strong></div>`;
        }
    });
    $('cookAllConversions').innerHTML = html;
    
    $('cookInsight').textContent = `🍳 ${value} ${from} = ${fmtNum(result)} ${to}`;
}

function swapCookUnits() {
    const from = cookFrom.value;
    cookFrom.value = cookTo.value;
    cookTo.value = from;
    convertCook();
}

function resetCook() {
    cookType.value = 'volume';
    cookValue.value = 1;
    changeCookType();
    showToast('🔄 Reset!');
}

function copyCook() {
    const txt = `🍳 Cooking Converter\n\n${cookValue.value} ${cookFrom.value} = ${$('cookResult').textContent} ${cookTo.value}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/cooking-converter.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareCook() {
    shareContent('Cooking Converter', `${cookValue.value} ${cookFrom.value} = ${$('cookResult').textContent} ${cookTo.value}`, location.href);
}

cookValue.addEventListener('input', convertCook);
cookFrom.addEventListener('change', convertCook);
cookTo.addEventListener('change', convertCook);

document.addEventListener('DOMContentLoaded', () => {
    changeCookType();
    renderRelatedTools('cooking-converter', 'daily-use', 6);
    console.log('✅ Cooking Converter Loaded');
});
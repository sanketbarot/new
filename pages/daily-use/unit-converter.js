'use strict';

const $ = id => document.getElementById(id);
const ucCategory = $('ucCategory');
const ucValue = $('ucValue');
const ucFrom = $('ucFrom');
const ucTo = $('ucTo');

// All conversions to base unit
const UNITS = {
    length: {
        base: 'meter',
        units: {
            'Millimeter (mm)': 0.001,
            'Centimeter (cm)': 0.01,
            'Meter (m)': 1,
            'Kilometer (km)': 1000,
            'Inch (in)': 0.0254,
            'Foot (ft)': 0.3048,
            'Yard (yd)': 0.9144,
            'Mile (mi)': 1609.34
        }
    },
    weight: {
        base: 'kilogram',
        units: {
            'Milligram (mg)': 0.000001,
            'Gram (g)': 0.001,
            'Kilogram (kg)': 1,
            'Tonne (t)': 1000,
            'Ounce (oz)': 0.0283495,
            'Pound (lb)': 0.453592,
            'Stone (st)': 6.35029
        }
    },
    temperature: {
        base: 'celsius',
        units: {
            'Celsius (°C)': 'C',
            'Fahrenheit (°F)': 'F',
            'Kelvin (K)': 'K'
        }
    },
    volume: {
        base: 'liter',
        units: {
            'Milliliter (ml)': 0.001,
            'Liter (l)': 1,
            'Cubic meter (m³)': 1000,
            'Gallon US (gal)': 3.78541,
            'Gallon UK (gal)': 4.54609,
            'Cup (cup)': 0.24,
            'Pint (pt)': 0.473176,
            'Fluid ounce (fl oz)': 0.0295735
        }
    },
    area: {
        base: 'square meter',
        units: {
            'Square meter (m²)': 1,
            'Square kilometer (km²)': 1000000,
            'Square foot (ft²)': 0.092903,
            'Square yard (yd²)': 0.836127,
            'Acre': 4046.86,
            'Hectare (ha)': 10000,
            'Square mile (mi²)': 2589988
        }
    },
    speed: {
        base: 'meter per second',
        units: {
            'm/s': 1,
            'km/h': 0.277778,
            'mph': 0.44704,
            'knot': 0.514444,
            'ft/s': 0.3048
        }
    },
    time: {
        base: 'second',
        units: {
            'Millisecond (ms)': 0.001,
            'Second (s)': 1,
            'Minute (min)': 60,
            'Hour (h)': 3600,
            'Day (d)': 86400,
            'Week': 604800,
            'Month (avg)': 2629746,
            'Year': 31556952
        }
    },
    data: {
        base: 'byte',
        units: {
            'Bit': 0.125,
            'Byte (B)': 1,
            'Kilobyte (KB)': 1024,
            'Megabyte (MB)': 1048576,
            'Gigabyte (GB)': 1073741824,
            'Terabyte (TB)': 1099511627776
        }
    }
};

function fmtNum(num) {
    if (Math.abs(num) >= 1e15) return num.toExponential(6);
    if (Math.abs(num) >= 1000000) return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    if (Math.abs(num) < 0.001 && num !== 0) return num.toExponential(4);
    return num.toLocaleString('en-IN', { maximumFractionDigits: 6 });
}

function changeCategory() {
    const cat = ucCategory.value;
    const units = Object.keys(UNITS[cat].units);
    
    ucFrom.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    ucTo.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    
    // Default selections
    if (cat === 'length') { ucFrom.value = 'Meter (m)'; ucTo.value = 'Centimeter (cm)'; }
    else if (cat === 'weight') { ucFrom.value = 'Kilogram (kg)'; ucTo.value = 'Pound (lb)'; }
    else if (cat === 'temperature') { ucFrom.value = 'Celsius (°C)'; ucTo.value = 'Fahrenheit (°F)'; }
    else if (cat === 'volume') { ucFrom.value = 'Liter (l)'; ucTo.value = 'Milliliter (ml)'; }
    else if (cat === 'speed') { ucFrom.value = 'km/h'; ucTo.value = 'mph'; }
    else {
        ucFrom.value = units[0];
        ucTo.value = units[1] || units[0];
    }
    convertUnit();
}

function convertTemp(value, from, to) {
    let celsius;
    if (from === 'Celsius (°C)') celsius = value;
    else if (from === 'Fahrenheit (°F)') celsius = (value - 32) * 5/9;
    else if (from === 'Kelvin (K)') celsius = value - 273.15;
    
    if (to === 'Celsius (°C)') return celsius;
    if (to === 'Fahrenheit (°F)') return (celsius * 9/5) + 32;
    if (to === 'Kelvin (K)') return celsius + 273.15;
    return celsius;
}

function convertUnit() {
    const value = parseFloat(ucValue.value) || 0;
    const cat = ucCategory.value;
    const from = ucFrom.value;
    const to = ucTo.value;
    
    if (!from || !to) return;
    
    let result;
    if (cat === 'temperature') {
        result = convertTemp(value, from, to);
    } else {
        const fromFactor = UNITS[cat].units[from];
        const toFactor = UNITS[cat].units[to];
        const baseValue = value * fromFactor;
        result = baseValue / toFactor;
    }
    
    $('ucResultLabel').textContent = `${value} ${from} =`;
    $('ucResult').textContent = `${fmtNum(result)}`;
    $('ucResultSub').textContent = to;
    
    // All conversions
    const allUnits = Object.keys(UNITS[cat].units);
    let html = '';
    allUnits.forEach(unit => {
        if (unit !== from) {
            let conv;
            if (cat === 'temperature') {
                conv = convertTemp(value, from, unit);
            } else {
                const baseVal = value * UNITS[cat].units[from];
                conv = baseVal / UNITS[cat].units[unit];
            }
            html += `<div class="tax-row"><span>${unit}</span><strong>${fmtNum(conv)}</strong></div>`;
        }
    });
    $('ucAllConversions').innerHTML = html;
    
    $('ucInsight').textContent = `🔢 ${value} ${from} converts to ${fmtNum(result)} ${to}`;
}

function swapUnits() {
    const from = ucFrom.value;
    ucFrom.value = ucTo.value;
    ucTo.value = from;
    convertUnit();
}

function resetUnit() {
    ucCategory.value = 'length';
    ucValue.value = 1;
    changeCategory();
    showToast('🔄 Reset!');
}

function copyUC() {
    const txt = `🔄 Unit Converter\n\n${ucValue.value} ${ucFrom.value} = ${$('ucResult').textContent} ${ucTo.value}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/unit-converter.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareUC() {
    shareContent('Unit Converter', `${ucValue.value} ${ucFrom.value} = ${$('ucResult').textContent} ${ucTo.value}`, location.href);
}

ucValue.addEventListener('input', convertUnit);
ucFrom.addEventListener('change', convertUnit);
ucTo.addEventListener('change', convertUnit);

document.addEventListener('DOMContentLoaded', () => {
    changeCategory();
    renderRelatedTools('unit-converter', 'daily-use', 6);
    console.log('✅ Unit Converter Loaded');
});
'use strict';

const $ = id => document.getElementById(id);

// Indicative exchange rates (vs USD)
const RATES = {
    'USD': { name: 'US Dollar', symbol: '$', rate: 1 },
    'INR': { name: 'Indian Rupee', symbol: '₹', rate: 83.25 },
    'EUR': { name: 'Euro', symbol: '€', rate: 0.92 },
    'GBP': { name: 'British Pound', symbol: '£', rate: 0.79 },
    'JPY': { name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
    'AUD': { name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
    'CAD': { name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
    'CHF': { name: 'Swiss Franc', symbol: 'Fr', rate: 0.88 },
    'CNY': { name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
    'AED': { name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
    'SAR': { name: 'Saudi Riyal', symbol: '﷼', rate: 3.75 },
    'SGD': { name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
    'HKD': { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
    'NZD': { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.65 },
    'KRW': { name: 'South Korean Won', symbol: '₩', rate: 1340 },
    'MYR': { name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.71 },
    'THB': { name: 'Thai Baht', symbol: '฿', rate: 35.80 },
    'PHP': { name: 'Philippine Peso', symbol: '₱', rate: 56.50 },
    'IDR': { name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15600 },
    'VND': { name: 'Vietnamese Dong', symbol: '₫', rate: 24500 },
    'BRL': { name: 'Brazilian Real', symbol: 'R$', rate: 4.96 },
    'MXN': { name: 'Mexican Peso', symbol: '$', rate: 17.20 },
    'RUB': { name: 'Russian Ruble', symbol: '₽', rate: 92.50 },
    'ZAR': { name: 'South African Rand', symbol: 'R', rate: 18.75 },
    'TRY': { name: 'Turkish Lira', symbol: '₺', rate: 28.95 },
    'PKR': { name: 'Pakistani Rupee', symbol: '₨', rate: 278 },
    'BDT': { name: 'Bangladeshi Taka', symbol: '৳', rate: 109.50 },
    'LKR': { name: 'Sri Lankan Rupee', symbol: 'Rs', rate: 327 },
    'NPR': { name: 'Nepalese Rupee', symbol: 'Rs', rate: 133 },
    'EGP': { name: 'Egyptian Pound', symbol: '£', rate: 30.90 }
};

function populateCurrencies() {
    const fromSelect = $('ccFrom');
    const toSelect = $('ccTo');
    
    Object.keys(RATES).forEach(code => {
        const opt1 = document.createElement('option');
        opt1.value = code;
        opt1.textContent = `${code} - ${RATES[code].name}`;
        fromSelect.appendChild(opt1);
        
        const opt2 = document.createElement('option');
        opt2.value = code;
        opt2.textContent = `${code} - ${RATES[code].name}`;
        toSelect.appendChild(opt2);
    });
    
    fromSelect.value = 'USD';
    toSelect.value = 'INR';
}

function setCurrency(from, to) {
    $('ccFrom').value = from;
    $('ccTo').value = to;
    convertCurrency();
}

function swapCurrency() {
    const from = $('ccFrom').value;
    $('ccFrom').value = $('ccTo').value;
    $('ccTo').value = from;
    convertCurrency();
}

function convertCurrency() {
    const amount = parseFloat($('ccAmount').value) || 0;
    const fromCode = $('ccFrom').value;
    const toCode = $('ccTo').value;
    
    if (!RATES[fromCode] || !RATES[toCode]) return;
    
    // Convert via USD
    const amountInUSD = amount / RATES[fromCode].rate;
    const result = amountInUSD * RATES[toCode].rate;
    
    const fromSym = RATES[fromCode].symbol;
    const toSym = RATES[toCode].symbol;
    
    const formattedResult = result.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    const rate = (RATES[toCode].rate / RATES[fromCode].rate).toFixed(4);
    
    $('ccResultLabel').textContent = `${amount} ${fromCode} =`;
    $('ccResult').textContent = `${toSym}${formattedResult}`;
    $('ccRate').textContent = `1 ${fromCode} = ${rate} ${toCode}`;
    
    // Other conversions
    const popular = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
    let html = '';
    popular.forEach(code => {
        if (code !== fromCode) {
            const conv = (amount / RATES[fromCode].rate) * RATES[code].rate;
            html += `<div class="tax-row"><span>${code}</span><strong>${RATES[code].symbol}${conv.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></div>`;
        }
    });
    $('ccBreakdown').innerHTML = html;
    
    $('ccInsight').textContent = `💱 ${amount} ${fromCode} = ${toSym}${formattedResult} ${toCode}. Rate: 1 ${fromCode} = ${rate} ${toCode}`;
}

function resetCC() {
    $('ccAmount').value = 100;
    setCurrency('USD', 'INR');
    showToast('🔄 Reset!');
}

function ccCopyResult() {
    const txt = `💱 Currency Converter\n\n${$('ccResultLabel').textContent} ${$('ccResult').textContent}\n${$('ccRate').textContent}\n\nhttps://calculator.aitoolcor.com/pages/utility/currency-converter.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function ccShareResult() {
    shareContent('Currency Converter', `${$('ccResultLabel').textContent} ${$('ccResult').textContent}`, location.href);
}

$('ccAmount').addEventListener('input', convertCurrency);
$('ccFrom').addEventListener('change', convertCurrency);
$('ccTo').addEventListener('change', convertCurrency);

document.addEventListener('DOMContentLoaded', () => {
    populateCurrencies();
    convertCurrency();
    renderRelatedTools('currency-converter', 'utility', 6);
    console.log('✅ Currency Converter Loaded');
});
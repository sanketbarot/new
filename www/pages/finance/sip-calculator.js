// ================================================
// SIP Calculator - Logic
// ================================================

'use strict';

const $ = id => document.getElementById(id);

// Input elements
const monthlyInvestment = $('monthlyInvestment');
const expectedReturn = $('expectedReturn');
const timePeriod = $('timePeriod');
const monthlyInvestmentRange = $('monthlyInvestmentRange');
const expectedReturnRange = $('expectedReturnRange');
const timePeriodRange = $('timePeriodRange');

let scheduleVisible = false;

// ===== Format Currency =====
function fmtINR(amount) {
    if (isNaN(amount) || amount === null) return '₹0';
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// ===== Calculate SIP =====
function calculateSIP() {
    const P = parseFloat(monthlyInvestment.value) || 0;
    const annualRate = parseFloat(expectedReturn.value) || 0;
    const years = parseFloat(timePeriod.value) || 0;
    
    // Validation
    if (P <= 0) {
        showToast('⚠️ Enter valid monthly investment');
        return;
    }
    if (annualRate <= 0) {
        showToast('⚠️ Enter valid return rate');
        return;
    }
    if (years <= 0) {
        showToast('⚠️ Enter valid time period');
        return;
    }
    
    // SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const i = annualRate / 12 / 100; // Monthly rate
    const n = years * 12; // Total months
    
    let maturity = 0;
    if (i === 0) {
        maturity = P * n;
    } else {
        maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }
    
    const totalInvested = P * n;
    const wealthGained = maturity - totalInvested;
    const returnPct = (wealthGained / totalInvested) * 100;
    const investedPct = (totalInvested / maturity) * 100;
    const gainPct = (wealthGained / maturity) * 100;
    
    // Update UI
    $('maturityAmount').textContent = fmtINR(maturity);
    $('investedAmount').textContent = fmtINR(totalInvested);
    $('wealthGained').textContent = fmtINR(wealthGained);
    $('totalMonths').textContent = n;
    $('returnPct').textContent = returnPct.toFixed(1) + '%';
    
    // Sub text
    document.querySelector('.result-main-sub').textContent = `Total value after ${years} years`;
    
    // Chart bars
    $('barInvested').style.width = investedPct.toFixed(1) + '%';
    $('barGain').style.width = gainPct.toFixed(1) + '%';
    
    // Legend
    $('legendInvested').textContent = `${fmtINR(totalInvested)} (${investedPct.toFixed(0)}%)`;
    $('legendGain').textContent = `${fmtINR(wealthGained)} (${gainPct.toFixed(0)}%)`;
    
    // Update bar text
    document.querySelector('.bar-principal span').textContent = 'Invested';
    document.querySelector('.bar-interest span').textContent = 'Returns';
    
    // Insight
    const growthMultiple = maturity / totalInvested;
    let insight = '';
    if (growthMultiple >= 5) {
        insight = `🚀 Outstanding! Your SIP of ${fmtINR(P)} monthly will grow to ${fmtINR(maturity)} - that's ${growthMultiple.toFixed(1)}x your investment! Power of compounding at its best.`;
    } else if (growthMultiple >= 3) {
        insight = `🎯 Excellent! Your monthly SIP of ${fmtINR(P)} will grow to ${fmtINR(maturity)} - that's ${growthMultiple.toFixed(1)}x your investment in ${years} years!`;
    } else if (growthMultiple >= 2) {
        insight = `👍 Great! Your SIP investment will double to ${growthMultiple.toFixed(1)}x. Consider extending tenure for better returns.`;
    } else {
        insight = `📊 Your SIP will grow to ${fmtINR(maturity)}. For better returns, consider longer tenure or higher return rate funds.`;
    }
    $('insightText').textContent = insight;
    
    // Generate schedule
    generateSchedule(P, i, years);
    
    // Save URL
    try {
        const p = new URLSearchParams({ 
            amount: P, 
            rate: annualRate, 
            years: years 
        });
        history.replaceState(null, '', '?' + p.toString());
    } catch (e) {}
}

// ===== Generate Year-wise Schedule =====
function generateSchedule(monthlyAmt, monthlyRate, years) {
    const tbody = $('scheduleBody');
    if (!tbody) return;
    
    const yearlyData = [];
    
    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        const invested = monthlyAmt * months;
        
        let value = 0;
        if (monthlyRate === 0) {
            value = invested;
        } else {
            value = monthlyAmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        }
        
        const returns = value - invested;
        const growthPct = (returns / invested) * 100;
        
        yearlyData.push({
            year,
            invested,
            returns,
            total: value,
            growth: growthPct
        });
    }
    
    tbody.innerHTML = yearlyData.map(data => `
        <tr>
            <td><strong>Year ${data.year}</strong></td>
            <td class="text-success">${fmtINR(data.invested)}</td>
            <td class="text-danger">${fmtINR(data.returns)}</td>
            <td><strong>${fmtINR(data.total)}</strong></td>
            <td><strong style="color:#059669;">${data.growth.toFixed(1)}%</strong></td>
        </tr>
    `).join('');
}

// ===== Toggle Schedule =====
function toggleSchedule() {
    const wrapper = $('scheduleWrapper');
    const btn = $('scheduleToggle');
    
    scheduleVisible = !scheduleVisible;
    
    if (scheduleVisible) {
        wrapper.style.display = 'block';
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Schedule';
    } else {
        wrapper.style.display = 'none';
        btn.innerHTML = '<i class="fa-solid fa-eye"></i> Show Schedule';
    }
}

// ===== Sync Range Sliders =====
function setupRangeSync() {
    monthlyInvestmentRange.addEventListener('input', () => {
        monthlyInvestment.value = monthlyInvestmentRange.value;
        calculateSIP();
    });
    monthlyInvestment.addEventListener('input', () => {
        const val = parseFloat(monthlyInvestment.value);
        if (val >= 500 && val <= 100000) {
            monthlyInvestmentRange.value = val;
        }
        calculateSIP();
    });
    
    expectedReturnRange.addEventListener('input', () => {
        expectedReturn.value = expectedReturnRange.value;
        calculateSIP();
    });
    expectedReturn.addEventListener('input', () => {
        const val = parseFloat(expectedReturn.value);
        if (val >= 1 && val <= 30) {
            expectedReturnRange.value = val;
        }
        calculateSIP();
    });
    
    timePeriodRange.addEventListener('input', () => {
        timePeriod.value = timePeriodRange.value;
        calculateSIP();
    });
    timePeriod.addEventListener('input', () => {
        const val = parseFloat(timePeriod.value);
        if (val >= 1 && val <= 40) {
            timePeriodRange.value = val;
        }
        calculateSIP();
    });
}

// ===== Restore from URL =====
function restoreFromURL() {
    try {
        const p = new URLSearchParams(location.search);
        if (p.has('amount')) {
            monthlyInvestment.value = p.get('amount');
            monthlyInvestmentRange.value = p.get('amount');
        }
        if (p.has('rate')) {
            expectedReturn.value = p.get('rate');
            expectedReturnRange.value = p.get('rate');
        }
        if (p.has('years')) {
            timePeriod.value = p.get('years');
            timePeriodRange.value = p.get('years');
        }
    } catch (e) {}
}

// ===== Reset =====
function resetSIP() {
    monthlyInvestment.value = 5000;
    monthlyInvestmentRange.value = 5000;
    expectedReturn.value = 12;
    expectedReturnRange.value = 12;
    timePeriod.value = 10;
    timePeriodRange.value = 10;
    calculateSIP();
    showToast('🔄 Calculator reset!');
}

// ===== Copy Result =====
function copySIPResult() {
    const text = `📈 SIP Calculator Result\n\n💵 Monthly Investment: ${fmtINR(parseFloat(monthlyInvestment.value))}\n📊 Expected Return: ${expectedReturn.value}% p.a.\n📅 Time Period: ${timePeriod.value} years\n\n💎 Maturity Amount: ${$('maturityAmount').textContent}\n💰 Total Invested: ${$('investedAmount').textContent}\n🎯 Wealth Gained: ${$('wealthGained').textContent}\n📈 Returns: ${$('returnPct').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/sip-calculator.html`;
    
    copyToClipboard(text, '✅ SIP details copied!');
}

// ===== Share Result =====
function shareSIPResult() {
    const txt = `My SIP of ${fmtINR(parseFloat(monthlyInvestment.value))} monthly will grow to ${$('maturityAmount').textContent} in ${timePeriod.value} years! Calculate your SIP at AI ToolCor.`;
    
    shareContent('My SIP Calculation - AI ToolCor', txt, location.href);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setupRangeSync();
    restoreFromURL();
    calculateSIP();
    
    // Render related tools
    renderRelatedTools('sip-calculator', 'finance', 6);
    
    console.log('✅ SIP Calculator Loaded');
});
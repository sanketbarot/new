'use strict';

const $ = id => document.getElementById(id);
const inflCurrent = $('inflCurrent');
const inflRate = $('inflRate');
const inflYears = $('inflYears');
const inflCurrentRange = $('inflCurrentRange');
const inflRateRange = $('inflRateRange');
const inflYearsRange = $('inflYearsRange');

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function calculateInflation() {
    const P = parseFloat(inflCurrent.value) || 0;
    const r = parseFloat(inflRate.value) || 0;
    const t = parseFloat(inflYears.value) || 0;
    
    if (P <= 0 || r < 0 || t <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // Future Value with Inflation: FV = PV × (1 + r)^t
    const futureValue = P * Math.pow(1 + r/100, t);
    
    // Today's value of future amount
    const todaysValue = P / Math.pow(1 + r/100, t);
    
    const purchasingPowerLost = P - todaysValue;
    const totalInflation = ((futureValue - P) / P) * 100;
    
    $('inflFuture').textContent = fmtINR(futureValue);
    $('inflCurrentDisp').textContent = fmtINR(P);
    $('inflLost').textContent = fmtINR(purchasingPowerLost);
    $('inflTodayValue').textContent = fmtINR(todaysValue);
    $('inflTotal').textContent = totalInflation.toFixed(1) + '%';
    $('inflFutureSub').textContent = `In ${t} years to match ${fmtINR(P)} today`;
    
    // Year-wise breakdown (every 5 years)
    let breakdown = '';
    const intervals = [1, 5, 10, 15, 20, 25, 30];
    for (const yr of intervals) {
        if (yr <= t) {
            const fv = P * Math.pow(1 + r/100, yr);
            const tv = P / Math.pow(1 + r/100, yr);
            breakdown += `
                <div class="tax-row">
                    <span>After ${yr} year${yr !== 1 ? 's' : ''}</span>
                    <strong>Need ${fmtINR(fv)} (worth ${fmtINR(tv)} today)</strong>
                </div>
            `;
        }
    }
    $('inflBreakdown').innerHTML = breakdown;
    
    let insight = '';
    const lossPct = (purchasingPowerLost / P) * 100;
    if (lossPct >= 50) {
        insight = `⚠️ Your money will lose ${lossPct.toFixed(0)}% of value in ${t} years! Invest in equity/MF (12%+ returns) to beat inflation.`;
    } else if (lossPct >= 30) {
        insight = `📊 Inflation will reduce your money's value by ${lossPct.toFixed(0)}%. Consider mutual funds for better returns.`;
    } else {
        insight = `💡 ${lossPct.toFixed(0)}% purchasing power lost. Even at this rate, invest in inflation-beating instruments.`;
    }
    $('inflInsight').textContent = insight;
}

function setupSync() {
    inflCurrentRange.addEventListener('input', () => { inflCurrent.value = inflCurrentRange.value; calculateInflation(); });
    inflCurrent.addEventListener('input', () => { inflCurrentRange.value = inflCurrent.value; calculateInflation(); });
    inflRateRange.addEventListener('input', () => { inflRate.value = inflRateRange.value; calculateInflation(); });
    inflRate.addEventListener('input', () => { inflRateRange.value = inflRate.value; calculateInflation(); });
    inflYearsRange.addEventListener('input', () => { inflYears.value = inflYearsRange.value; calculateInflation(); });
    inflYears.addEventListener('input', () => { inflYearsRange.value = inflYears.value; calculateInflation(); });
}

function resetInflation() {
    inflCurrent.value = 100000; inflCurrentRange.value = 100000;
    inflRate.value = 6; inflRateRange.value = 6;
    inflYears.value = 10; inflYearsRange.value = 10;
    calculateInflation();
    showToast('🔄 Reset!');
}

function copyInfl() {
    const txt = `📊 Inflation Calculator\n\nCurrent: ${$('inflCurrentDisp').textContent}\nRate: ${inflRate.value}%\nYears: ${inflYears.value}\n\nFuture Value: ${$('inflFuture').textContent}\nToday's Value: ${$('inflTodayValue').textContent}\nLost: ${$('inflLost').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/inflation-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareInfl() {
    shareContent('Inflation Calculator', `In ${inflYears.value} years, I'll need ${$('inflFuture').textContent} to match today's ${$('inflCurrentDisp').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateInflation();
    renderRelatedTools('inflation-calculator', 'finance', 6);
    console.log('✅ Inflation Calculator Loaded');
});
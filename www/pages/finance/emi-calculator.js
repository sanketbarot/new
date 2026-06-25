// ================================================
// EMI Calculator - Logic
// ================================================

'use strict';

const $ = id => document.getElementById(id);

// ===== Input Elements =====
const loanAmount = $('loanAmount');
const interestRate = $('interestRate');
const loanTenure = $('loanTenure');
const loanAmountRange = $('loanAmountRange');
const interestRateRange = $('interestRateRange');
const loanTenureRange = $('loanTenureRange');

let scheduleVisible = false;

// ===== Format Currency (Indian) =====
function fmtINR(amount) {
    if (isNaN(amount) || amount === null) return '₹0';
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// ===== Format Number =====
function fmtNum(num) {
    if (isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-IN');
}

// ===== Calculate EMI =====
function calculateEMI() {
    const P = parseFloat(loanAmount.value) || 0;
    const annualRate = parseFloat(interestRate.value) || 0;
    const years = parseFloat(loanTenure.value) || 0;
    
    // Validation
    if (P <= 0) {
        showToast('⚠️ Enter valid loan amount');
        return;
    }
    if (annualRate <= 0) {
        showToast('⚠️ Enter valid interest rate');
        return;
    }
    if (years <= 0) {
        showToast('⚠️ Enter valid loan tenure');
        return;
    }
    
    // EMI Formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
    const R = annualRate / 12 / 100; // Monthly rate
    const N = years * 12; // Number of months
    
    let emi = 0;
    if (R === 0) {
        emi = P / N;
    } else {
        emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }
    
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;
    const interestPct = (totalInterest / P) * 100;
    const principalPct = (P / totalPayment) * 100;
    const interestPctBar = (totalInterest / totalPayment) * 100;
    
    // Update UI
    $('emiAmount').textContent = fmtINR(emi);
    $('principalAmt').textContent = fmtINR(P);
    $('totalInterest').textContent = fmtINR(totalInterest);
    $('totalPayment').textContent = fmtINR(totalPayment);
    $('interestPct').textContent = interestPct.toFixed(1) + '%';
    
    // Update sub text
    document.querySelector('.result-main-sub').textContent = `Pay every month for ${years} years`;
    
    // Update chart bars
    $('barPrincipal').style.width = principalPct.toFixed(1) + '%';
    $('barInterest').style.width = interestPctBar.toFixed(1) + '%';
    
    // Update legend
    $('legendPrincipal').textContent = `${fmtINR(P)} (${principalPct.toFixed(0)}%)`;
    $('legendInterest').textContent = `${fmtINR(totalInterest)} (${interestPctBar.toFixed(0)}%)`;
    
    // Insight
    let insight = '';
    if (interestPct < 30) {
        insight = `🎯 Excellent! Your monthly EMI is ${fmtINR(emi)}. Total interest is just ${interestPct.toFixed(0)}% of principal - very economical!`;
    } else if (interestPct < 60) {
        insight = `👍 Good deal! Your monthly EMI is ${fmtINR(emi)}. Total interest is ${interestPct.toFixed(0)}% of principal.`;
    } else if (interestPct < 100) {
        insight = `⚠️ Your monthly EMI is ${fmtINR(emi)}. Interest is ${interestPct.toFixed(0)}% of principal. Consider shorter tenure or higher EMI to save interest.`;
    } else {
        insight = `📊 Your monthly EMI is ${fmtINR(emi)}. You'll pay more in interest (${interestPct.toFixed(0)}%) than your principal! Consider prepayment options.`;
    }
    $('insightText').textContent = insight;
    
    // Generate amortization schedule
    generateSchedule(P, R, emi, N, years);
    
    // Save to URL
    try {
        const p = new URLSearchParams({ 
            amount: P, 
            rate: annualRate, 
            tenure: years 
        });
        history.replaceState(null, '', '?' + p.toString());
    } catch (e) {}
}

// ===== Generate Amortization Schedule =====
function generateSchedule(principal, monthlyRate, emi, totalMonths, years) {
    const tbody = $('scheduleBody');
    if (!tbody) return;
    
    let balance = principal;
    let yearlyData = [];
    
    for (let year = 1; year <= years; year++) {
        let yearPrincipal = 0;
        let yearInterest = 0;
        
        for (let month = 1; month <= 12; month++) {
            if ((year - 1) * 12 + month > totalMonths) break;
            
            const interestPayment = balance * monthlyRate;
            const principalPayment = emi - interestPayment;
            
            yearPrincipal += principalPayment;
            yearInterest += interestPayment;
            balance -= principalPayment;
        }
        
        yearlyData.push({
            year,
            principal: yearPrincipal,
            interest: yearInterest,
            total: yearPrincipal + yearInterest,
            balance: Math.max(0, balance)
        });
    }
    
    tbody.innerHTML = yearlyData.map(data => `
        <tr>
            <td><strong>Year ${data.year}</strong></td>
            <td class="text-success">${fmtINR(data.principal)}</td>
            <td class="text-danger">${fmtINR(data.interest)}</td>
            <td><strong>${fmtINR(data.total)}</strong></td>
            <td>${fmtINR(data.balance)}</td>
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
    // Loan Amount
    loanAmountRange.addEventListener('input', () => {
        loanAmount.value = loanAmountRange.value;
        calculateEMI();
    });
    loanAmount.addEventListener('input', () => {
        const val = parseFloat(loanAmount.value);
        if (val >= 100000 && val <= 10000000) {
            loanAmountRange.value = val;
        }
        calculateEMI();
    });
    
    // Interest Rate
    interestRateRange.addEventListener('input', () => {
        interestRate.value = interestRateRange.value;
        calculateEMI();
    });
    interestRate.addEventListener('input', () => {
        const val = parseFloat(interestRate.value);
        if (val >= 1 && val <= 20) {
            interestRateRange.value = val;
        }
        calculateEMI();
    });
    
    // Loan Tenure
    loanTenureRange.addEventListener('input', () => {
        loanTenure.value = loanTenureRange.value;
        calculateEMI();
    });
    loanTenure.addEventListener('input', () => {
        const val = parseFloat(loanTenure.value);
        if (val >= 1 && val <= 30) {
            loanTenureRange.value = val;
        }
        calculateEMI();
    });
}

// ===== Restore from URL =====
function restoreFromURL() {
    try {
        const p = new URLSearchParams(location.search);
        if (p.has('amount')) {
            loanAmount.value = p.get('amount');
            loanAmountRange.value = p.get('amount');
        }
        if (p.has('rate')) {
            interestRate.value = p.get('rate');
            interestRateRange.value = p.get('rate');
        }
        if (p.has('tenure')) {
            loanTenure.value = p.get('tenure');
            loanTenureRange.value = p.get('tenure');
        }
    } catch (e) {}
}

// ===== Reset =====
function resetEMI() {
    loanAmount.value = 1000000;
    loanAmountRange.value = 1000000;
    interestRate.value = 8.5;
    interestRateRange.value = 8.5;
    loanTenure.value = 20;
    loanTenureRange.value = 20;
    calculateEMI();
    showToast('🔄 Calculator reset!');
}

// ===== Copy Result =====
function copyEMIResult() {
    const text = `💰 EMI Calculator Result\n\n📊 Loan Amount: ${$('principalAmt').textContent}\n📈 Interest Rate: ${interestRate.value}% p.a.\n📅 Tenure: ${loanTenure.value} years\n\n💵 Monthly EMI: ${$('emiAmount').textContent}\n💸 Total Interest: ${$('totalInterest').textContent}\n💎 Total Payment: ${$('totalPayment').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/emi-calculator.html`;
    
    copyToClipboard(text, '✅ EMI details copied!');
}

// ===== Share Result =====
function shareEMIResult() {
    const txt = `My loan EMI is ${$('emiAmount').textContent}/month for ${loanTenure.value} years at ${interestRate.value}% interest. Calculate your EMI at AI ToolCor!`;
    
    shareContent('My EMI Calculation - AI ToolCor', txt, location.href);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setupRangeSync();
    restoreFromURL();
    calculateEMI();
    
    // Render related tools
    renderRelatedTools('emi-calculator', 'finance', 6);
    
    console.log('✅ EMI Calculator Loaded');
});
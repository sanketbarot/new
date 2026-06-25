'use strict';

const $ = id => document.getElementById(id);
const annualIncome = $('annualIncome');
const deductions = $('deductions');
const ageGroup = $('ageGroup');
let taxRegime = 'new';

function fmtINR(amt) {
    return '₹' + Math.round(amt).toLocaleString('en-IN');
}

function setRegime(regime, event) {
    taxRegime = regime;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    
    const deductionsGroup = $('deductionsGroup');
    if (regime === 'new') {
        deductionsGroup.style.opacity = '0.5';
        deductionsGroup.style.pointerEvents = 'none';
        $('regimeHint').textContent = 'New regime FY 2025-26 - Zero tax up to ₹12L income';
    } else {
        deductionsGroup.style.opacity = '1';
        deductionsGroup.style.pointerEvents = 'auto';
        $('regimeHint').textContent = 'Old regime - Higher rates but deductions allowed';
    }
    calculateTax();
}

// ===== NEW REGIME FY 2025-26 =====
function calculateTaxNewRegime(income) {
    let tax = 0;
    
    // FY 2025-26 New Regime Slabs
    const slabs = [
        { limit: 400000, rate: 0 },      // 0-4L: 0%
        { limit: 800000, rate: 0.05 },   // 4-8L: 5%
        { limit: 1200000, rate: 0.10 },  // 8-12L: 10%
        { limit: 1600000, rate: 0.15 },  // 12-16L: 15%
        { limit: 2000000, rate: 0.20 },  // 16-20L: 20%
        { limit: 2400000, rate: 0.25 },  // 20-24L: 25%
        { limit: Infinity, rate: 0.30 }  // 24L+: 30%
    ];
    
    let prevLimit = 0;
    
    for (const slab of slabs) {
        if (income <= prevLimit) break;
        
        const taxableInSlab = Math.min(income, slab.limit) - prevLimit;
        if (taxableInSlab > 0) {
            tax += taxableInSlab * slab.rate;
        }
        prevLimit = slab.limit;
    }
    
    // Section 87A Rebate (New Regime FY 2025-26)
    // Full rebate up to ₹12 Lakh income (₹60,000 max rebate)
    if (income <= 1200000) {
        tax = 0; // Complete rebate
    }
    
    return tax;
}

// ===== OLD REGIME (Unchanged) =====
function calculateTaxOldRegime(income, age) {
    let exemption = 250000; // Below 60
    if (age === '60to80') exemption = 300000;
    if (age === 'above80') exemption = 500000;
    
    let tax = 0;
    
    if (income <= exemption) return 0;
    
    // Old Regime Slabs
    // Up to exemption: 0%
    // exemption to 5L: 5%
    // 5L to 10L: 20%
    // Above 10L: 30%
    
    if (income > exemption) {
        // 5% slab (exemption to 5L)
        const slab1Amount = Math.min(income, 500000) - exemption;
        if (slab1Amount > 0) tax += slab1Amount * 0.05;
        
        // 20% slab (5L to 10L)
        if (income > 500000) {
            const slab2Amount = Math.min(income, 1000000) - 500000;
            if (slab2Amount > 0) tax += slab2Amount * 0.20;
        }
        
        // 30% slab (Above 10L)
        if (income > 1000000) {
            const slab3Amount = income - 1000000;
            tax += slab3Amount * 0.30;
        }
    }
    
    // Section 87A Rebate (Old Regime) - For income up to 5L
    if (income <= 500000) {
        tax = Math.max(0, tax - 12500);
    }
    
    return tax;
}

function calculateTax() {
    const income = parseFloat(annualIncome.value) || 0;
    const deduct = parseFloat(deductions.value) || 0;
    const age = ageGroup.value;
    
    if (income <= 0) {
        showToast('⚠️ Enter valid income');
        return;
    }
    
    let taxableIncome, incomeTax, standardDeduction;
    
    if (taxRegime === 'new') {
        // New Regime: Standard deduction ₹75,000
        standardDeduction = 75000;
        taxableIncome = Math.max(0, income - standardDeduction);
        incomeTax = calculateTaxNewRegime(taxableIncome);
    } else {
        // Old Regime: Standard deduction ₹50,000 + other deductions
        standardDeduction = 50000;
        taxableIncome = Math.max(0, income - standardDeduction - deduct);
        incomeTax = calculateTaxOldRegime(taxableIncome, age);
    }
    
    const cess = incomeTax * 0.04;
    const totalTax = incomeTax + cess;
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    const monthlyTax = totalTax / 12;
    
    // Update UI
    $('totalTax').textContent = fmtINR(totalTax);
    $('taxableIncome').textContent = fmtINR(taxableIncome);
    $('incomeTax').textContent = fmtINR(incomeTax);
    $('cessAmt').textContent = fmtINR(cess);
    $('effectiveRate').textContent = effectiveRate.toFixed(2) + '%';
    $('taxSub').textContent = `For FY 2025-26 (${taxRegime === 'new' ? 'New' : 'Old'} Regime)`;
    
    // Detailed Breakdown
    let breakdownHTML = `
        <div class="tax-row">
            <span>Gross Income</span>
            <strong>${fmtINR(income)}</strong>
        </div>
        <div class="tax-row">
            <span>Standard Deduction</span>
            <strong style="color:#059669;">- ${fmtINR(standardDeduction)}</strong>
        </div>
    `;
    
    if (taxRegime === 'old' && deduct > 0) {
        breakdownHTML += `
            <div class="tax-row">
                <span>Other Deductions (80C, 80D, etc.)</span>
                <strong style="color:#059669;">- ${fmtINR(deduct)}</strong>
            </div>
        `;
    }
    
    breakdownHTML += `
        <div class="tax-row total">
            <span>Taxable Income</span>
            <strong>${fmtINR(taxableIncome)}</strong>
        </div>
    `;
    
    // Slab-wise tax breakdown for new regime
    if (taxRegime === 'new' && taxableIncome > 0) {
        breakdownHTML += `<div class="tax-row" style="margin-top:8px;"><span><strong>Slab-wise Tax:</strong></span><span></span></div>`;
        
        const slabsInfo = [
            { from: 0, to: 400000, rate: 0, name: '₹0 - ₹4L' },
            { from: 400000, to: 800000, rate: 5, name: '₹4L - ₹8L' },
            { from: 800000, to: 1200000, rate: 10, name: '₹8L - ₹12L' },
            { from: 1200000, to: 1600000, rate: 15, name: '₹12L - ₹16L' },
            { from: 1600000, to: 2000000, rate: 20, name: '₹16L - ₹20L' },
            { from: 2000000, to: 2400000, rate: 25, name: '₹20L - ₹24L' },
            { from: 2400000, to: Infinity, rate: 30, name: '₹24L+' }
        ];
        
        slabsInfo.forEach(slab => {
            if (taxableIncome > slab.from) {
                const slabAmount = Math.min(taxableIncome, slab.to) - slab.from;
                const slabTax = slabAmount * (slab.rate / 100);
                if (slabAmount > 0) {
                    breakdownHTML += `
                        <div class="tax-row" style="padding-left:20px;font-size:12px;">
                            <span>${slab.name} @ ${slab.rate}%</span>
                            <span>${fmtINR(slabTax)}</span>
                        </div>
                    `;
                }
            }
        });
    }
    
    // Rebate
    if (taxRegime === 'new' && taxableIncome <= 1200000 && taxableIncome > 0) {
        const rebateAmount = calculateTaxNewRegime(taxableIncome) > 0 ? 
            slabsInfo.reduce((acc, s) => {
                if (taxableIncome > s.from) {
                    const amt = Math.min(taxableIncome, s.to) - s.from;
                    return acc + (amt * s.rate / 100);
                }
                return acc;
            }, 0) : 0;
        
        if (rebateAmount > 0) {
            breakdownHTML += `
                <div class="tax-row" style="color:#059669;">
                    <span>Section 87A Rebate</span>
                    <strong>- ${fmtINR(rebateAmount)}</strong>
                </div>
            `;
        }
    } else if (taxRegime === 'old' && taxableIncome <= 500000 && incomeTax === 0) {
        breakdownHTML += `
            <div class="tax-row" style="color:#059669;">
                <span>Section 87A Rebate</span>
                <strong>- ${fmtINR(12500)}</strong>
            </div>
        `;
    }
    
    breakdownHTML += `
        <div class="tax-row">
            <span>Income Tax</span>
            <strong>${fmtINR(incomeTax)}</strong>
        </div>
        <div class="tax-row">
            <span>Health & Education Cess (4%)</span>
            <strong>${fmtINR(cess)}</strong>
        </div>
        <div class="tax-row total">
            <span>Total Tax Payable</span>
            <strong style="color:#DC2626;font-size:18px;">${fmtINR(totalTax)}</strong>
        </div>
        <div class="tax-row">
            <span>Monthly TDS</span>
            <strong>${fmtINR(monthlyTax)}</strong>
        </div>
        <div class="tax-row">
            <span>Take Home (Annual)</span>
            <strong style="color:#059669;">${fmtINR(income - totalTax)}</strong>
        </div>
    `;
    
    $('taxBreakdown').innerHTML = breakdownHTML;
    
    // Smart Insight
    let insight = '';
    if (totalTax === 0) {
        if (taxRegime === 'new') {
            insight = `🎉 Zero Tax! Your income is within ₹12L rebate limit under Section 87A (New Regime FY 2025-26). You save 100%!`;
        } else {
            insight = `🎉 Zero Tax! Your income is within ₹5L rebate limit under Section 87A (Old Regime).`;
        }
    } else if (taxRegime === 'new') {
        // Compare with old regime
        const oldTaxable = Math.max(0, income - 50000 - deduct);
        const oldTax = calculateTaxOldRegime(oldTaxable, age);
        const oldTotal = oldTax + (oldTax * 0.04);
        
        if (oldTotal < totalTax) {
            const savings = totalTax - oldTotal;
            insight = `💡 Old regime would save you ${fmtINR(savings)}/year! Consider switching if you have ₹${Math.round(deduct/1000)}K+ deductions.`;
        } else if (oldTotal > totalTax) {
            const savings = oldTotal - totalTax;
            insight = `✅ New regime saves you ${fmtINR(savings)}/year! Tax: ${fmtINR(totalTax)} (${effectiveRate.toFixed(1)}% effective rate).`;
        } else {
            insight = `📊 Both regimes give same tax of ${fmtINR(totalTax)}. New regime is simpler.`;
        }
    } else {
        // Old regime selected - compare with new
        const newTaxable = Math.max(0, income - 75000);
        const newTax = calculateTaxNewRegime(newTaxable);
        const newTotal = newTax + (newTax * 0.04);
        
        if (newTotal < totalTax) {
            const savings = totalTax - newTotal;
            insight = `💡 New regime saves ${fmtINR(savings)}/year! Switch to New Regime for lower tax.`;
        } else if (newTotal > totalTax) {
            const savings = newTotal - totalTax;
            insight = `✅ Old regime is better with your deductions! You save ${fmtINR(savings)}/year vs new regime.`;
        } else {
            insight = `📊 Both regimes are equal for you. Tax: ${fmtINR(totalTax)}.`;
        }
    }
    $('taxInsight').textContent = insight;
}

function resetTax() {
    annualIncome.value = 1275000; // 12.75L - effective tax-free under new regime
    deductions.value = 150000;
    ageGroup.value = 'below60';
    taxRegime = 'new';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    setRegime('new');
    showToast('🔄 Reset to ₹12.75L (Tax-Free under New Regime)!');
}

function copyTax() {
    const txt = `📊 Income Tax Calculator FY 2025-26\n\nRegime: ${taxRegime === 'new' ? 'New' : 'Old'}\nGross Income: ${fmtINR(parseFloat(annualIncome.value))}\nTaxable Income: ${$('taxableIncome').textContent}\n\nIncome Tax: ${$('incomeTax').textContent}\nCess (4%): ${$('cessAmt').textContent}\nTotal Tax: ${$('totalTax').textContent}\nEffective Rate: ${$('effectiveRate').textContent}\n\n💡 Tax-Free Limit: ₹12L (New) / ₹5L (Old)\n\nhttps://calculator.aitoolcor.com/pages/finance/income-tax-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareTax() {
    shareContent('Income Tax Calculator FY 2025-26 - AI ToolCor', 
        `My tax for ${fmtINR(parseFloat(annualIncome.value))} income: ${$('totalTax').textContent}. Calculate yours at AI ToolCor!`,
        location.href);
}

annualIncome.addEventListener('input', calculateTax);
deductions.addEventListener('input', calculateTax);
ageGroup.addEventListener('change', calculateTax);

document.addEventListener('DOMContentLoaded', () => {
    // Default to ₹12.75L (tax-free for salaried in new regime)
    annualIncome.value = 1275000;
    calculateTax();
    renderRelatedTools('income-tax-calculator', 'finance', 6);
    console.log('✅ Income Tax Calculator FY 2025-26 Loaded');
});
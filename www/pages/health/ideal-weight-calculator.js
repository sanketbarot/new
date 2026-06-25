'use strict';

const $ = id => document.getElementById(id);
const iwHeight = $('iwHeight');
const iwCurrentWeight = $('iwCurrentWeight');
const iwHeightRange = $('iwHeightRange');
let iwGender = 'male';

function setIwGender(gender, event) {
    iwGender = gender;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateIdealWeight();
}

function calculateIdealWeight() {
    const height = parseFloat(iwHeight.value) || 0;
    const currentWeight = parseFloat(iwCurrentWeight.value) || 0;
    
    if (height <= 0) {
        showToast('⚠️ Enter valid height');
        return;
    }
    
    const heightM = height / 100;
    const heightInches = height / 2.54;
    const inchesOver5ft = Math.max(0, heightInches - 60);
    
    // Different formulas (returns kg)
    let devine, robinson, miller, hamwi;
    
    if (iwGender === 'male') {
        devine = 50 + (2.3 * inchesOver5ft);
        robinson = 52 + (1.9 * inchesOver5ft);
        miller = 56.2 + (1.41 * inchesOver5ft);
        hamwi = 48 + (2.7 * inchesOver5ft);
    } else {
        devine = 45.5 + (2.3 * inchesOver5ft);
        robinson = 49 + (1.7 * inchesOver5ft);
        miller = 53.1 + (1.36 * inchesOver5ft);
        hamwi = 45.5 + (2.2 * inchesOver5ft);
    }
    
    // Average
    const average = (devine + robinson + miller + hamwi) / 4;
    
    // BMI 22 (optimal)
    const bmi22 = 22 * heightM * heightM;
    
    // Healthy range (BMI 18.5 to 24.9)
    const minHealthy = 18.5 * heightM * heightM;
    const maxHealthy = 24.9 * heightM * heightM;
    
    // Difference
    const diff = currentWeight - average;
    
    $('iwAverage').textContent = average.toFixed(1) + ' kg';
    $('iwRange').textContent = `${minHealthy.toFixed(0)}-${maxHealthy.toFixed(0)} kg`;
    $('iwBmi22').textContent = bmi22.toFixed(1) + ' kg';
    
    if (currentWeight > 0) {
        if (Math.abs(diff) < 2) {
            $('iwDiff').textContent = '✅ At ideal weight!';
        } else if (diff > 0) {
            $('iwDiff').textContent = `${diff.toFixed(1)} kg above ideal`;
        } else {
            $('iwDiff').textContent = `${Math.abs(diff).toFixed(1)} kg below ideal`;
        }
    } else {
        $('iwDiff').textContent = 'Recommended weight';
    }
    
    $('iwFormulas').innerHTML = `
        <div class="tax-row"><span>Devine Formula (Most Used)</span><strong>${devine.toFixed(1)} kg</strong></div>
        <div class="tax-row"><span>Robinson Formula (1983)</span><strong>${robinson.toFixed(1)} kg</strong></div>
        <div class="tax-row"><span>Miller Formula (1983)</span><strong>${miller.toFixed(1)} kg</strong></div>
        <div class="tax-row"><span>Hamwi Formula (1964)</span><strong>${hamwi.toFixed(1)} kg</strong></div>
        <div class="tax-row total"><span>Average of 4 Formulas</span><strong style="color:#059669;">${average.toFixed(1)} kg</strong></div>
        <div class="tax-row"><span>BMI 22 (Optimal)</span><strong>${bmi22.toFixed(1)} kg</strong></div>
        <div class="tax-row"><span>Healthy Range (BMI 18.5-25)</span><strong>${minHealthy.toFixed(0)}-${maxHealthy.toFixed(0)} kg</strong></div>
    `;
    
    let insight = '';
    if (currentWeight > 0) {
        if (currentWeight > maxHealthy) {
            insight = `⚠️ You're ${(currentWeight - maxHealthy).toFixed(1)} kg above healthy range. Consider losing weight to reach ${maxHealthy.toFixed(0)} kg.`;
        } else if (currentWeight < minHealthy) {
            insight = `⚠️ You're ${(minHealthy - currentWeight).toFixed(1)} kg below healthy range. Consider gaining healthy weight.`;
        } else {
            insight = `✅ You're within healthy weight range! Ideal target: ${average.toFixed(0)} kg.`;
        }
    } else {
        insight = `Your ideal weight is ${average.toFixed(0)} kg. Healthy range: ${minHealthy.toFixed(0)}-${maxHealthy.toFixed(0)} kg.`;
    }
    $('iwInsight').textContent = insight;
}

function setupSync() {
    iwHeightRange.addEventListener('input', () => { iwHeight.value = iwHeightRange.value; calculateIdealWeight(); });
    iwHeight.addEventListener('input', () => { iwHeightRange.value = iwHeight.value; calculateIdealWeight(); });
    iwCurrentWeight.addEventListener('input', calculateIdealWeight);
}

function resetIdealWeight() {
    iwHeight.value = 170; iwHeightRange.value = 170;
    iwCurrentWeight.value = 75;
    calculateIdealWeight();
    showToast('🔄 Reset!');
}

function copyIw() {
    const txt = `⚖️ Ideal Weight Calculator\n\nHeight: ${iwHeight.value} cm\nGender: ${iwGender}\nCurrent: ${iwCurrentWeight.value} kg\n\nIdeal Weight: ${$('iwAverage').textContent}\nHealthy Range: ${$('iwRange').textContent}\nBMI 22 Weight: ${$('iwBmi22').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/ideal-weight-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareIw() {
    shareContent('Ideal Weight', `My ideal weight: ${$('iwAverage').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateIdealWeight();
    renderRelatedTools('ideal-weight-calculator', 'health', 6);
    console.log('✅ Ideal Weight Calculator Loaded');
});
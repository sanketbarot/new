'use strict';

const $ = id => document.getElementById(id);
const bmiAge = $('bmiAge');
const bmiHeight = $('bmiHeight');
const bmiWeight = $('bmiWeight');
const bmiFeet = $('bmiFeet');
const bmiInches = $('bmiInches');
const bmiLbs = $('bmiLbs');
const bmiHeightRange = $('bmiHeightRange');
const bmiWeightRange = $('bmiWeightRange');
let bmiUnit = 'metric';
let bmiGender = 'male';

function setBmiUnit(unit, event) {
    bmiUnit = unit;
    document.querySelectorAll('.gst-toggle')[0].querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('metricInputs').style.display = unit === 'metric' ? 'block' : 'none';
    $('imperialInputs').style.display = unit === 'imperial' ? 'block' : 'none';
    calculateBMI();
}

function setBmiGender(gender, event) {
    bmiGender = gender;
    document.querySelectorAll('.gst-toggle')[1].querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateBMI();
}

function calculateBMI() {
    let heightM, weightKg;
    
    if (bmiUnit === 'metric') {
        heightM = parseFloat(bmiHeight.value) / 100;
        weightKg = parseFloat(bmiWeight.value);
    } else {
        const ft = parseFloat(bmiFeet.value) || 0;
        const inch = parseFloat(bmiInches.value) || 0;
        heightM = ((ft * 12) + inch) * 0.0254;
        weightKg = parseFloat(bmiLbs.value) * 0.453592;
    }
    
    if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const bmi = weightKg / (heightM * heightM);
    const heightCm = heightM * 100;
    
    // Ideal weight range (BMI 18.5 to 24.9)
    const minWeight = 18.5 * heightM * heightM;
    const maxWeight = 24.9 * heightM * heightM;
    
    // Category
    let category, status, color, insight;
    if (bmi < 18.5) {
        category = 'Underweight';
        status = 'Underweight';
        color = '#3B82F6';
        insight = `⚠️ Your BMI suggests you're underweight. Consider increasing healthy calorie intake and consulting a nutritionist.`;
    } else if (bmi < 25) {
        category = 'Normal Weight';
        status = 'Healthy';
        color = '#059669';
        insight = `✅ Excellent! Your BMI is in the healthy range. Keep maintaining your current lifestyle with balanced diet and exercise.`;
    } else if (bmi < 30) {
        category = 'Overweight';
        status = 'Overweight';
        color = '#F59E0B';
        insight = `⚠️ Your BMI indicates overweight. Consider regular exercise and balanced diet. Target weight: ${Math.round(minWeight)}-${Math.round(maxWeight)} kg.`;
    } else {
        category = 'Obese';
        status = 'Obese';
        color = '#DC2626';
        insight = `🚨 Your BMI indicates obesity. Consult a doctor for personalized weight loss plan. Health risks include diabetes, heart disease.`;
    }
    
    // Marker position (0-50 BMI scale)
    let markerPos = Math.min(100, Math.max(0, (bmi / 40) * 100));
    
    $('bmiValue').textContent = bmi.toFixed(1);
    $('bmiCategory').textContent = category;
    $('bmiStatus').textContent = status;
    $('bmiIdeal').textContent = `${Math.round(minWeight)}-${Math.round(maxWeight)} kg`;
    $('bmiMarker').style.left = markerPos + '%';
    $('bmiInsight').textContent = insight;
    
    // Main display color
    $('bmiMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    
    // Categories list
    $('bmiCategoriesList').innerHTML = `
        <div class="tax-row ${bmi < 18.5 ? 'total' : ''}"><span>🔵 Underweight</span><strong>Below 18.5</strong></div>
        <div class="tax-row ${bmi >= 18.5 && bmi < 25 ? 'total' : ''}"><span>🟢 Normal Weight</span><strong>18.5 - 24.9</strong></div>
        <div class="tax-row ${bmi >= 25 && bmi < 30 ? 'total' : ''}"><span>🟡 Overweight</span><strong>25 - 29.9</strong></div>
        <div class="tax-row ${bmi >= 30 ? 'total' : ''}"><span>🔴 Obese</span><strong>30 and above</strong></div>
    `;
}

function setupSync() {
    bmiHeightRange.addEventListener('input', () => { bmiHeight.value = bmiHeightRange.value; calculateBMI(); });
    bmiHeight.addEventListener('input', () => { bmiHeightRange.value = bmiHeight.value; calculateBMI(); });
    bmiWeightRange.addEventListener('input', () => { bmiWeight.value = bmiWeightRange.value; calculateBMI(); });
    bmiWeight.addEventListener('input', () => { bmiWeightRange.value = bmiWeight.value; calculateBMI(); });
    [bmiAge, bmiFeet, bmiInches, bmiLbs].forEach(el => el.addEventListener('input', calculateBMI));
}

function resetBMI() {
    bmiHeight.value = 170; bmiHeightRange.value = 170;
    bmiWeight.value = 70; bmiWeightRange.value = 70;
    bmiAge.value = 25;
    bmiFeet.value = 5;
    bmiInches.value = 7;
    bmiLbs.value = 155;
    calculateBMI();
    showToast('🔄 Reset!');
}

function copyBMI() {
    const txt = `⚖️ BMI Calculator\n\nHeight: ${bmiHeight.value} cm\nWeight: ${bmiWeight.value} kg\nAge: ${bmiAge.value}\n\nBMI: ${$('bmiValue').textContent}\nCategory: ${$('bmiCategory').textContent}\nIdeal Weight: ${$('bmiIdeal').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/bmi-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareBMI() {
    shareContent('BMI Calculator', `My BMI is ${$('bmiValue').textContent} - ${$('bmiCategory').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateBMI();
    renderRelatedTools('bmi-calculator', 'health', 6);
    console.log('✅ BMI Calculator Loaded');
});
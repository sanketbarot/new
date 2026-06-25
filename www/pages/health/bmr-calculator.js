'use strict';

const $ = id => document.getElementById(id);
const bmrAge = $('bmrAge');
const bmrHeight = $('bmrHeight');
const bmrWeight = $('bmrWeight');
const bmrActivity = $('bmrActivity');
const bmrAgeRange = $('bmrAgeRange');
const bmrHeightRange = $('bmrHeightRange');
const bmrWeightRange = $('bmrWeightRange');
let bmrGender = 'male';

function setBmrGender(gender, event) {
    bmrGender = gender;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateBMR();
}

function calculateBMR() {
    const age = parseFloat(bmrAge.value) || 0;
    const height = parseFloat(bmrHeight.value) || 0;
    const weight = parseFloat(bmrWeight.value) || 0;
    const activity = parseFloat(bmrActivity.value) || 1.55;
    
    if (age <= 0 || height <= 0 || weight <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // Mifflin-St Jeor Formula
    let bmr;
    if (bmrGender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    const tdee = bmr * activity;
    const activeCalories = tdee - bmr;
    
    // Calorie goals
    const loseAggressive = tdee - 1000;
    const loseModerate = tdee - 500;
    const maintain = tdee;
    const gainModerate = tdee + 500;
    const gainAggressive = tdee + 1000;
    
    $('bmrValue').textContent = Math.round(bmr).toLocaleString();
    $('bmrTDEE').textContent = Math.round(tdee).toLocaleString();
    $('bmrActive').textContent = Math.round(activeCalories).toLocaleString();
    
    $('bmrGoals').innerHTML = `
        <div class="tax-row"><span>🚀 Fast Loss (-1 kg/week)</span><strong>${Math.round(loseAggressive).toLocaleString()} cal</strong></div>
        <div class="tax-row"><span>📉 Moderate Loss (-0.5 kg/week)</span><strong>${Math.round(loseModerate).toLocaleString()} cal</strong></div>
        <div class="tax-row total"><span>⚖️ Maintain Weight</span><strong>${Math.round(maintain).toLocaleString()} cal</strong></div>
        <div class="tax-row"><span>📈 Moderate Gain (+0.5 kg/week)</span><strong>${Math.round(gainModerate).toLocaleString()} cal</strong></div>
        <div class="tax-row"><span>💪 Fast Gain (+1 kg/week)</span><strong>${Math.round(gainAggressive).toLocaleString()} cal</strong></div>
    `;
    
    const activityName = {1.2:'Sedentary', 1.375:'Light', 1.55:'Moderate', 1.725:'Active', 1.9:'Very Active'}[activity];
    $('bmrInsight').textContent = `Your body burns ${Math.round(bmr)} calories at rest. With ${activityName} activity, you need ${Math.round(tdee)} calories daily to maintain weight.`;
}

function setupSync() {
    bmrAgeRange.addEventListener('input', () => { bmrAge.value = bmrAgeRange.value; calculateBMR(); });
    bmrAge.addEventListener('input', () => { bmrAgeRange.value = bmrAge.value; calculateBMR(); });
    bmrHeightRange.addEventListener('input', () => { bmrHeight.value = bmrHeightRange.value; calculateBMR(); });
    bmrHeight.addEventListener('input', () => { bmrHeightRange.value = bmrHeight.value; calculateBMR(); });
    bmrWeightRange.addEventListener('input', () => { bmrWeight.value = bmrWeightRange.value; calculateBMR(); });
    bmrWeight.addEventListener('input', () => { bmrWeightRange.value = bmrWeight.value; calculateBMR(); });
    bmrActivity.addEventListener('change', calculateBMR);
}

function resetBMR() {
    bmrAge.value = 25; bmrAgeRange.value = 25;
    bmrHeight.value = 170; bmrHeightRange.value = 170;
    bmrWeight.value = 70; bmrWeightRange.value = 70;
    bmrActivity.value = 1.55;
    calculateBMR();
    showToast('🔄 Reset!');
}

function copyBMR() {
    const txt = `🔥 BMR Calculator\n\nAge: ${bmrAge.value}\nHeight: ${bmrHeight.value} cm\nWeight: ${bmrWeight.value} kg\nGender: ${bmrGender}\n\nBMR: ${$('bmrValue').textContent} cal\nTDEE: ${$('bmrTDEE').textContent} cal\nActive Calories: ${$('bmrActive').textContent} cal\n\nhttps://calculator.aitoolcor.com/pages/health/bmr-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareBMR() {
    shareContent('BMR Calculator', `My daily calorie need: ${$('bmrTDEE').textContent} cal!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateBMR();
    renderRelatedTools('bmr-calculator', 'health', 6);
    console.log('✅ BMR Calculator Loaded');
});
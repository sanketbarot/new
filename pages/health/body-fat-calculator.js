'use strict';

const $ = id => document.getElementById(id);
const bfHeight = $('bfHeight');
const bfWeight = $('bfWeight');
const bfNeck = $('bfNeck');
const bfWaist = $('bfWaist');
const bfHip = $('bfHip');
const bfHeightRange = $('bfHeightRange');
const bfWeightRange = $('bfWeightRange');
let bfGender = 'male';

function setBfGender(gender, event) {
    bfGender = gender;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('hipGroup').style.display = gender === 'female' ? 'block' : 'none';
    calculateBodyFat();
}

function calculateBodyFat() {
    const height = parseFloat(bfHeight.value) || 0;
    const weight = parseFloat(bfWeight.value) || 0;
    const neck = parseFloat(bfNeck.value) || 0;
    const waist = parseFloat(bfWaist.value) || 0;
    const hip = parseFloat(bfHip.value) || 0;
    
    if (height <= 0 || weight <= 0 || neck <= 0 || waist <= 0) {
        showToast('⚠️ Enter all measurements');
        return;
    }
    
    let bodyFat;
    
    // US Navy Body Fat Formula
    if (bfGender === 'male') {
        if (waist <= neck) {
            showToast('⚠️ Waist must be larger than neck');
            return;
        }
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        if (hip <= 0) {
            showToast('⚠️ Enter hip measurement');
            return;
        }
        if ((waist + hip) <= neck) {
            showToast('⚠️ Waist + Hip must be larger than neck');
            return;
        }
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    
    bodyFat = Math.max(0, Math.min(60, bodyFat));
    const fatMass = (weight * bodyFat) / 100;
    const leanMass = weight - fatMass;
    
    // Categories
    let category, color, insight;
    if (bfGender === 'male') {
        if (bodyFat < 6) { category = 'Essential Fat'; color = '#3B82F6'; insight = '⚠️ Very low body fat. Consider gaining healthy weight.'; }
        else if (bodyFat < 14) { category = 'Athletes'; color = '#10B981'; insight = '🏆 Athletic physique! Excellent body composition for performance.'; }
        else if (bodyFat < 18) { category = 'Fitness'; color = '#059669'; insight = '✅ Great fitness level! Good muscle definition.'; }
        else if (bodyFat < 25) { category = 'Average'; color = '#F59E0B'; insight = '👍 Average body fat. Regular exercise will improve composition.'; }
        else { category = 'Obese'; color = '#DC2626'; insight = '⚠️ High body fat. Consider diet & exercise plan for health.'; }
    } else {
        if (bodyFat < 14) { category = 'Essential Fat'; color = '#3B82F6'; insight = '⚠️ Very low body fat. May affect hormonal health.'; }
        else if (bodyFat < 21) { category = 'Athletes'; color = '#10B981'; insight = '🏆 Athletic physique! Excellent for performance.'; }
        else if (bodyFat < 25) { category = 'Fitness'; color = '#059669'; insight = '✅ Great fitness level! Healthy and toned.'; }
        else if (bodyFat < 32) { category = 'Average'; color = '#F59E0B'; insight = '👍 Average body fat. Exercise improves composition.'; }
        else { category = 'Obese'; color = '#DC2626'; insight = '⚠️ High body fat. Consider diet & exercise plan.'; }
    }
    
    $('bfPercent').textContent = bodyFat.toFixed(1) + '%';
    $('bfCategory').textContent = category;
    $('bfFatMass').textContent = fatMass.toFixed(1) + ' kg';
    $('bfLeanMass').textContent = leanMass.toFixed(1) + ' kg';
    $('bfInsight').textContent = insight;
    $('bfMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    
    // Categories
    const cats = bfGender === 'male' ? [
        { name: '🔵 Essential Fat', range: '< 6%' },
        { name: '🟢 Athletes', range: '6-13%' },
        { name: '🟢 Fitness', range: '14-17%' },
        { name: '🟡 Average', range: '18-24%' },
        { name: '🔴 Obese', range: '25%+' }
    ] : [
        { name: '🔵 Essential Fat', range: '< 14%' },
        { name: '🟢 Athletes', range: '14-20%' },
        { name: '🟢 Fitness', range: '21-24%' },
        { name: '🟡 Average', range: '25-31%' },
        { name: '🔴 Obese', range: '32%+' }
    ];
    
    $('bfCategoriesList').innerHTML = cats.map(c => 
        `<div class="tax-row ${category.includes(c.name.split(' ')[1]) ? 'total' : ''}"><span>${c.name}</span><strong>${c.range}</strong></div>`
    ).join('');
}

function setupSync() {
    bfHeightRange.addEventListener('input', () => { bfHeight.value = bfHeightRange.value; calculateBodyFat(); });
    bfHeight.addEventListener('input', () => { bfHeightRange.value = bfHeight.value; calculateBodyFat(); });
    bfWeightRange.addEventListener('input', () => { bfWeight.value = bfWeightRange.value; calculateBodyFat(); });
    bfWeight.addEventListener('input', () => { bfWeightRange.value = bfWeight.value; calculateBodyFat(); });
    [bfNeck, bfWaist, bfHip].forEach(el => el.addEventListener('input', calculateBodyFat));
}

function resetBodyFat() {
    bfHeight.value = 170; bfHeightRange.value = 170;
    bfWeight.value = 70; bfWeightRange.value = 70;
    bfNeck.value = 38;
    bfWaist.value = 85;
    bfHip.value = 95;
    calculateBodyFat();
    showToast('🔄 Reset!');
}

function copyBodyFat() {
    const txt = `💪 Body Fat Calculator\n\nGender: ${bfGender}\nHeight: ${bfHeight.value} cm\nWeight: ${bfWeight.value} kg\n\nBody Fat: ${$('bfPercent').textContent}\nCategory: ${$('bfCategory').textContent}\nFat Mass: ${$('bfFatMass').textContent}\nLean Mass: ${$('bfLeanMass').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/body-fat-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareBodyFat() {
    shareContent('Body Fat Calculator', `My body fat: ${$('bfPercent').textContent} - ${$('bfCategory').textContent}!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateBodyFat();
    renderRelatedTools('body-fat-calculator', 'health', 6);
    console.log('✅ Body Fat Calculator Loaded');
}); 
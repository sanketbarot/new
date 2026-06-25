'use strict';

const $ = id => document.getElementById(id);
const calActivity = $('calActivity');
const calWeight = $('calWeight');
const calDuration = $('calDuration');
const calWeightRange = $('calWeightRange');
const calDurationRange = $('calDurationRange');

function calculateCalories() {
    const met = parseFloat(calActivity.value) || 0;
    const weight = parseFloat(calWeight.value) || 0;
    const duration = parseFloat(calDuration.value) || 0;
    
    if (met <= 0 || weight <= 0 || duration <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // Calories = MET × Weight (kg) × Time (hours)
    const hours = duration / 60;
    const calories = met * weight * hours;
    const perMinute = calories / duration;
    
    $('calBurned').textContent = Math.round(calories).toLocaleString();
    $('calPerMin').textContent = perMinute.toFixed(1);
    $('calMET').textContent = met.toFixed(1);
    $('calBurnedSub').textContent = `In ${duration} minutes`;
    
    // Food equivalents
    const foods = [
        { name: '🍎 Apple', cal: 95 },
        { name: '🍌 Banana', cal: 105 },
        { name: '🍩 Donut', cal: 250 },
        { name: '🍕 Slice Pizza', cal: 285 },
        { name: '🍔 Burger', cal: 350 },
        { name: '🍰 Cake Slice', cal: 350 },
        { name: '🍫 Chocolate Bar', cal: 230 },
        { name: '🍦 Ice Cream', cal: 270 }
    ];
    
    let foodHTML = '';
    foods.forEach(f => {
        const count = (calories / f.cal).toFixed(1);
        if (count >= 0.1) {
            foodHTML += `<div class="tax-row"><span>${f.name}</span><strong>${count}x</strong></div>`;
        }
    });
    $('calFoodEquiv').innerHTML = foodHTML;
    
    let insight = '';
    if (calories >= 500) insight = `🔥 Intense workout! ${Math.round(calories)} calories - great fat burn session!`;
    else if (calories >= 250) insight = `💪 Good workout! ${Math.round(calories)} calories burned - keep it up!`;
    else if (calories >= 100) insight = `👍 Decent activity! ${Math.round(calories)} calories - consider longer duration.`;
    else insight = `🏃 Light activity. ${Math.round(calories)} calories - increase intensity or duration for better results.`;
    $('calInsight').textContent = insight;
}

function setupSync() {
    calWeightRange.addEventListener('input', () => { calWeight.value = calWeightRange.value; calculateCalories(); });
    calWeight.addEventListener('input', () => { calWeightRange.value = calWeight.value; calculateCalories(); });
    calDurationRange.addEventListener('input', () => { calDuration.value = calDurationRange.value; calculateCalories(); });
    calDuration.addEventListener('input', () => { calDurationRange.value = calDuration.value; calculateCalories(); });
    calActivity.addEventListener('change', calculateCalories);
}

function resetCalories() {
    calActivity.value = 8;
    calWeight.value = 70; calWeightRange.value = 70;
    calDuration.value = 30; calDurationRange.value = 30;
    calculateCalories();
    showToast('🔄 Reset!');
}

function copyCalories() {
    const txt = `🔥 Calories Burned\n\nActivity MET: ${calActivity.options[calActivity.selectedIndex].text}\nWeight: ${calWeight.value} kg\nDuration: ${calDuration.value} min\n\nCalories Burned: ${$('calBurned').textContent}\nPer Minute: ${$('calPerMin').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/calories-burned-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareCalories() {
    shareContent('Calories Burned', `I burned ${$('calBurned').textContent} calories!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateCalories();
    renderRelatedTools('calories-burned-calculator', 'health', 6);
    console.log('✅ Calories Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const waterWeight = $('waterWeight');
const waterActivity = $('waterActivity');
const waterClimate = $('waterClimate');
const waterWeightRange = $('waterWeightRange');
let waterPregnant = 'no';

function setPregnant(type, event) {
    waterPregnant = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateWater();
}

function calculateWater() {
    const weight = parseFloat(waterWeight.value) || 0;
    const activityExtra = parseFloat(waterActivity.value) || 0;
    const climateExtra = parseFloat(waterClimate.value) || 0;
    
    if (weight <= 0) {
        showToast('⚠️ Enter valid weight');
        return;
    }
    
    // Base: 35ml per kg
    let waterLiters = (weight * 35) / 1000;
    
    // Add activity
    waterLiters += activityExtra;
    
    // Add climate
    waterLiters += climateExtra;
    
    // Pregnancy/breastfeeding
    if (waterPregnant === 'pregnant') waterLiters += 0.3;
    if (waterPregnant === 'breastfeeding') waterLiters += 0.7;
    
    const waterML = waterLiters * 1000;
    const glasses = Math.round(waterML / 250);
    const cups = Math.round(waterML / 237);
    
    $('waterLiters').textContent = waterLiters.toFixed(1) + ' L';
    $('waterML').textContent = Math.round(waterML).toLocaleString() + ' ml';
    $('waterCups').textContent = cups + ' cups';
    $('waterGlasses').textContent = `≈ ${glasses} glasses (250ml each)`;
    
    // Hourly schedule (7 AM to 10 PM = 15 hours)
    const hoursAwake = 15;
    const mlPerHour = waterML / hoursAwake;
    const glassesPerHour = mlPerHour / 250;
    
    $('waterSchedule').innerHTML = `
        <div class="tax-row"><span>☀️ 7-8 AM (Wake up)</span><strong>500 ml (2 glasses)</strong></div>
        <div class="tax-row"><span>🍳 10-11 AM (Mid-morning)</span><strong>${Math.round(waterML * 0.15)} ml</strong></div>
        <div class="tax-row"><span>🥗 12-1 PM (Lunch)</span><strong>${Math.round(waterML * 0.15)} ml</strong></div>
        <div class="tax-row"><span>☕ 3-4 PM (Afternoon)</span><strong>${Math.round(waterML * 0.15)} ml</strong></div>
        <div class="tax-row"><span>🌅 5-6 PM (Evening)</span><strong>${Math.round(waterML * 0.15)} ml</strong></div>
        <div class="tax-row"><span>🍽️ 7-8 PM (Dinner)</span><strong>${Math.round(waterML * 0.15)} ml</strong></div>
        <div class="tax-row"><span>🌙 9-10 PM (Before bed)</span><strong>${Math.round(waterML * 0.10)} ml</strong></div>
        <div class="tax-row total"><span>📊 Total Daily</span><strong>${Math.round(waterML)} ml (${waterLiters.toFixed(1)} L)</strong></div>
    `;
    
    let insight = '';
    if (waterLiters >= 4) insight = `🚰 High water needs (${waterLiters.toFixed(1)}L). Spread intake throughout the day. Don't drink too much at once!`;
    else if (waterLiters >= 2.5) insight = `💧 Stay hydrated! ${waterLiters.toFixed(1)}L is achievable with regular sips. Carry a water bottle!`;
    else insight = `💦 Good baseline! ${waterLiters.toFixed(1)}L daily is essential for health. Drink more if exercising or in hot weather.`;
    $('waterInsight').textContent = insight;
}

function setupSync() {
    waterWeightRange.addEventListener('input', () => { waterWeight.value = waterWeightRange.value; calculateWater(); });
    waterWeight.addEventListener('input', () => { waterWeightRange.value = waterWeight.value; calculateWater(); });
    waterActivity.addEventListener('change', calculateWater);
    waterClimate.addEventListener('change', calculateWater);
}

function resetWater() {
    waterWeight.value = 70; waterWeightRange.value = 70;
    waterActivity.value = 0.35;
    waterClimate.value = 0;
    waterPregnant = 'no';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    calculateWater();
    showToast('🔄 Reset!');
}

function copyWater() {
    const txt = `💧 Water Intake Calculator\n\nWeight: ${waterWeight.value} kg\nDaily Water: ${$('waterLiters').textContent}\nIn ML: ${$('waterML').textContent}\nGlasses: ${$('waterGlasses').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/water-intake-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareWater() {
    shareContent('Water Intake', `I should drink ${$('waterLiters').textContent} water daily!`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateWater();
    renderRelatedTools('water-intake-calculator', 'health', 6);
    console.log('✅ Water Calculator Loaded');
});
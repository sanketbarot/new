'use strict';

const $ = id => document.getElementById(id);
const mileStart = $('mileStart');
const mileEnd = $('mileEnd');
const mileFuel = $('mileFuel');

function calculateMileage() {
    const start = parseFloat(mileStart.value) || 0;
    const end = parseFloat(mileEnd.value) || 0;
    const fuel = parseFloat(mileFuel.value) || 0;
    
    if (end <= start) {
        showToast('⚠️ End reading must be greater than start');
        return;
    }
    
    if (fuel <= 0) {
        showToast('⚠️ Enter valid fuel amount');
        return;
    }
    
    const distance = end - start;
    const mileage = distance / fuel;
    const mpg = mileage * 2.352; // Convert km/L to MPG
    const fuelPer100km = (100 / mileage).toFixed(2);
    
    $('mileResult').textContent = mileage.toFixed(2) + ' km/L';
    $('mileDistance').textContent = distance + ' km';
    $('mileMPG').textContent = mpg.toFixed(2);
    
    $('mileBreakdown').innerHTML = `
        <div class="tax-row"><span>Starting Odometer</span><strong>${start.toLocaleString('en-IN')} km</strong></div>
        <div class="tax-row"><span>Ending Odometer</span><strong>${end.toLocaleString('en-IN')} km</strong></div>
        <div class="tax-row"><span>Distance Traveled</span><strong>${distance.toLocaleString('en-IN')} km</strong></div>
        <div class="tax-row"><span>Fuel Used</span><strong>${fuel} liters</strong></div>
        <div class="tax-row total"><span>Mileage</span><strong style="color:#059669;">${mileage.toFixed(2)} km/L</strong></div>
        <div class="tax-row"><span>MPG (Miles per Gallon)</span><strong>${mpg.toFixed(2)} mpg</strong></div>
        <div class="tax-row"><span>L/100 km</span><strong>${fuelPer100km} L</strong></div>
        <div class="tax-row"><span>L per km</span><strong>${(fuel/distance).toFixed(4)} L</strong></div>
    `;
    
    let insight = '';
    if (mileage >= 25) insight = `🚀 Excellent mileage! ${mileage.toFixed(1)} km/L is exceptional - top tier efficiency!`;
    else if (mileage >= 18) insight = `👍 Great mileage! ${mileage.toFixed(1)} km/L is above average.`;
    else if (mileage >= 12) insight = `📊 Average mileage. Regular maintenance can improve this.`;
    else if (mileage >= 8) insight = `⚠️ Below average. Check tire pressure & service vehicle.`;
    else insight = `🚨 Very low mileage! Urgent vehicle check needed.`;
    $('mileInsight').textContent = insight;
}

function resetMileage() {
    mileStart.value = 10000;
    mileEnd.value = 10500;
    mileFuel.value = 33;
    calculateMileage();
    showToast('🔄 Reset!');
}

function copyMileage() {
    const txt = `🚗 Mileage Calculator\n\nDistance: ${$('mileDistance').textContent}\nFuel: ${mileFuel.value} L\n\nMileage: ${$('mileResult').textContent}\nMPG: ${$('mileMPG').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/mileage-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareMileage() {
    shareContent('Mileage Calculator', `My mileage: ${$('mileResult').textContent}`, location.href);
}

[mileStart, mileEnd, mileFuel].forEach(el => el.addEventListener('input', calculateMileage));

document.addEventListener('DOMContentLoaded', () => {
    calculateMileage();
    renderRelatedTools('mileage-calculator', 'daily-use', 6);
    console.log('✅ Mileage Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const fcDistance = $('fcDistance');
const fcMileage = $('fcMileage');
const fcPrice = $('fcPrice');
const fcDistanceRange = $('fcDistanceRange');
const fcMileageRange = $('fcMileageRange');
let fcTripType = 'oneway';

function fmtINR(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function setTripType(type, event) {
    fcTripType = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateFuel();
}

function calculateFuel() {
    const distance = parseFloat(fcDistance.value) || 0;
    const mileage = parseFloat(fcMileage.value) || 0;
    const price = parseFloat(fcPrice.value) || 0;
    
    if (distance <= 0 || mileage <= 0 || price <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    const actualDistance = fcTripType === 'roundtrip' ? distance * 2 : distance;
    const litersNeeded = actualDistance / mileage;
    const totalCost = litersNeeded * price;
    const costPerKm = price / mileage;
    const costPer100Km = costPerKm * 100;
    
    $('fcCost').textContent = fmtINR(totalCost);
    $('fcLiters').textContent = litersNeeded.toFixed(2) + ' L';
    $('fcPerKm').textContent = fmtINR(costPerKm);
    $('fcSub').textContent = `For ${actualDistance} km ${fcTripType === 'roundtrip' ? 'round trip' : 'one way'}`;
    
    $('fcBreakdown').innerHTML = `
        <div class="tax-row"><span>Distance</span><strong>${actualDistance} km</strong></div>
        <div class="tax-row"><span>Vehicle Mileage</span><strong>${mileage} km/L</strong></div>
        <div class="tax-row"><span>Fuel Price</span><strong>${fmtINR(price)}/L</strong></div>
        <div class="tax-row total"><span>Fuel Needed</span><strong>${litersNeeded.toFixed(2)} liters</strong></div>
        <div class="tax-row"><span>Total Cost</span><strong style="color:#DC2626;">${fmtINR(totalCost)}</strong></div>
        <div class="tax-row"><span>Cost per km</span><strong>${fmtINR(costPerKm)}</strong></div>
        <div class="tax-row"><span>Cost per 100 km</span><strong>${fmtINR(costPer100Km)}</strong></div>
        ${fcTripType === 'roundtrip' ? `<div class="tax-row"><span>One Way Distance</span><strong>${distance} km</strong></div>` : ''}
    `;
    
    let insight = '';
    if (mileage >= 25) insight = `🚀 Excellent mileage! Cost per km: ${fmtINR(costPerKm)}. Very economical trip!`;
    else if (mileage >= 15) insight = `👍 Good mileage. Total cost ${fmtINR(totalCost)} for ${actualDistance} km.`;
    else if (mileage >= 10) insight = `📊 Average mileage. Consider servicing to improve fuel efficiency.`;
    else insight = `⚠️ Low mileage (${mileage} km/L). Check vehicle condition urgently.`;
    $('fcInsight').textContent = insight;
}

function setupSync() {
    fcDistanceRange.addEventListener('input', () => { fcDistance.value = fcDistanceRange.value; calculateFuel(); });
    fcDistance.addEventListener('input', () => { fcDistanceRange.value = fcDistance.value; calculateFuel(); });
    fcMileageRange.addEventListener('input', () => { fcMileage.value = fcMileageRange.value; calculateFuel(); });
    fcMileage.addEventListener('input', () => { fcMileageRange.value = fcMileage.value; calculateFuel(); });
    fcPrice.addEventListener('input', calculateFuel);
}

function resetFuel() {
    fcDistance.value = 500; fcDistanceRange.value = 500;
    fcMileage.value = 15; fcMileageRange.value = 15;
    fcPrice.value = 100;
    fcTripType = 'oneway';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    calculateFuel();
    showToast('🔄 Reset!');
}

function copyFuel() {
    const txt = `⛽ Fuel Cost\n\nDistance: ${fcDistance.value} km\nMileage: ${fcMileage.value} km/L\nPrice: ${fmtINR(parseFloat(fcPrice.value))}/L\n\nFuel: ${$('fcLiters').textContent}\nTotal: ${$('fcCost').textContent}\nPer km: ${$('fcPerKm').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/fuel-cost-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareFuel() {
    shareContent('Fuel Cost', `Trip cost: ${$('fcCost').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateFuel();
    renderRelatedTools('fuel-cost-calculator', 'daily-use', 6);
    console.log('✅ Fuel Cost Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const spdMode = $('spdMode');

function changeSpdMode() {
    const mode = spdMode.value;
    $('spdGrp1').style.display = (mode === 'time' || mode === 'speed') ? 'block' : 'block';
    $('spdGrp2').style.display = (mode === 'distance' || mode === 'speed') ? 'block' : 'block';
    $('spdGrp3').style.display = (mode === 'distance' || mode === 'time') ? 'block' : 'none';
    
    if (mode === 'speed') {
        $('spdGrp3').style.display = 'none';
        $('spdGrp1').style.display = 'block';
        $('spdGrp2').style.display = 'block';
    } else if (mode === 'distance') {
        $('spdGrp1').style.display = 'none';
        $('spdGrp2').style.display = 'block';
        $('spdGrp3').style.display = 'block';
    } else { // time
        $('spdGrp1').style.display = 'block';
        $('spdGrp2').style.display = 'none';
        $('spdGrp3').style.display = 'block';
    }
    calculateSpeed();
}

function calculateSpeed() {
    const mode = spdMode.value;
    
    // Convert all to base units (meters, seconds)
    const distance = parseFloat($('spdDistance').value) || 0;
    const distUnit = $('spdDistUnit').value;
    let distM = distance;
    if (distUnit === 'km') distM = distance * 1000;
    else if (distUnit === 'mi') distM = distance * 1609.34;
    
    const time = parseFloat($('spdTime').value) || 0;
    const timeUnit = $('spdTimeUnit').value;
    let timeSec = time;
    if (timeUnit === 'hr') timeSec = time * 3600;
    else if (timeUnit === 'min') timeSec = time * 60;
    
    const speed = parseFloat($('spdSpeed').value) || 0;
    const speedUnit = $('spdSpeedUnit').value;
    let speedMS = speed;
    if (speedUnit === 'kmh') speedMS = speed / 3.6;
    else if (speedUnit === 'mph') speedMS = speed * 0.44704;
    
    let result, label, formula;
    let resultMS = 0;
    
    if (mode === 'speed') {
        if (timeSec <= 0) { showToast('⚠️ Time must be > 0'); return; }
        resultMS = distM / timeSec;
        label = 'Speed';
        formula = `Speed = Distance ÷ Time = ${distance} ${distUnit} ÷ ${time} ${timeUnit}`;
        const kmh = resultMS * 3.6;
        const mph = resultMS * 2.23694;
        result = kmh.toFixed(2) + ' km/h';
        
        $('spdBreakdown').innerHTML = `
            <div class="tax-row"><span>m/s (meters/second)</span><strong>${resultMS.toFixed(2)}</strong></div>
            <div class="tax-row total"><span>km/h (kilometers/hour)</span><strong style="color:#059669;">${kmh.toFixed(2)}</strong></div>
            <div class="tax-row"><span>mph (miles/hour)</span><strong>${mph.toFixed(2)}</strong></div>
            <div class="tax-row"><span>knots</span><strong>${(resultMS * 1.94384).toFixed(2)}</strong></div>
        `;
    } else if (mode === 'distance') {
        if (speedMS <= 0 || timeSec <= 0) { showToast('⚠️ Enter valid values'); return; }
        const resultM = speedMS * timeSec;
        label = 'Distance';
        formula = `Distance = Speed × Time = ${speed} ${speedUnit} × ${time} ${timeUnit}`;
        const km = resultM / 1000;
        const miles = resultM / 1609.34;
        result = km.toFixed(2) + ' km';
        
        $('spdBreakdown').innerHTML = `
            <div class="tax-row"><span>Meters (m)</span><strong>${resultM.toFixed(2)}</strong></div>
            <div class="tax-row total"><span>Kilometers (km)</span><strong style="color:#059669;">${km.toFixed(2)}</strong></div>
            <div class="tax-row"><span>Miles (mi)</span><strong>${miles.toFixed(2)}</strong></div>
        `;
    } else { // time
        if (speedMS <= 0 || distM <= 0) { showToast('⚠️ Enter valid values'); return; }
        const resultSec = distM / speedMS;
        label = 'Time';
        formula = `Time = Distance ÷ Speed = ${distance} ${distUnit} ÷ ${speed} ${speedUnit}`;
        const hours = resultSec / 3600;
        const mins = resultSec / 60;
        result = hours.toFixed(2) + ' hours';
        
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        const s = Math.floor(((hours - h) * 60 - m) * 60);
        
        $('spdBreakdown').innerHTML = `
            <div class="tax-row"><span>Seconds</span><strong>${resultSec.toFixed(2)}</strong></div>
            <div class="tax-row"><span>Minutes</span><strong>${mins.toFixed(2)}</strong></div>
            <div class="tax-row total"><span>Hours</span><strong style="color:#059669;">${hours.toFixed(2)}</strong></div>
            <div class="tax-row"><span>HH:MM:SS</span><strong>${h}h ${m}m ${s}s</strong></div>
        `;
    }
    
    $('spdResultLabel').textContent = label;
    $('spdResult').textContent = result;
    $('spdSub').textContent = formula;
    $('spdInsight').textContent = `📐 ${formula}`;
}

function resetSpeed() {
    spdMode.value = 'speed';
    $('spdDistance').value = 100;
    $('spdTime').value = 2;
    $('spdSpeed').value = 60;
    changeSpdMode();
    showToast('🔄 Reset!');
}

function copySpeed() {
    const txt = `🏎️ Speed Calculator\n\n${$('spdResultLabel').textContent}: ${$('spdResult').textContent}\n${$('spdSub').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/speed-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareSpeed() {
    shareContent('Speed Calculator', `${$('spdResultLabel').textContent}: ${$('spdResult').textContent}`, location.href);
}

['spdDistance', 'spdTime', 'spdSpeed', 'spdDistUnit', 'spdTimeUnit', 'spdSpeedUnit'].forEach(id => {
    $(id).addEventListener('input', calculateSpeed);
    $(id).addEventListener('change', calculateSpeed);
});

document.addEventListener('DOMContentLoaded', () => {
    changeSpdMode();
    renderRelatedTools('speed-calculator', 'daily-use', 6);
    console.log('✅ Speed Calculator Loaded');
});
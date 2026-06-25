'use strict';

const $ = id => document.getElementById(id);
const hrAge = $('hrAge');
const hrResting = $('hrResting');
const hrFormula = $('hrFormula');
const hrAgeRange = $('hrAgeRange');

function calculateHR() {
    const age = parseFloat(hrAge.value) || 0;
    const resting = parseFloat(hrResting.value) || 70;
    const formula = hrFormula.value;
    
    if (age <= 0) {
        showToast('⚠️ Enter valid age');
        return;
    }
    
    // Calculate Max HR
    let maxHR;
    if (formula === 'tanaka') maxHR = 208 - (0.7 * age);
    else if (formula === 'gulati') maxHR = 206 - (0.88 * age);
    else maxHR = 220 - age; // Fox
    
    maxHR = Math.round(maxHR);
    const hrr = maxHR - resting; // Heart Rate Reserve (Karvonen)
    
    $('hrMax').textContent = maxHR + ' bpm';
    $('hrRestingDisp').textContent = resting + ' bpm';
    $('hrReserve').textContent = hrr + ' bpm';
    
    // Zones using Karvonen formula: Target HR = ((Max HR - Resting HR) × %Intensity) + Resting HR
    const zones = [
        { name: '🟦 Zone 1: Very Light', range: '50-60%', minPct: 0.50, maxPct: 0.60, desc: 'Warm-up, recovery' },
        { name: '🟢 Zone 2: Fat Burn', range: '60-70%', minPct: 0.60, maxPct: 0.70, desc: 'Fat burning, base endurance' },
        { name: '🟡 Zone 3: Cardio', range: '70-80%', minPct: 0.70, maxPct: 0.80, desc: 'Aerobic, improve cardio' },
        { name: '🟠 Zone 4: Hard', range: '80-90%', minPct: 0.80, maxPct: 0.90, desc: 'Anaerobic threshold' },
        { name: '🔴 Zone 5: Peak', range: '90-100%', minPct: 0.90, maxPct: 1.00, desc: 'Maximum effort, sprints' }
    ];
    
    $('hrZones').innerHTML = zones.map(z => {
        const low = Math.round((hrr * z.minPct) + resting);
        const high = Math.round((hrr * z.maxPct) + resting);
        return `
            <div class="tax-row">
                <span><strong>${z.name}</strong> (${z.range})<br><small style="color:var(--gray-500);">${z.desc}</small></span>
                <strong style="white-space:nowrap;">${low}-${high} bpm</strong>
            </div>
        `;
    }).join('');
    
    let insight = '';
    if (age < 30) {
        insight = `💪 Young heart! Max HR: ${maxHR} bpm. Push yourself with Zone 4-5 training for peak fitness.`;
    } else if (age < 50) {
        insight = `🏃 Active years! Mix Zone 2 (fat burn) and Zone 3-4 (cardio). Train 3-5x per week.`;
    } else {
        insight = `❤️ Healthy heart matters! Focus on Zone 2-3 for sustainable workouts. Consult doctor before intense exercise.`;
    }
    $('hrInsight').textContent = insight;
}

function setupSync() {
    hrAgeRange.addEventListener('input', () => { hrAge.value = hrAgeRange.value; calculateHR(); });
    hrAge.addEventListener('input', () => { hrAgeRange.value = hrAge.value; calculateHR(); });
    hrResting.addEventListener('input', calculateHR);
    hrFormula.addEventListener('change', calculateHR);
}

function resetHR() {
    hrAge.value = 30; hrAgeRange.value = 30;
    hrResting.value = 70;
    hrFormula.value = 'tanaka';
    calculateHR();
    showToast('🔄 Reset!');
}

function copyHR() {
    const txt = `❤️ Heart Rate Calculator\n\nAge: ${hrAge.value}\nResting HR: ${hrResting.value} bpm\nMax HR: ${$('hrMax').textContent}\nHR Reserve: ${$('hrReserve').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/heart-rate-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareHR() {
    shareContent('Heart Rate Calculator', `My max heart rate: ${$('hrMax').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    setupSync();
    calculateHR();
    renderRelatedTools('heart-rate-calculator', 'health', 6);
    console.log('✅ Heart Rate Calculator Loaded');
});
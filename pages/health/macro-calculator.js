'use strict';

const $ = id => document.getElementById(id);
const macroAge = $('macroAge');
const macroHeight = $('macroHeight');
const macroWeight = $('macroWeight');
const macroActivity = $('macroActivity');
const macroGoal = $('macroGoal');
const macroDiet = $('macroDiet');
let macroGender = 'male';

function setMacroGender(gender, event) {
    macroGender = gender;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    calculateMacros();
}

function calculateMacros() {
    const age = parseFloat(macroAge.value) || 0;
    const height = parseFloat(macroHeight.value) || 0;
    const weight = parseFloat(macroWeight.value) || 0;
    const activity = parseFloat(macroActivity.value) || 1.55;
    const goal = macroGoal.value;
    const diet = macroDiet.value;
    
    if (age <= 0 || height <= 0 || weight <= 0) {
        showToast('⚠️ Enter valid values');
        return;
    }
    
    // BMR (Mifflin-St Jeor)
    let bmr;
    if (macroGender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // TDEE
    let tdee = bmr * activity;
    
    // Goal adjustment
    const goalAdjustments = {
        loss: -500,
        cutting: -300,
        maintain: 0,
        lean: 300,
        bulk: 500
    };
    const calories = tdee + goalAdjustments[goal];
    
    // Diet macros (Protein/Carbs/Fat %)
    const diets = {
        balanced: { p: 30, c: 40, f: 30 },
        lowcarb: { p: 40, c: 20, f: 40 },
        keto: { p: 25, c: 5, f: 70 },
        highprotein: { p: 40, c: 30, f: 30 },
        highcarb: { p: 20, c: 60, f: 20 }
    };
    
    const ratio = diets[diet];
    
    // Calculate grams (Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g)
    const proteinGrams = Math.round((calories * ratio.p / 100) / 4);
    const carbsGrams = Math.round((calories * ratio.c / 100) / 4);
    const fatGrams = Math.round((calories * ratio.f / 100) / 9);
    
    const proteinCal = proteinGrams * 4;
    const carbsCal = carbsGrams * 4;
    const fatCal = fatGrams * 9;
    
    // Display
    $('macroCalories').textContent = Math.round(calories).toLocaleString();
    $('macroProtein').textContent = proteinGrams + 'g';
    $('macroCarbs').textContent = carbsGrams + 'g';
    $('macroFat').textContent = fatGrams + 'g';
    
    const goalLabels = {
        loss: 'Weight Loss (-500 cal)',
        cutting: 'Cutting (-300 cal)',
        maintain: 'Maintenance',
        lean: 'Lean Gain (+300 cal)',
        bulk: 'Muscle Gain (+500 cal)'
    };
    $('macroGoalText').textContent = `For ${goalLabels[goal]}`;
    
    // Breakdown
    $('macroBreakdown').innerHTML = `
        <div class="tax-row">
            <span>🍗 Protein</span>
            <strong>${proteinGrams}g (${proteinCal} cal, ${ratio.p}%)</strong>
        </div>
        <div class="tax-row">
            <span>🍚 Carbohydrates</span>
            <strong>${carbsGrams}g (${carbsCal} cal, ${ratio.c}%)</strong>
        </div>
        <div class="tax-row">
            <span>🥑 Fats</span>
            <strong>${fatGrams}g (${fatCal} cal, ${ratio.f}%)</strong>
        </div>
        <div class="tax-row total">
            <span>📊 Total Calories</span>
            <strong>${Math.round(calories).toLocaleString()} cal</strong>
        </div>
        <div class="tax-row">
            <span>Per kg Body Weight</span>
            <strong>P: ${(proteinGrams/weight).toFixed(1)}g, C: ${(carbsGrams/weight).toFixed(1)}g, F: ${(fatGrams/weight).toFixed(1)}g</strong>
        </div>
    `;
    
    // Meal distribution (3 meals + 2 snacks)
    const breakfast = Math.round(calories * 0.25);
    const snack1 = Math.round(calories * 0.10);
    const lunch = Math.round(calories * 0.30);
    const snack2 = Math.round(calories * 0.10);
    const dinner = Math.round(calories * 0.25);
    
    $('macroMeals').innerHTML = `
        <div class="tax-row"><span>🍳 Breakfast (25%)</span><strong>${breakfast} cal</strong></div>
        <div class="tax-row"><span>🍎 Mid-morning (10%)</span><strong>${snack1} cal</strong></div>
        <div class="tax-row"><span>🥗 Lunch (30%)</span><strong>${lunch} cal</strong></div>
        <div class="tax-row"><span>🥜 Evening (10%)</span><strong>${snack2} cal</strong></div>
        <div class="tax-row"><span>🍽️ Dinner (25%)</span><strong>${dinner} cal</strong></div>
    `;
    
    // Insight
    let insight = '';
    if (goal === 'loss') {
        insight = `🔥 Weight loss plan! Eat ${Math.round(calories)} cal/day. Expect 0.5-1 kg loss/week. Focus on high protein to preserve muscle.`;
    } else if (goal === 'bulk') {
        insight = `💪 Muscle gain plan! Eat ${Math.round(calories)} cal/day. Expect 0.5 kg gain/week. Combine with strength training.`;
    } else if (goal === 'maintain') {
        insight = `⚖️ Maintenance plan! Eat ${Math.round(calories)} cal/day to maintain current weight. Adjust if weight changes.`;
    } else {
        insight = `🎯 ${goalLabels[goal]} plan! Eat ${Math.round(calories)} cal with ${ratio.p}% protein, ${ratio.c}% carbs, ${ratio.f}% fat.`;
    }
    $('macroInsight').textContent = insight;
}

function resetMacros() {
    macroAge.value = 25;
    macroHeight.value = 170;
    macroWeight.value = 70;
    macroActivity.value = 1.55;
    macroGoal.value = 'maintain';
    macroDiet.value = 'balanced';
    calculateMacros();
    showToast('🔄 Reset!');
}

function copyMacros() {
    const txt = `🍱 Macro Calculator\n\nGoal: ${$('macroGoalText').textContent}\nCalories: ${$('macroCalories').textContent}\n\nProtein: ${$('macroProtein').textContent}\nCarbs: ${$('macroCarbs').textContent}\nFat: ${$('macroFat').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/macro-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareMacros() {
    shareContent('Macro Calculator', `My daily macros: ${$('macroProtein').textContent}P, ${$('macroCarbs').textContent}C, ${$('macroFat').textContent}F`, location.href);
}

[macroAge, macroHeight, macroWeight, macroActivity, macroGoal, macroDiet].forEach(el => el.addEventListener('input', calculateMacros));
[macroActivity, macroGoal, macroDiet].forEach(el => el.addEventListener('change', calculateMacros));

document.addEventListener('DOMContentLoaded', () => {
    calculateMacros();
    renderRelatedTools('macro-calculator', 'health', 6);
    console.log('✅ Macro Calculator Loaded');
});
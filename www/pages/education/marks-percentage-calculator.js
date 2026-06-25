'use strict';

const $ = id => document.getElementById(id);
let subjCount = 0;

function addMarksSubject() {
    subjCount++;
    const html = `
        <div class="marks-subj" id="marksSubj${subjCount}" style="display:flex;gap:8px;margin-bottom:10px;align-items:center;">
            <input type="text" class="form-input marks-name" placeholder="Subject" value="Subject ${subjCount}" style="flex:1;">
            <input type="number" class="form-input marks-obt" value="85" min="0" placeholder="Marks" style="width:80px;" oninput="calculateMarks()">
            <span style="font-weight:700;color:var(--gray-500);">/</span>
            <input type="number" class="form-input marks-max" value="100" min="1" placeholder="Max" style="width:80px;" oninput="calculateMarks()">
            <button onclick="removeMarksSubject(${subjCount})" type="button" style="background:#FEE2E2;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;color:#DC2626;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    $('marksSubjects').insertAdjacentHTML('beforeend', html);
    calculateMarks();
}

function removeMarksSubject(id) {
    const el = $(`marksSubj${id}`);
    if (el) el.remove();
    calculateMarks();
}

function calculateMarks() {
    const subjs = document.querySelectorAll('.marks-subj');
    let totalObt = 0;
    let totalMax = 0;
    let breakdown = '';
    
    subjs.forEach((subj, i) => {
        const name = subj.querySelector('.marks-name').value;
        const obt = parseFloat(subj.querySelector('.marks-obt').value) || 0;
        const max = parseFloat(subj.querySelector('.marks-max').value) || 0;
        const pct = max > 0 ? (obt / max) * 100 : 0;
        totalObt += obt;
        totalMax += max;
        breakdown += `<div class="tax-row"><span>${name}</span><strong>${obt}/${max} (${pct.toFixed(1)}%)</strong></div>`;
    });
    
    const percent = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
    
    let grade, color, insight;
    if (percent >= 90) { grade = 'O (Outstanding)'; color = '#059669'; insight = `🏆 Outstanding ${percent.toFixed(1)}%! Top performer!`; }
    else if (percent >= 80) { grade = 'A+ (Excellent)'; color = '#10B981'; insight = `🎯 Excellent ${percent.toFixed(1)}%! First class with distinction!`; }
    else if (percent >= 70) { grade = 'A (First Class)'; color = '#3B82F6'; insight = `👍 Great ${percent.toFixed(1)}%! First class result.`; }
    else if (percent >= 60) { grade = 'B+ (Above Average)'; color = '#3B82F6'; insight = `📊 Good ${percent.toFixed(1)}%! Above average.`; }
    else if (percent >= 50) { grade = 'B (Second Class)'; color = '#F59E0B'; insight = `📋 Second class with ${percent.toFixed(1)}%.`; }
    else if (percent >= 40) { grade = 'C (Pass)'; color = '#F97316'; insight = `⚠️ Just passed with ${percent.toFixed(1)}%. Focus on improvement.`; }
    else { grade = 'F (Fail)'; color = '#DC2626'; insight = `🚨 Failed with ${percent.toFixed(1)}%. Need significant improvement.`; }
    
    $('marksPercent').textContent = percent.toFixed(2) + '%';
    $('marksGrade').textContent = grade;
    $('marksObtained').textContent = totalObt;
    $('marksTotal').textContent = totalMax;
    $('marksMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    $('marksInsight').textContent = insight;
    
    breakdown += `<div class="tax-row total"><span>Total Obtained</span><strong>${totalObt}</strong></div>`;
    breakdown += `<div class="tax-row"><span>Total Maximum</span><strong>${totalMax}</strong></div>`;
    breakdown += `<div class="tax-row total"><span>Percentage</span><strong style="color:#059669;">${percent.toFixed(2)}%</strong></div>`;
    $('marksBreakdown').innerHTML = breakdown;
}

function resetMarks() {
    $('marksSubjects').innerHTML = '';
    subjCount = 0;
    addMarksSubject(); addMarksSubject(); addMarksSubject(); addMarksSubject(); addMarksSubject();
    showToast('🔄 Reset!');
}

function copyMarks() {
    const txt = `📊 Marks Percentage\n\nObtained: ${$('marksObtained').textContent}/${$('marksTotal').textContent}\nPercentage: ${$('marksPercent').textContent}\nGrade: ${$('marksGrade').textContent}\n\nhttps://calculator.aitoolcor.com/pages/education/marks-percentage-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareMarks() {
    shareContent('Marks Percentage', `My percentage: ${$('marksPercent').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    addMarksSubject(); addMarksSubject(); addMarksSubject(); addMarksSubject(); addMarksSubject();
    renderRelatedTools('marks-percentage-calculator', 'education', 6);
    console.log('✅ Marks Calculator Loaded');
});
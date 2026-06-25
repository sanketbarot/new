'use strict';

const $ = id => document.getElementById(id);
let gradeItemCount = 0;

function addGradeItem() {
    gradeItemCount++;
    const html = `
        <div class="grade-item" id="gradeItem${gradeItemCount}" style="display:flex;gap:8px;margin-bottom:10px;align-items:center;">
            <input type="text" class="form-input grade-name" placeholder="Assessment" value="${['Homework', 'Quiz', 'Midterm', 'Final'][gradeItemCount - 1] || 'Item ' + gradeItemCount}" style="flex:1;">
            <input type="number" class="form-input grade-score" value="${[85, 90, 80, 95][gradeItemCount - 1] || 85}" min="0" max="100" placeholder="Score %" style="width:80px;" oninput="calculateGrade()">
            <input type="number" class="form-input grade-weight" value="${[20, 20, 30, 30][gradeItemCount - 1] || 25}" min="0" max="100" placeholder="Weight %" style="width:80px;" oninput="calculateGrade()">
            <button onclick="removeGradeItem(${gradeItemCount})" type="button" style="background:#FEE2E2;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;color:#DC2626;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    $('gradeItems').insertAdjacentHTML('beforeend', html);
    calculateGrade();
}

function removeGradeItem(id) {
    const el = $(`gradeItem${id}`);
    if (el) el.remove();
    calculateGrade();
}

function calculateGrade() {
    const items = document.querySelectorAll('.grade-item');
    let weightedSum = 0;
    let totalWeight = 0;
    let breakdown = '';
    
    items.forEach((item, i) => {
        const name = item.querySelector('.grade-name').value;
        const score = parseFloat(item.querySelector('.grade-score').value) || 0;
        const weight = parseFloat(item.querySelector('.grade-weight').value) || 0;
        const contribution = (score * weight) / 100;
        weightedSum += contribution;
        totalWeight += weight;
        breakdown += `<div class="tax-row"><span>${name} (${weight}%)</span><strong>${score}% → ${contribution.toFixed(2)}</strong></div>`;
    });
    
    const finalGrade = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
    
    let letter, color, insight;
    if (finalGrade >= 97) { letter = 'A+'; color = '#059669'; insight = '🏆 Outstanding A+!'; }
    else if (finalGrade >= 93) { letter = 'A'; color = '#10B981'; insight = '🎯 Excellent A grade!'; }
    else if (finalGrade >= 90) { letter = 'A-'; color = '#10B981'; insight = '👍 Great A- performance!'; }
    else if (finalGrade >= 87) { letter = 'B+'; color = '#3B82F6'; insight = '📊 Good B+ work!'; }
    else if (finalGrade >= 83) { letter = 'B'; color = '#3B82F6'; insight = '📋 Solid B grade.'; }
    else if (finalGrade >= 80) { letter = 'B-'; color = '#3B82F6'; insight = '✓ B- grade.'; }
    else if (finalGrade >= 70) { letter = 'C'; color = '#F59E0B'; insight = '⚠️ Average C grade.'; }
    else if (finalGrade >= 60) { letter = 'D'; color = '#F97316'; insight = '⚠️ Below average.'; }
    else { letter = 'F'; color = '#DC2626'; insight = '🚨 Failing grade!'; }
    
    $('gradeValue').textContent = finalGrade.toFixed(2) + '%';
    $('gradeLetter').textContent = `Grade: ${letter}`;
    $('gradeLetterBig').textContent = letter;
    $('gradeWeight').textContent = totalWeight + '%';
    $('gradeMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    $('gradeInsight').textContent = insight;
    
    breakdown += `<div class="tax-row total"><span>Total Weight</span><strong>${totalWeight}%</strong></div>`;
    breakdown += `<div class="tax-row total"><span>Final Grade</span><strong style="color:#059669;">${finalGrade.toFixed(2)}% (${letter})</strong></div>`;
    $('gradeBreakdown').innerHTML = breakdown;
}

function resetGrade() {
    $('gradeItems').innerHTML = '';
    gradeItemCount = 0;
    addGradeItem(); addGradeItem(); addGradeItem(); addGradeItem();
    showToast('🔄 Reset!');
}

function copyGrade() {
    const txt = `🎓 Grade Calculator\n\nFinal Grade: ${$('gradeValue').textContent}\nLetter: ${$('gradeLetter').textContent}\n\nhttps://calculator.aitoolcor.com/pages/education/grade-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareGrade() {
    shareContent('Grade Calculator', `My grade: ${$('gradeValue').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    addGradeItem(); addGradeItem(); addGradeItem(); addGradeItem();
    renderRelatedTools('grade-calculator', 'education', 6);
    console.log('✅ Grade Calculator Loaded');
});
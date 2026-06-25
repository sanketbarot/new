'use strict';

const $ = id => document.getElementById(id);
let semCount = 0;

function addCgpaSem() {
    semCount++;
    const html = `
        <div class="cgpa-sem" id="cgpaSem${semCount}" style="display:flex;gap:8px;margin-bottom:10px;align-items:center;">
            <span style="font-weight:600;width:80px;">Sem ${semCount}:</span>
            <input type="number" class="form-input cgpa-sgpa" value="8.5" min="0" max="10" step="0.01" placeholder="SGPA" style="flex:1;" oninput="calculateCGPA()">
            <input type="number" class="form-input cgpa-credit" value="24" min="1" max="50" placeholder="Credits" style="width:80px;" oninput="calculateCGPA()">
            <button onclick="removeCgpaSem(${semCount})" type="button" style="background:#FEE2E2;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;color:#DC2626;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    $('cgpaSemesters').insertAdjacentHTML('beforeend', html);
    calculateCGPA();
}

function removeCgpaSem(id) {
    const el = $(`cgpaSem${id}`);
    if (el) el.remove();
    calculateCGPA();
}

function calculateCGPA() {
    const sems = document.querySelectorAll('.cgpa-sem');
    let totalPoints = 0;
    let totalCredits = 0;
    let breakdown = '';
    
    sems.forEach((sem, i) => {
        const sgpa = parseFloat(sem.querySelector('.cgpa-sgpa').value) || 0;
        const credits = parseFloat(sem.querySelector('.cgpa-credit').value) || 0;
        const points = sgpa * credits;
        totalPoints += points;
        totalCredits += credits;
        breakdown += `<div class="tax-row"><span>Semester ${i + 1}</span><strong>${sgpa} × ${credits} = ${points.toFixed(2)}</strong></div>`;
    });
    
    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    
    // Conversions
    const cbse = cgpa * 9.5;
    const vtu = (cgpa - 0.75) * 10;
    const annau = (cgpa * 10) - 7.5;
    
    $('cgpaValue').textContent = cgpa.toFixed(2);
    $('cgpaPercent').textContent = `≈ ${cbse.toFixed(2)}% (CBSE)`;
    $('cgpaSemCount').textContent = sems.length;
    $('cgpaTotalCredits').textContent = totalCredits;
    
    breakdown += `<div class="tax-row total"><span>Total Points</span><strong>${totalPoints.toFixed(2)}</strong></div>`;
    breakdown += `<div class="tax-row"><span>Total Credits</span><strong>${totalCredits}</strong></div>`;
    breakdown += `<div class="tax-row total"><span>CGPA</span><strong style="color:#059669;">${cgpa.toFixed(2)}</strong></div>`;
    $('cgpaBreakdown').innerHTML = breakdown;
    
    $('cgpaPercentConversion').innerHTML = `
        <div class="tax-row"><span>CBSE Formula (×9.5)</span><strong>${cbse.toFixed(2)}%</strong></div>
        <div class="tax-row"><span>VTU Formula ((C-0.75)×10)</span><strong>${vtu.toFixed(2)}%</strong></div>
        <div class="tax-row"><span>Anna Univ ((C×10)-7.5)</span><strong>${annau.toFixed(2)}%</strong></div>
    `;
    
    let insight = '';
    if (cgpa >= 9) insight = `🏆 Outstanding! Top 5% performance. Distinction grade!`;
    else if (cgpa >= 8) insight = `🎯 Excellent CGPA! First class with distinction.`;
    else if (cgpa >= 7) insight = `👍 Good performance. First class.`;
    else if (cgpa >= 6) insight = `📊 Above average. Second class.`;
    else if (cgpa >= 5) insight = `⚠️ Just passing. Focus on improvement.`;
    else insight = `🚨 Failing grade. Take action immediately!`;
    $('cgpaInsight').textContent = insight;
}

function resetCGPA() {
    $('cgpaSemesters').innerHTML = '';
    semCount = 0;
    addCgpaSem(); addCgpaSem(); addCgpaSem(); addCgpaSem();
    showToast('🔄 Reset!');
}

function copyCGPA() {
    const txt = `🎓 CGPA Calculator\n\nCGPA: ${$('cgpaValue').textContent}\nPercentage: ${$('cgpaPercent').textContent}\nSemesters: ${$('cgpaSemCount').textContent}\n\nhttps://calculator.aitoolcor.com/pages/education/cgpa-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareCGPA() {
    shareContent('CGPA Calculator', `My CGPA: ${$('cgpaValue').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    addCgpaSem(); addCgpaSem(); addCgpaSem(); addCgpaSem();
    renderRelatedTools('cgpa-calculator', 'education', 6);
    console.log('✅ CGPA Calculator Loaded');
}); 
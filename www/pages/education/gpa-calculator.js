'use strict';

const $ = id => document.getElementById(id);
let gpaScale = '4';
let gpaCourseCount = 0;

const GRADE_VALUES_4 = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
};

const GRADE_VALUES_10 = {
    'O': 10, 'A+': 9, 'A': 8,
    'B+': 7, 'B': 6, 'C': 5,
    'P': 4, 'F': 0
};

function setGpaScale(scale, event) {
    gpaScale = scale;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    document.getElementById('gpaCourses').innerHTML = '';
    gpaCourseCount = 0;
    addGpaCourse(); addGpaCourse(); addGpaCourse(); addGpaCourse();
    calculateGPA();
}

function addGpaCourse() {
    gpaCourseCount++;
    const grades = gpaScale === '4' ? GRADE_VALUES_4 : GRADE_VALUES_10;
    const gradeOptions = Object.keys(grades).map(g => `<option value="${grades[g]}">${g}</option>`).join('');
    
    const courseHTML = `
        <div class="gpa-course" id="gpaCourse${gpaCourseCount}" style="display:flex;gap:8px;margin-bottom:10px;align-items:center;">
            <input type="text" class="form-input gpa-name" placeholder="Course ${gpaCourseCount}" value="Course ${gpaCourseCount}" style="flex:1;">
            <select class="form-input gpa-grade" style="width:80px;" onchange="calculateGPA()">${gradeOptions}</select>
            <input type="number" class="form-input gpa-credit" value="3" min="1" max="10" placeholder="Credits" style="width:80px;" oninput="calculateGPA()">
            <button onclick="removeGpaCourse(${gpaCourseCount})" type="button" style="background:#FEE2E2;border:none;width:36px;height:36px;border-radius:8px;cursor:pointer;color:#DC2626;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    $('gpaCourses').insertAdjacentHTML('beforeend', courseHTML);
    calculateGPA();
}

function removeGpaCourse(id) {
    const el = $(`gpaCourse${id}`);
    if (el) el.remove();
    calculateGPA();
}

function calculateGPA() {
    const courses = document.querySelectorAll('.gpa-course');
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const grade = parseFloat(course.querySelector('.gpa-grade').value) || 0;
        const credit = parseFloat(course.querySelector('.gpa-credit').value) || 0;
        totalPoints += grade * credit;
        totalCredits += credit;
    });
    
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const maxScale = gpaScale === '4' ? 4.0 : 10.0;
    
    $('gpaValue').textContent = gpa.toFixed(2);
    $('gpaCredits').textContent = totalCredits;
    $('gpaPoints').textContent = totalPoints.toFixed(2);
    
    let category, color, insight;
    if (gpaScale === '4') {
        if (gpa >= 3.7) { category = 'Excellent'; color = '#059669'; insight = '🏆 Outstanding! Top tier academic performance.'; }
        else if (gpa >= 3.3) { category = 'Very Good'; color = '#10B981'; insight = '🎯 Very good! Above average performance.'; }
        else if (gpa >= 3.0) { category = 'Good'; color = '#3B82F6'; insight = '👍 Good GPA! Maintain consistency.'; }
        else if (gpa >= 2.5) { category = 'Average'; color = '#F59E0B'; insight = '📊 Average. Work harder for better grades.'; }
        else if (gpa >= 2.0) { category = 'Below Average'; color = '#F97316'; insight = '⚠️ Below average. Focus on improvement.'; }
        else { category = 'Poor'; color = '#DC2626'; insight = '🚨 Need significant improvement. Seek help!'; }
    } else {
        if (gpa >= 8.5) { category = 'Excellent (O)'; color = '#059669'; insight = '🏆 Outstanding performance!'; }
        else if (gpa >= 7.5) { category = 'Very Good (A+)'; color = '#10B981'; insight = '🎯 Very good!'; }
        else if (gpa >= 6.5) { category = 'Good (A)'; color = '#3B82F6'; insight = '👍 Good GPA!'; }
        else if (gpa >= 5.5) { category = 'Average (B+)'; color = '#F59E0B'; insight = '📊 Average performance.'; }
        else if (gpa >= 4.0) { category = 'Pass (P)'; color = '#F97316'; insight = '⚠️ Just passing. Improve!'; }
        else { category = 'Fail (F)'; color = '#DC2626'; insight = '🚨 Failing! Take action!'; }
    }
    
    $('gpaCategory').textContent = `${category} (${maxScale} Scale)`;
    $('gpaInsight').textContent = insight;
    $('gpaMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    
    // Scale info
    if (gpaScale === '4') {
        $('gpaScaleInfo').innerHTML = `
            <div class="tax-row"><span>🟢 Excellent</span><strong>3.7 - 4.0</strong></div>
            <div class="tax-row"><span>🔵 Very Good</span><strong>3.3 - 3.7</strong></div>
            <div class="tax-row"><span>🔵 Good</span><strong>3.0 - 3.3</strong></div>
            <div class="tax-row"><span>🟡 Average</span><strong>2.5 - 3.0</strong></div>
            <div class="tax-row"><span>🟠 Below Avg</span><strong>2.0 - 2.5</strong></div>
            <div class="tax-row"><span>🔴 Poor</span><strong>Below 2.0</strong></div>
        `;
    } else {
        $('gpaScaleInfo').innerHTML = `
            <div class="tax-row"><span>🟢 Outstanding (O)</span><strong>10</strong></div>
            <div class="tax-row"><span>🔵 Excellent (A+)</span><strong>9</strong></div>
            <div class="tax-row"><span>🔵 Very Good (A)</span><strong>8</strong></div>
            <div class="tax-row"><span>🟡 Good (B+)</span><strong>7</strong></div>
            <div class="tax-row"><span>🟡 Above Average (B)</span><strong>6</strong></div>
            <div class="tax-row"><span>🟠 Average (C)</span><strong>5</strong></div>
            <div class="tax-row"><span>🟠 Pass (P)</span><strong>4</strong></div>
            <div class="tax-row"><span>🔴 Fail (F)</span><strong>0</strong></div>
        `;
    }
}

function resetGPA() {
    document.getElementById('gpaCourses').innerHTML = '';
    gpaCourseCount = 0;
    addGpaCourse(); addGpaCourse(); addGpaCourse(); addGpaCourse();
    calculateGPA();
    showToast('🔄 Reset!');
}

function copyGPA() {
    const txt = `🎓 GPA Calculator\n\nGPA: ${$('gpaValue').textContent}\nCategory: ${$('gpaCategory').textContent}\nTotal Credits: ${$('gpaCredits').textContent}\n\nhttps://calculator.aitoolcor.com/pages/education/gpa-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareGPA() {
    shareContent('GPA Calculator', `My GPA: ${$('gpaValue').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    addGpaCourse(); addGpaCourse(); addGpaCourse(); addGpaCourse();
    renderRelatedTools('gpa-calculator', 'education', 6);
    console.log('✅ GPA Calculator Loaded');
});
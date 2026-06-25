'use strict';

const $ = id => document.getElementById(id);
const lmpDate = $('lmpDate');
const cycleLength = $('cycleLength');

function calculatePregnancy() {
    const lmp = new Date(lmpDate.value);
    const cycle = parseInt(cycleLength.value) || 28;
    
    if (!lmpDate.value || isNaN(lmp.getTime())) {
        showToast('⚠️ Enter valid LMP date');
        return;
    }
    
    const today = new Date();
    if (lmp > today) {
        showToast('⚠️ LMP date cannot be in future');
        return;
    }
    
    // Adjusted LMP based on cycle length (cycle != 28)
    const cycleAdjustment = cycle - 28;
    
    // Due date = LMP + 280 days (40 weeks) adjusted for cycle
    const due = new Date(lmp);
    due.setDate(lmp.getDate() + 280 + cycleAdjustment);
    
    // Current week
    const diffMs = today - lmp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7);
    const currentDayInWeek = diffDays % 7;
    
    // Days remaining
    const daysToDue = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    
    // Trimester
    let trimester, trimesterIcon;
    if (currentWeek < 13) { trimester = '1st Trimester'; trimesterIcon = '🌱'; }
    else if (currentWeek < 28) { trimester = '2nd Trimester'; trimesterIcon = '🌿'; }
    else { trimester = '3rd Trimester'; trimesterIcon = '🌳'; }
    
    // Progress
    const progress = Math.min(100, Math.max(0, (diffDays / 280) * 100));
    
    // Format dates
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dueDateStr = `${months[due.getMonth()]} ${due.getDate()}, ${due.getFullYear()}`;
    const dueDayStr = days[due.getDay()];
    
    $('dueDate').textContent = dueDateStr;
    $('dueDateDay').textContent = dueDayStr;
    $('currentWeek').textContent = currentWeek > 0 ? `${currentWeek}w ${currentDayInWeek}d` : '0w';
    $('daysRemaining').textContent = daysToDue > 0 ? daysToDue : 'Past Due!';
    $('trimester').textContent = trimester;
    $('progress').textContent = progress.toFixed(0) + '%';
    
    // Timeline milestones
    const milestone = (weeks, desc) => {
        const date = new Date(lmp);
        date.setDate(lmp.getDate() + (weeks * 7) + cycleAdjustment);
        const past = date <= today;
        const dateStr = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        return `<div class="tax-row ${past ? '' : ''}"><span>${past ? '✅' : '📅'} ${desc}</span><strong>${dateStr}</strong></div>`;
    };
    
    $('pregTimeline').innerHTML = `
        ${milestone(8, 'First Doctor Visit (8w)')}
        ${milestone(12, 'End of 1st Trimester (12w)')}
        ${milestone(16, 'Gender can be detected (16w)')}
        ${milestone(20, 'Anatomy Scan (20w)')}
        ${milestone(24, 'Viability (24w)')}
        ${milestone(28, '3rd Trimester Begins (28w)')}
        ${milestone(36, 'Baby is Full Term (36w)')}
        ${milestone(40, '🎉 Due Date (40w)')}
    `;
    
    // Insight
    let insight = '';
    if (daysToDue < 0) {
        insight = `🎉 Your due date has passed! Baby may arrive any moment. Stay in touch with your doctor.`;
    } else if (currentWeek < 13) {
        insight = `🌱 1st Trimester (${currentWeek}w). Focus on prenatal vitamins, rest, and avoiding harmful substances. First doctor visit recommended!`;
    } else if (currentWeek < 28) {
        insight = `🌿 2nd Trimester (${currentWeek}w) - Best trimester! Energy returns, morning sickness fades. Time for anatomy scan!`;
    } else {
        insight = `🌳 3rd Trimester (${currentWeek}w). ${daysToDue} days until baby arrives! Prepare hospital bag, attend birthing classes.`;
    }
    $('pregInsight').textContent = insight;
}

function resetPregnancy() {
    const today = new Date();
    const lmp = new Date(today);
    lmp.setDate(lmp.getDate() - 84); // 12 weeks ago
    lmpDate.value = lmp.toISOString().split('T')[0];
    cycleLength.value = 28;
    calculatePregnancy();
    showToast('🔄 Reset!');
}

function copyPreg() {
    const txt = `🤰 Pregnancy Calculator\n\nLMP: ${lmpDate.value}\nCycle: ${cycleLength.value} days\n\nDue Date: ${$('dueDate').textContent}\nCurrent Week: ${$('currentWeek').textContent}\nTrimester: ${$('trimester').textContent}\nDays Remaining: ${$('daysRemaining').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/pregnancy-due-date-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function sharePreg() {
    shareContent('Pregnancy Calculator', `My baby's due date: ${$('dueDate').textContent}!`, location.href);
}

lmpDate.addEventListener('change', calculatePregnancy);
cycleLength.addEventListener('input', calculatePregnancy);

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const defaultLmp = new Date(today);
    defaultLmp.setDate(today.getDate() - 84); // 12 weeks ago
    lmpDate.value = defaultLmp.toISOString().split('T')[0];
    lmpDate.max = today.toISOString().split('T')[0];
    calculatePregnancy();
    renderRelatedTools('pregnancy-due-date-calculator', 'health', 6);
    console.log('✅ Pregnancy Calculator Loaded');
});
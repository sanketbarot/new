'use strict';

const $ = id => document.getElementById(id);
const dateFrom = $('dateFrom');
const dateTo = $('dateTo');

function setDateRange(type) {
    const today = new Date();
    const future = new Date(today);
    
    if (type === 'today') {
        dateFrom.value = today.toISOString().split('T')[0];
        dateTo.value = today.toISOString().split('T')[0];
    } else if (type === 'week') {
        future.setDate(today.getDate() + 7);
        dateFrom.value = today.toISOString().split('T')[0];
        dateTo.value = future.toISOString().split('T')[0];
    } else if (type === 'month') {
        future.setMonth(today.getMonth() + 1);
        dateFrom.value = today.toISOString().split('T')[0];
        dateTo.value = future.toISOString().split('T')[0];
    } else if (type === 'year') {
        future.setFullYear(today.getFullYear() + 1);
        dateFrom.value = today.toISOString().split('T')[0];
        dateTo.value = future.toISOString().split('T')[0];
    }
    calculateDateDiff();
}

function calculateDateDiff() {
    const from = new Date(dateFrom.value);
    const to = new Date(dateTo.value);
    
    if (!dateFrom.value || !dateTo.value || isNaN(from) || isNaN(to)) {
        showToast('⚠️ Select both dates');
        return;
    }
    
    const ms = Math.abs(to - from);
    const isReverse = to < from;
    
    const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const totalSeconds = Math.floor(ms / 1000);
    const totalWeeks = Math.floor(totalDays / 7);
    
    // Y/M/D calculation
    let earlier = isReverse ? to : from;
    let later = isReverse ? from : to;
    
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();
    
    if (days < 0) {
        months--;
        const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Working days
    let workingDays = 0;
    const currentDate = new Date(earlier);
    while (currentDate <= later) {
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) workingDays++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Total months & years
    const totalMonths = years * 12 + months;
    const totalYears = totalDays / 365.25;
    
    $('ddMain').textContent = totalDays.toLocaleString('en-IN') + ' days';
    $('ddSub').textContent = `From ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`;
    $('ddYMD').textContent = `${years}y ${months}m ${days}d`;
    $('ddWorking').textContent = workingDays.toLocaleString('en-IN');
    
    $('ddBreakdown').innerHTML = `
        <div class="tax-row"><span>Years</span><strong>${years} years</strong></div>
        <div class="tax-row"><span>Months</span><strong>${months} months</strong></div>
        <div class="tax-row"><span>Days</span><strong>${days} days</strong></div>
        <div class="tax-row total"><span>Total Days</span><strong>${totalDays.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Total Weeks</span><strong>${totalWeeks.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Total Months</span><strong>${totalMonths}</strong></div>
        <div class="tax-row"><span>Total Years</span><strong>${totalYears.toFixed(2)}</strong></div>
        <div class="tax-row"><span>Working Days (Mon-Fri)</span><strong>${workingDays.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Weekend Days</span><strong>${totalDays - workingDays}</strong></div>
        <div class="tax-row"><span>Total Hours</span><strong>${totalHours.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Total Minutes</span><strong>${totalMinutes.toLocaleString('en-IN')}</strong></div>
    `;
    
    $('ddInsight').textContent = isReverse 
        ? `📅 To date is before From date. Showing absolute difference of ${totalDays} days.`
        : `📅 ${totalDays} days = ${totalWeeks} weeks = ${totalMonths} months. Working days: ${workingDays}`;
}

function resetDateDiff() {
    const today = new Date();
    const future = new Date(today);
    future.setFullYear(today.getFullYear() + 1);
    dateFrom.value = today.toISOString().split('T')[0];
    dateTo.value = future.toISOString().split('T')[0];
    calculateDateDiff();
    showToast('🔄 Reset!');
}

function copyDD() {
    const txt = `📅 Date Difference\n\nFrom: ${dateFrom.value}\nTo: ${dateTo.value}\n\nTotal: ${$('ddMain').textContent}\nYears/Months/Days: ${$('ddYMD').textContent}\nWorking Days: ${$('ddWorking').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/date-difference-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareDD() {
    shareContent('Date Difference', `Difference: ${$('ddMain').textContent}`, location.href);
}

[dateFrom, dateTo].forEach(el => el.addEventListener('change', calculateDateDiff));

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const future = new Date(today);
    future.setFullYear(today.getFullYear() + 1);
    dateFrom.value = today.toISOString().split('T')[0];
    dateTo.value = future.toISOString().split('T')[0];
    calculateDateDiff();
    renderRelatedTools('date-difference-calculator', 'daily-use', 6);
    console.log('✅ Date Difference Calculator Loaded');
});
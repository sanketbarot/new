'use strict';

const $ = id => document.getElementById(id);
let timeOp = 'add';

function setTimeOp(op, event) {
    timeOp = op;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('timeOp').textContent = op === 'add' ? '+' : '-';
    calculateTime();
}

function calculateTime() {
    const h1 = parseInt($('time1h').value) || 0;
    const m1 = parseInt($('time1m').value) || 0;
    const s1 = parseInt($('time1s').value) || 0;
    const h2 = parseInt($('time2h').value) || 0;
    const m2 = parseInt($('time2m').value) || 0;
    const s2 = parseInt($('time2s').value) || 0;
    
    const totalSec1 = h1 * 3600 + m1 * 60 + s1;
    const totalSec2 = h2 * 3600 + m2 * 60 + s2;
    
    let resultSec;
    if (timeOp === 'add') {
        resultSec = totalSec1 + totalSec2;
    } else {
        resultSec = Math.abs(totalSec1 - totalSec2);
    }
    
    const hrs = Math.floor(resultSec / 3600);
    const mins = Math.floor((resultSec % 3600) / 60);
    const secs = resultSec % 60;
    
    const totalHours = (resultSec / 3600).toFixed(2);
    const totalMinutes = Math.floor(resultSec / 60);
    
    $('timeResult').textContent = `${hrs}h ${mins}m ${secs}s`;
    $('timeSub').textContent = timeOp === 'add' ? 'Sum of times' : 'Difference of times';
    $('timeSecs').textContent = resultSec.toLocaleString('en-IN');
    $('timeHrs').textContent = totalHours;
    
    $('timeBreakdown').innerHTML = `
        <div class="tax-row"><span>Time 1</span><strong>${h1}h ${m1}m ${s1}s</strong></div>
        <div class="tax-row"><span>Operation</span><strong>${timeOp === 'add' ? 'Add (+)' : 'Subtract (-)'}</strong></div>
        <div class="tax-row"><span>Time 2</span><strong>${h2}h ${m2}m ${s2}s</strong></div>
        <div class="tax-row total"><span>Result</span><strong style="color:#059669;">${hrs}h ${mins}m ${secs}s</strong></div>
        <div class="tax-row"><span>Total Seconds</span><strong>${resultSec.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Total Minutes</span><strong>${totalMinutes.toLocaleString('en-IN')}</strong></div>
        <div class="tax-row"><span>Total Hours</span><strong>${totalHours}</strong></div>
        <div class="tax-row"><span>Total Days</span><strong>${(resultSec / 86400).toFixed(3)}</strong></div>
    `;
    
    $('timeInsight').textContent = `⏰ Total: ${hrs}h ${mins}m ${secs}s. Equivalent to ${resultSec.toLocaleString('en-IN')} seconds or ${totalHours} hours.`;
}

function resetTime() {
    $('time1h').value = 5; $('time1m').value = 30; $('time1s').value = 0;
    $('time2h').value = 2; $('time2m').value = 45; $('time2s').value = 0;
    timeOp = 'add';
    document.querySelectorAll('.gst-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    $('timeOp').textContent = '+';
    calculateTime();
    showToast('🔄 Reset!');
}

function copyTime() {
    const txt = `⏰ Time Calculator\n\nOperation: ${timeOp}\nResult: ${$('timeResult').textContent}\nTotal Hours: ${$('timeHrs').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/time-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareTime() {
    shareContent('Time Calculator', `Result: ${$('timeResult').textContent}`, location.href);
}

['time1h', 'time1m', 'time1s', 'time2h', 'time2m', 'time2s'].forEach(id => 
    $(id).addEventListener('input', calculateTime)
);

document.addEventListener('DOMContentLoaded', () => {
    calculateTime();
    renderRelatedTools('time-calculator', 'daily-use', 6);
    console.log('✅ Time Calculator Loaded');
});
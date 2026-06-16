'use strict';

const $ = id => document.getElementById(id);
const attTotal = $('attTotal');
const attAttended = $('attAttended');
const attRequired = $('attRequired');
const attFuture = $('attFuture');

function calculateAttendance() {
    const total = parseInt(attTotal.value) || 0;
    const attended = parseInt(attAttended.value) || 0;
    const required = parseFloat(attRequired.value) || 75;
    const future = parseInt(attFuture.value) || 0;
    
    if (total <= 0 || attended > total) {
        showToast('⚠️ Invalid values');
        return;
    }
    
    const currentPct = (attended / total) * 100;
    const missed = total - attended;
    
    // Required calculation
    const requiredAttendance = Math.ceil((required / 100) * total);
    const shortBy = Math.max(0, requiredAttendance - attended);
    
    // Future calculation
    const futureTotal = total + future;
    const requiredForFuture = Math.ceil((required / 100) * futureTotal);
    const needToAttend = Math.max(0, requiredForFuture - attended);
    const canSkip = Math.max(0, future - needToAttend);
    
    let color, status, statusBig, insight;
    if (currentPct >= required) {
        color = '#059669';
        status = '✅ Safe - Meeting requirement';
        statusBig = '✅ Safe';
        const skipNow = Math.floor((attended - ((required / 100) * total)) / (required / 100));
        insight = `🎉 Great! You can miss up to ${skipNow} consecutive classes and still maintain ${required}%.`;
    } else if (currentPct >= required - 5) {
        color = '#F59E0B';
        status = '⚠️ Borderline - Be careful';
        statusBig = '⚠️ Borderline';
        insight = `⚠️ Close to limit! Attend next ${needToAttend} classes to reach ${required}%.`;
    } else {
        color = '#DC2626';
        status = '🚨 Short - Need improvement';
        statusBig = '🚨 Short';
        insight = `🚨 Below ${required}%! Must attend ALL upcoming ${future} classes. Need ${needToAttend} more.`;
    }
    
    $('attPercent').textContent = currentPct.toFixed(2) + '%';
    $('attStatus').textContent = status;
    $('attStatusBig').textContent = statusBig;
    $('attCount').textContent = `${attended}/${total}`;
    $('attMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    $('attInsight').textContent = insight;
    
    $('attBreakdown').innerHTML = `
        <div class="tax-row"><span>Total Classes</span><strong>${total}</strong></div>
        <div class="tax-row"><span>Classes Attended</span><strong>${attended}</strong></div>
        <div class="tax-row"><span>Classes Missed</span><strong style="color:#DC2626;">${missed}</strong></div>
        <div class="tax-row total"><span>Current Attendance</span><strong style="color:${color};">${currentPct.toFixed(2)}%</strong></div>
        <div class="tax-row"><span>Required (${required}%)</span><strong>${requiredAttendance} classes</strong></div>
        ${shortBy > 0 ? `<div class="tax-row"><span>Short By</span><strong style="color:#DC2626;">${shortBy} classes</strong></div>` : ''}
        ${future > 0 ? `
            <div class="tax-row"><span>Future Classes</span><strong>${future}</strong></div>
            <div class="tax-row"><span>Must Attend</span><strong style="color:#DC2626;">${needToAttend} of ${future}</strong></div>
            <div class="tax-row total"><span>Can Skip</span><strong style="color:#059669;">${canSkip} classes</strong></div>
        ` : ''}
    `;
}

function resetAttendance() {
    attTotal.value = 100;
    attAttended.value = 75;
    attRequired.value = 75;
    attFuture.value = 50;
    calculateAttendance();
    showToast('🔄 Reset!');
}

function copyAtt() {
    const txt = `📋 Attendance\n\nCurrent: ${$('attPercent').textContent}\nAttended: ${$('attCount').textContent}\nStatus: ${$('attStatusBig').textContent}\n\nhttps://calculator.aitoolcor.com/pages/education/attendance-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareAtt() {
    shareContent('Attendance', `My attendance: ${$('attPercent').textContent}`, location.href);
}

[attTotal, attAttended, attRequired, attFuture].forEach(el => el.addEventListener('input', calculateAttendance));

document.addEventListener('DOMContentLoaded', () => {
    calculateAttendance();
    renderRelatedTools('attendance-calculator', 'education', 6);
    console.log('✅ Attendance Calculator Loaded');
});
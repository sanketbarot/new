'use strict';

const $ = id => document.getElementById(id);
const lastPeriod = $('lastPeriod');
const ovCycleLength = $('ovCycleLength');
const ovPeriodLength = $('ovPeriodLength');
const ovCycleLengthRange = $('ovCycleLengthRange');

function calculateOvulation() {
    const last = new Date(lastPeriod.value);
    const cycle = parseInt(ovCycleLength.value) || 28;
    const period = parseInt(ovPeriodLength.value) || 5;
    
    if (!lastPeriod.value || isNaN(last.getTime())) {
        showToast('⚠️ Enter valid period date');
        return;
    }
    
    // Ovulation occurs 14 days before next period
    const ovulationDay = cycle - 14;
    
    // Ovulation date
    const ovDate = new Date(last);
    ovDate.setDate(last.getDate() + ovulationDay);
    
    // Fertile window (5 days before + day of ovulation)
    const fertileStart = new Date(ovDate);
    fertileStart.setDate(ovDate.getDate() - 5);
    
    // Next period
    const nextPeriod = new Date(last);
    nextPeriod.setDate(last.getDate() + cycle);
    
    // Format
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const fmtDate = (d) => `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const fmtShort = (d) => `${months[d.getMonth()]} ${d.getDate()}`;
    
    $('ovDate').textContent = `Day ${ovulationDay}`;
    $('ovDateFull').textContent = `${days[ovDate.getDay()]}, ${fmtDate(ovDate)}`;
    $('ovFertile').textContent = `${fmtShort(fertileStart)}-${fmtShort(ovDate)}`;
    $('ovNextPeriod').textContent = fmtShort(nextPeriod);
    
    // Timeline
    const periodEnd = new Date(last);
    periodEnd.setDate(last.getDate() + period - 1);
    
    const fertileEnd = new Date(ovDate);
    fertileEnd.setDate(ovDate.getDate() + 1);
    
    $('ovTimeline').innerHTML = `
        <div class="tax-row"><span>🩸 Period (Day 1-${period})</span><strong>${fmtShort(last)} - ${fmtShort(periodEnd)}</strong></div>
        <div class="tax-row"><span>🌱 Follicular Phase</span><strong>Day 1-13</strong></div>
        <div class="tax-row" style="background:rgba(236,72,153,0.1);padding:8px;border-radius:8px;">
            <span>💖 Fertile Window</span>
            <strong style="color:#EC4899;">${fmtShort(fertileStart)} - ${fmtShort(ovDate)}</strong>
        </div>
        <div class="tax-row total" style="background:rgba(236,72,153,0.2);">
            <span>🥚 Ovulation Day</span>
            <strong style="color:#DC2626;">${fmtDate(ovDate)}</strong>
        </div>
        <div class="tax-row"><span>🌙 Luteal Phase</span><strong>Day ${ovulationDay + 1}-${cycle}</strong></div>
        <div class="tax-row"><span>🩸 Next Period Expected</span><strong>${fmtDate(nextPeriod)}</strong></div>
    `;
    
    // Insight
    const today = new Date();
    const daysToOvulation = Math.floor((ovDate - today) / (1000 * 60 * 60 * 24));
    
    let insight = '';
    if (daysToOvulation === 0) {
        insight = `🎯 TODAY is your ovulation day! Best chance of conception. Have intercourse today!`;
    } else if (daysToOvulation > 0 && daysToOvulation <= 5) {
        insight = `💖 You're in fertile window! ${daysToOvulation} day${daysToOvulation !== 1 ? 's' : ''} until ovulation. Plan intercourse every 1-2 days.`;
    } else if (daysToOvulation < 0 && daysToOvulation >= -1) {
        insight = `🌸 Just past ovulation. Conception still possible! Wait 2 weeks to test.`;
    } else if (daysToOvulation > 5) {
        insight = `📅 Fertile window starts in ${daysToOvulation - 5} days. Track signs: cervical mucus, basal body temperature.`;
    } else {
        insight = `🌙 Luteal phase. Next fertile window in ${Math.floor((nextPeriod - today) / (1000*60*60*24)) + 9} days approx.`;
    }
    $('ovInsight').textContent = insight;
}

function setupSync() {
    ovCycleLengthRange.addEventListener('input', () => { ovCycleLength.value = ovCycleLengthRange.value; calculateOvulation(); });
    ovCycleLength.addEventListener('input', () => { ovCycleLengthRange.value = ovCycleLength.value; calculateOvulation(); });
    lastPeriod.addEventListener('change', calculateOvulation);
    ovPeriodLength.addEventListener('input', calculateOvulation);
}

function resetOvulation() {
    const today = new Date();
    const lp = new Date(today);
    lp.setDate(today.getDate() - 7);
    lastPeriod.value = lp.toISOString().split('T')[0];
    ovCycleLength.value = 28; ovCycleLengthRange.value = 28;
    ovPeriodLength.value = 5;
    calculateOvulation();
    showToast('🔄 Reset!');
}

function copyOv() {
    const txt = `🌸 Ovulation Calculator\n\nLast Period: ${lastPeriod.value}\nCycle: ${ovCycleLength.value} days\n\nOvulation: ${$('ovDateFull').textContent}\nFertile Window: ${$('ovFertile').textContent}\nNext Period: ${$('ovNextPeriod').textContent}\n\nhttps://calculator.aitoolcor.com/pages/health/ovulation-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareOv() {
    shareContent('Ovulation Calculator', `My fertile window: ${$('ovFertile').textContent}`, location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const lp = new Date(today);
    lp.setDate(today.getDate() - 7);
    lastPeriod.value = lp.toISOString().split('T')[0];
    lastPeriod.max = today.toISOString().split('T')[0];
    setupSync();
    calculateOvulation();
    renderRelatedTools('ovulation-calculator', 'health', 6);
    console.log('✅ Ovulation Calculator Loaded');
});
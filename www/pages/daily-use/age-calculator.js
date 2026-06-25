// ================================================
// Age Calculator - Logic
// ================================================

'use strict';

const $ = id => document.getElementById(id);
const dob = $('dob');
const ageAt = $('ageAt');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZODIACS = [
    { sign: '♑ Capricorn', s: [12,22], e: [1,19] },
    { sign: '♒ Aquarius',  s: [1,20],  e: [2,18] },
    { sign: '♓ Pisces',    s: [2,19],  e: [3,20] },
    { sign: '♈ Aries',     s: [3,21],  e: [4,19] },
    { sign: '♉ Taurus',    s: [4,20],  e: [5,20] },
    { sign: '♊ Gemini',    s: [5,21],  e: [6,20] },
    { sign: '♋ Cancer',    s: [6,21],  e: [7,22] },
    { sign: '♌ Leo',       s: [7,23],  e: [8,22] },
    { sign: '♍ Virgo',     s: [8,23],  e: [9,22] },
    { sign: '♎ Libra',     s: [9,23],  e: [10,22] },
    { sign: '♏ Scorpio',   s: [10,23], e: [11,21] },
    { sign: '♐ Sagittarius', s: [11,22], e: [12,21] }
];

const STONES = ['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Opal','Topaz','Turquoise'];

// ===== Get Zodiac =====
function getZodiac(month, day) {
    for (const z of ZODIACS) {
        if (z.sign === '♑ Capricorn') {
            if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return z.sign;
        } else if ((month === z.s[0] && day >= z.s[1]) || (month === z.e[0] && day <= z.e[1])) {
            return z.sign;
        }
    }
    return '♈ Aries';
}

// ===== Format Number =====
function fmtNum(num) {
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return num.toLocaleString();
    return num.toString();
}

// ===== Calculate Age =====
function calculateAge() {
    if (!dob.value) {
        showToast('⚠️ Please enter your date of birth!');
        return;
    }
    
    const birthDate = new Date(dob.value);
    const targetDate = ageAt.value ? new Date(ageAt.value) : new Date();
    
    if (birthDate > targetDate) {
        showToast('⚠️ Date of birth cannot be in the future!');
        return;
    }

    // Calculate years, months, days
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        const prev = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += prev.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate totals
    const diffMs = targetDate - birthDate;
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(diffMs / 60000);
    const totalHours = Math.floor(diffMs / 3600000);
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next birthday
    let nextBday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < targetDate) nextBday.setFullYear(targetDate.getFullYear() + 1);
    const daysToBday = Math.ceil((nextBday - targetDate) / 86400000);

    // Zodiac & Stone
    const zodiac = getZodiac(birthDate.getMonth() + 1, birthDate.getDate());
    const stone = STONES[birthDate.getMonth()] || 'Diamond';

    // Update UI
    $('mainAge').textContent = `${years} Year${years !== 1 ? 's' : ''}`;
    $('ageSub').textContent = `${months} month${months !== 1 ? 's' : ''} & ${days} day${days !== 1 ? 's' : ''} old`;
    $('years').textContent = years;
    $('months').textContent = months;
    $('days').textContent = days;
    $('nextBdayDays').textContent = daysToBday === 0 ? '🎉 Today!' : `In ${daysToBday} day${daysToBday !== 1 ? 's' : ''}`;
    $('totalMonths').textContent = totalMonths.toLocaleString();
    $('totalWeeks').textContent = totalWeeks.toLocaleString();
    $('totalDays').textContent = totalDays.toLocaleString();
    $('totalHours').textContent = fmtNum(totalHours);
    $('totalMinutes').textContent = fmtNum(totalMinutes);
    $('totalSeconds').textContent = fmtNum(totalSeconds);
    $('birthDay').textContent = DAYS[birthDate.getDay()];
    $('zodiacSign').textContent = zodiac;
    $('birthstone').textContent = stone;
    $('nextBdayDay').textContent = DAYS[nextBday.getDay()];

    // Age Insight
    let insight = '';
    if (years < 1) insight = '👶 Newborn! Every day is precious.';
    else if (years < 13) insight = '🧒 Childhood years — full of learning and growth.';
    else if (years < 20) insight = '🎓 Teen years — exciting time of self-discovery.';
    else if (years < 30) insight = '🎯 Twenties — prime time to build career and goals.';
    else if (years < 40) insight = '💼 Thirties — peak productivity and life building.';
    else if (years < 50) insight = '🎖️ Forties — wisdom meets experience.';
    else if (years < 60) insight = '🌟 Fifties — golden years of life mastery.';
    else if (years < 70) insight = '🏆 Sixties — time for legacy and reflection.';
    else if (years < 100) insight = '👑 Senior years — valuable wisdom and grace.';
    else insight = '🎂 Centenarian! Remarkable life journey.';
    
    if (daysToBday <= 7) insight += ' 🎉 Birthday coming soon!';
    $('insightText').textContent = insight;

    // Update URL
    try {
        const p = new URLSearchParams({ dob: dob.value, at: ageAt.value });
        history.replaceState(null, '', '?' + p.toString());
    } catch (e) {}
}

// ===== Restore from URL =====
function restoreFromURL() {
    try {
        const p = new URLSearchParams(location.search);
        if (p.has('dob')) dob.value = p.get('dob');
        if (p.has('at')) ageAt.value = p.get('at');
    } catch (e) {}
}

// ===== Quick Actions =====
function setToday() {
    ageAt.value = new Date().toISOString().split('T')[0];
    calculateAge();
}

function setNextBday() {
    if (!dob.value) {
        showToast('⚠️ Please enter date of birth first!');
        return;
    }
    const birthDate = new Date(dob.value);
    const today = new Date();
    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    ageAt.value = nextBday.toISOString().split('T')[0];
    calculateAge();
}

// ===== Reset =====
function resetCalculator() {
    const today = new Date();
    const defaultDob = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate() - 105);
    dob.value = defaultDob.toISOString().split('T')[0];
    ageAt.value = today.toISOString().split('T')[0];
    calculateAge();
    showToast('🔄 Calculator reset!');
}

// ===== Copy Result =====
function copyResult() {
    const text = `🎂 Age Result\n\n📅 Age: ${$('mainAge').textContent} ${$('ageSub').textContent}\n📊 Total Days: ${$('totalDays').textContent}\n🌟 Zodiac: ${$('zodiacSign').textContent}\n📆 Born on: ${$('birthDay').textContent}\n🎁 Next Birthday: ${$('nextBdayDays').textContent}\n\nhttps://calculator.aitoolcor.com/pages/daily-use/age-calculator.html`;
    copyToClipboard(text, '✅ Copied to clipboard!');
}

// ===== Share Result =====
function shareResult() {
    const txt = `I am ${$('mainAge').textContent} old and my zodiac is ${$('zodiacSign').textContent}! Calculate your age at AI ToolCor!`;
    shareContent('My Age Result - AI ToolCor', txt, location.href);
}

// ===== Event Listeners =====
dob.addEventListener('change', calculateAge);
ageAt.addEventListener('change', calculateAge);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const defaultDob = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate() - 105);
    
    dob.value = defaultDob.toISOString().split('T')[0];
    dob.max = today.toISOString().split('T')[0];
    ageAt.value = today.toISOString().split('T')[0];
    
    restoreFromURL();
    calculateAge();
    
    // Render related tools
    renderRelatedTools('age-calculator', 'daily-use', 6);
});
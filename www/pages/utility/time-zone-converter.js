'use strict';

const $ = id => document.getElementById(id);

const TIMEZONES = [
    { tz: 'Asia/Kolkata', city: 'India (Mumbai/Delhi)', offset: '+5:30' },
    { tz: 'America/New_York', city: 'New York (EST/EDT)', offset: '-5:00' },
    { tz: 'America/Los_Angeles', city: 'Los Angeles (PST/PDT)', offset: '-8:00' },
    { tz: 'America/Chicago', city: 'Chicago (CST/CDT)', offset: '-6:00' },
    { tz: 'Europe/London', city: 'London (GMT/BST)', offset: '0:00' },
    { tz: 'Europe/Paris', city: 'Paris (CET/CEST)', offset: '+1:00' },
    { tz: 'Europe/Berlin', city: 'Berlin', offset: '+1:00' },
    { tz: 'Asia/Tokyo', city: 'Tokyo (JST)', offset: '+9:00' },
    { tz: 'Asia/Shanghai', city: 'Shanghai/Beijing', offset: '+8:00' },
    { tz: 'Asia/Singapore', city: 'Singapore', offset: '+8:00' },
    { tz: 'Asia/Dubai', city: 'Dubai (GST)', offset: '+4:00' },
    { tz: 'Australia/Sydney', city: 'Sydney (AEST/AEDT)', offset: '+10:00' },
    { tz: 'Australia/Melbourne', city: 'Melbourne', offset: '+10:00' },
    { tz: 'Pacific/Auckland', city: 'Auckland (NZST)', offset: '+12:00' },
    { tz: 'America/Toronto', city: 'Toronto', offset: '-5:00' },
    { tz: 'America/Sao_Paulo', city: 'São Paulo', offset: '-3:00' },
    { tz: 'Asia/Hong_Kong', city: 'Hong Kong', offset: '+8:00' },
    { tz: 'Asia/Karachi', city: 'Karachi (PKT)', offset: '+5:00' },
    { tz: 'Asia/Dhaka', city: 'Dhaka', offset: '+6:00' },
    { tz: 'Europe/Moscow', city: 'Moscow (MSK)', offset: '+3:00' },
    { tz: 'Africa/Cairo', city: 'Cairo', offset: '+2:00' },
    { tz: 'Africa/Johannesburg', city: 'Johannesburg', offset: '+2:00' },
    { tz: 'UTC', city: 'UTC', offset: '0:00' }
];

function populateTZ() {
    const fromSel = $('tzFrom');
    const toSel = $('tzTo');
    
    TIMEZONES.forEach(t => {
        const opt1 = document.createElement('option');
        opt1.value = t.tz;
        opt1.textContent = `${t.city} (UTC${t.offset})`;
        fromSel.appendChild(opt1);
        
        const opt2 = document.createElement('option');
        opt2.value = t.tz;
        opt2.textContent = `${t.city} (UTC${t.offset})`;
        toSel.appendChild(opt2);
    });
    
    fromSel.value = 'Asia/Kolkata';
    toSel.value = 'America/New_York';
}

function convertTimeZone() {
    const date = $('tzDate').value;
    const time = $('tzTime').value;
    const fromTZ = $('tzFrom').value;
    const toTZ = $('tzTo').value;
    
    if (!date || !time) return;
    
    // Create date in source timezone
    const dateStr = `${date}T${time}`;
    const sourceDate = new Date(dateStr);
    
    // Format for source
    const sourceFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: fromTZ,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Format for destination
    const destFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: toTZ,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Get just time in dest
    const destTime = sourceDate.toLocaleString('en-US', {
        timeZone: toTZ,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const destDate = sourceDate.toLocaleString('en-US', {
        timeZone: toTZ,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const fromCity = TIMEZONES.find(t => t.tz === fromTZ)?.city || fromTZ;
    const toCity = TIMEZONES.find(t => t.tz === toTZ)?.city || toTZ;
    
    $('tzResultLabel').textContent = `Time in ${toCity}`;
    $('tzResult').textContent = destTime;
    $('tzResultSub').textContent = destDate;
    
    // World clock
    const popularTZ = ['Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Asia/Dubai', 'Australia/Sydney', 'UTC'];
    let html = '';
    popularTZ.forEach(tz => {
        if (tz !== toTZ) {
            const t = sourceDate.toLocaleString('en-US', {
                timeZone: tz,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                weekday: 'short'
            });
            const city = TIMEZONES.find(z => z.tz === tz)?.city || tz;
            html += `<div class="tax-row"><span>${city}</span><strong>${t}</strong></div>`;
        }
    });
    $('tzWorldClock').innerHTML = html;
    
    $('tzInsight').textContent = `🌍 ${time} in ${fromCity} = ${destTime} in ${toCity}`;
}

function resetTZ() {
    const today = new Date();
    $('tzDate').value = today.toISOString().split('T')[0];
    $('tzTime').value = '12:00';
    $('tzFrom').value = 'Asia/Kolkata';
    $('tzTo').value = 'America/New_York';
    convertTimeZone();
    showToast('🔄 Reset!');
}

function copyTZ() {
    const txt = `🌍 Time Zone Converter\n\n${$('tzResultLabel').textContent}\nTime: ${$('tzResult').textContent}\nDate: ${$('tzResultSub').textContent}\n\nhttps://calculator.aitoolcor.com/pages/utility/time-zone-converter.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareTZ() {
    shareContent('Time Zone Converter', `${$('tzResultLabel').textContent}: ${$('tzResult').textContent}`, location.href);
}

['tzDate', 'tzTime', 'tzFrom', 'tzTo'].forEach(id => {
    $(id).addEventListener('change', convertTimeZone);
    $(id).addEventListener('input', convertTimeZone);
});

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    $('tzDate').value = today.toISOString().split('T')[0];
    populateTZ();
    convertTimeZone();
    renderRelatedTools('time-zone-converter', 'utility', 6);
    console.log('✅ Time Zone Converter Loaded');
});
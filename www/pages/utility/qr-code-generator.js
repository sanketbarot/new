'use strict';

const $ = id => document.getElementById(id);
let currentQRData = '';

function changeQrType() {
    const type = $('qrType').value;
    ['qrUrlInputs', 'qrTextInputs', 'qrEmailInputs', 'qrPhoneInputs', 'qrSmsInputs', 'qrWifiInputs']
        .forEach(id => $(id).style.display = 'none');
    
    if (type === 'url') $('qrUrlInputs').style.display = 'block';
    else if (type === 'text') $('qrTextInputs').style.display = 'block';
    else if (type === 'email') $('qrEmailInputs').style.display = 'block';
    else if (type === 'phone') $('qrPhoneInputs').style.display = 'block';
    else if (type === 'sms') $('qrSmsInputs').style.display = 'block';
    else if (type === 'wifi') $('qrWifiInputs').style.display = 'block';
    
    generateQR();
}

function buildQRData() {
    const type = $('qrType').value;
    
    if (type === 'url') {
        return $('qrUrl').value || 'https://calculator.aitoolcor.com';
    } else if (type === 'text') {
        return $('qrText').value || 'Hello';
    } else if (type === 'email') {
        const email = $('qrEmail').value || 'hello@example.com';
        const subject = encodeURIComponent($('qrEmailSubject').value);
        const body = encodeURIComponent($('qrEmailBody').value);
        let data = `mailto:${email}`;
        if (subject || body) data += `?subject=${subject}&body=${body}`;
        return data;
    } else if (type === 'phone') {
        return `tel:${$('qrPhone').value || '+919876543210'}`;
    } else if (type === 'sms') {
        const num = $('qrSmsNumber').value || '+919876543210';
        const msg = encodeURIComponent($('qrSmsBody').value);
        return `sms:${num}${msg ? '?body=' + msg : ''}`;
    } else if (type === 'wifi') {
        const ssid = $('qrWifiName').value || 'WiFi';
        const pass = $('qrWifiPass').value || '';
        const enc = $('qrWifiType').value || 'WPA';
        return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    return '';
}

function generateQR() {
    const data = buildQRData();
    if (!data) {
        showToast('⚠️ Enter QR data');
        return;
    }
    
    currentQRData = data;
    const size = parseInt($('qrSize').value);
    
    // Using QR Server API (free, no key needed)
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&margin=10`;
    
    $('qrImage').src = url;
    $('qrImage').style.maxWidth = size + 'px';
    
    $('qrInfo').innerHTML = `
        <div class="tax-row"><span>Type</span><strong>${$('qrType').options[$('qrType').selectedIndex].text}</strong></div>
        <div class="tax-row"><span>Size</span><strong>${size}×${size}px</strong></div>
        <div class="tax-row"><span>Data Length</span><strong>${data.length} characters</strong></div>
        <div class="tax-row total"><span>Content</span><strong style="word-break:break-all;font-size:11px;">${data.length > 60 ? data.substring(0, 60) + '...' : data}</strong></div>
    `;
    
    $('qrInsight').textContent = `📱 ${$('qrType').options[$('qrType').selectedIndex].text} QR ready! Scan with phone camera.`;
}

function downloadQR() {
    const link = document.createElement('a');
    link.href = $('qrImage').src;
    link.download = 'qrcode.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Download started!');
}

function copyQRLink() {
    copyToClipboard($('qrImage').src, '✅ Link copied!');
}

function shareQR() {
    if (navigator.share) {
        navigator.share({
            title: 'QR Code',
            text: 'Check out this QR code!',
            url: $('qrImage').src
        });
    } else {
        copyQRLink();
    }
}

function resetQR() {
    $('qrType').value = 'url';
    $('qrUrl').value = 'https://calculator.aitoolcor.com';
    $('qrText').value = 'Hello, World!';
    $('qrEmail').value = 'hello@example.com';
    $('qrPhone').value = '+919876543210';
    $('qrSize').value = 300;
    $('qrSizeDisp').textContent = '300';
    changeQrType();
    showToast('🔄 Reset!');
}

$('qrSize').addEventListener('input', () => {
    $('qrSizeDisp').textContent = $('qrSize').value;
    generateQR();
});

['qrUrl', 'qrText', 'qrEmail', 'qrEmailSubject', 'qrEmailBody', 'qrPhone', 
 'qrSmsNumber', 'qrSmsBody', 'qrWifiName', 'qrWifiPass', 'qrWifiType'].forEach(id => {
    if ($(id)) $(id).addEventListener('input', generateQR);
});

document.addEventListener('DOMContentLoaded', () => {
    generateQR();
    renderRelatedTools('qr-code-generator', 'utility', 6);
    console.log('✅ QR Code Generator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);
const gstAmount = $('gstAmount');
const gstRate = $('gstRate');
let gstType = 'exclusive'; // exclusive = add GST, inclusive = remove GST

function fmtINR(amt) {
    return '₹' + Math.round(amt * 100) / 100 .toLocaleString('en-IN');
}

function fmtINR2(amt) {
    return '₹' + (Math.round(amt * 100) / 100).toLocaleString('en-IN');
}

function setGSTType(type, event) {
    gstType = type;
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    $('gstTypeHint').textContent = type === 'exclusive' ? 'Add GST to base amount' : 'Remove GST from total amount';
    calculateGST();
}

function setGSTRate(rate) {
    gstRate.value = rate;
    document.querySelectorAll('.gst-rate-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        if (parseFloat(b.textContent) === rate) b.classList.add('active');
    });
    calculateGST();
}

function calculateGST() {
    const amount = parseFloat(gstAmount.value) || 0;
    const rate = parseFloat(gstRate.value) || 0;
    
    if (amount <= 0) {
        showToast('⚠️ Enter valid amount');
        return;
    }
    
    let base, gstAmt, total;
    
    if (gstType === 'exclusive') {
        // Add GST
        base = amount;
        gstAmt = (amount * rate) / 100;
        total = base + gstAmt;
    } else {
        // Remove GST
        total = amount;
        base = amount / (1 + rate / 100);
        gstAmt = total - base;
    }
    
    const cgst = gstAmt / 2;
    const sgst = gstAmt / 2;
    const igst = gstAmt;
    
    $('gstTotal').textContent = fmtINR2(total);
    $('gstBase').textContent = fmtINR2(base);
    $('gstAmt').textContent = fmtINR2(gstAmt);
    $('gstTotalSub').textContent = gstType === 'exclusive' ? `Including GST @ ${rate}%` : `Original amount before GST`;
    
    $('cgstAmt').textContent = fmtINR2(cgst);
    $('sgstAmt').textContent = fmtINR2(sgst);
    $('igstAmt').textContent = fmtINR2(igst);
    
    $('cgstPct').textContent = (rate / 2) + '%';
    $('sgstPct').textContent = (rate / 2) + '%';
    $('igstPct').textContent = rate + '%';
    
    $('gstInsight').textContent = `GST of ${fmtINR2(gstAmt)} (${rate}%) on ${fmtINR2(base)}. Intrastate: CGST ${fmtINR2(cgst)} + SGST ${fmtINR2(sgst)}. Interstate: IGST ${fmtINR2(igst)}.`;
}

function resetGST() {
    gstAmount.value = 1000;
    gstRate.value = 18;
    gstType = 'exclusive';
    document.querySelectorAll('.gst-btn').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });
    document.querySelectorAll('.gst-rate-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.trim() === '18%');
    });
    calculateGST();
    showToast('🔄 Reset!');
}

function copyGST() {
    const txt = `📊 GST Calculator\n\nBase: ${$('gstBase').textContent}\nGST (${gstRate.value}%): ${$('gstAmt').textContent}\nTotal: ${$('gstTotal').textContent}\n\nCGST: ${$('cgstAmt').textContent}\nSGST: ${$('sgstAmt').textContent}\nIGST: ${$('igstAmt').textContent}\n\nhttps://calculator.aitoolcor.com/pages/finance/gst-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareGST() {
    shareContent('GST Calculator - AI ToolCor', 
        `GST on ${$('gstBase').textContent} at ${gstRate.value}% = ${$('gstAmt').textContent}`,
        location.href);
}

gstAmount.addEventListener('input', calculateGST);
gstRate.addEventListener('input', calculateGST);

document.addEventListener('DOMContentLoaded', () => {
    calculateGST();
    renderRelatedTools('gst-calculator', 'finance', 6);
    console.log('✅ GST Calculator Loaded');
});
'use strict';

const $ = id => document.getElementById(id);

function calculateExamScore() {
    const current = parseFloat($('esCurrent').value) || 0;
    const currentWeight = parseFloat($('esCurrentWeight').value) || 0;
    const target = parseFloat($('esTarget').value) || 0;
    const finalWeight = parseFloat($('esFinalWeight').value) || 0;
    
    if (finalWeight <= 0) {
        showToast('⚠️ Final weight must be > 0');
        return;
    }
    
    // Required = (Target - Current * CurrentWeight/100) / (FinalWeight/100)
    const currentContribution = (current * currentWeight) / 100;
    const requiredContribution = target - currentContribution;
    const required = (requiredContribution / finalWeight) * 100;
    
    let color, status, insight;
    if (required > 100) {
        color = '#DC2626';
        status = 'Impossible - Adjust target';
        insight = `🚨 Need ${required.toFixed(1)}% which is impossible! Lower your target or your current performance can't reach ${target}%.`;
    } else if (required > 90) {
        color = '#F97316';
        status = 'Very hard - Need perfection';
        insight = `⚠️ You need ${required.toFixed(1)}% on final - extremely challenging! Study intensively.`;
    } else if (required > 75) {
        color = '#F59E0B';
        status = 'Challenging - Work hard';
        insight = `📚 Need ${required.toFixed(1)}% on final. Achievable with serious effort.`;
    } else if (required > 50) {
        color = '#3B82F6';
        status = 'Moderate - Achievable';
        insight = `👍 Only ${required.toFixed(1)}% needed on final. Well within reach!`;
    } else if (required > 0) {
        color = '#10B981';
        status = 'Easy - Already close';
        insight = `🎉 Just ${required.toFixed(1)}% on final! You're already in great shape.`;
    } else {
        color = '#059669';
        status = 'Already achieved!';
        insight = `🏆 You already exceeded target! Even 0% on final still meets ${target}%.`;
    }
    
    $('esRequired').textContent = Math.max(0, required).toFixed(2) + '%';
    $('esStatus').textContent = status;
    $('esCurrentDisp').textContent = current + '%';
    $('esTargetDisp').textContent = target + '%';
    $('esMainDisplay').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    $('esInsight').textContent = insight;
    
    // What if scenarios
    const scenarios = [50, 70, 80, 90, 100];
    let scenariosHTML = '';
    scenarios.forEach(s => {
        const finalGrade = (currentContribution + (s * finalWeight / 100)).toFixed(2);
        const meets = finalGrade >= target ? '✅' : '❌';
        scenariosHTML += `<div class="tax-row"><span>${s}% on final</span><strong>= ${finalGrade}% ${meets}</strong></div>`;
    });
    
    $('esBreakdown').innerHTML = `
        <div class="tax-row"><span>Current Score</span><strong>${current}%</strong></div>
        <div class="tax-row"><span>Current Weight</span><strong>${currentWeight}%</strong></div>
        <div class="tax-row"><span>Current Contribution</span><strong>${currentContribution.toFixed(2)}%</strong></div>
        <div class="tax-row"><span>Target Grade</span><strong>${target}%</strong></div>
        <div class="tax-row"><span>Final Exam Weight</span><strong>${finalWeight}%</strong></div>
        <div class="tax-row total"><span>Required on Final</span><strong style="color:${color};">${Math.max(0, required).toFixed(2)}%</strong></div>
        <div class="tax-row" style="background:var(--bg-soft);font-weight:700;padding:8px;border-radius:8px;margin-top:8px;"><span>What-If Scenarios:</span></div>
        ${scenariosHTML}
    `;
}

function resetExamScore() {
    $('esCurrent').value = 75;
    $('esCurrentWeight').value = 60;
    $('esTarget').value = 85;
    $('esFinalWeight').value = 40;
    calculateExamScore();
    showToast('🔄 Reset!');
}

function copyES() {
    const txt = `📝 Exam Score\n\nCurrent: ${$('esCurrentDisp').textContent}\nTarget: ${$('esTargetDisp').textContent}\nRequired on Final: ${$('esRequired').textContent}\n\nhttps://calculator.aitoolcor.com/pages/education/exam-score-calculator.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareES() {
    shareContent('Exam Score', `I need ${$('esRequired').textContent} on final`, location.href);
}

['esCurrent', 'esCurrentWeight', 'esTarget', 'esFinalWeight'].forEach(id => 
    $(id).addEventListener('input', calculateExamScore)
);

document.addEventListener('DOMContentLoaded', () => {
    calculateExamScore();
    renderRelatedTools('exam-score-calculator', 'education', 6);
    console.log('✅ Exam Score Calculator Loaded');
});
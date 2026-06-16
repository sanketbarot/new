'use strict';

const $ = id => document.getElementById(id);

function solveQuadratic() {
    const a = parseFloat($('qea').value) || 0;
    const b = parseFloat($('qeb').value) || 0;
    const c = parseFloat($('qec').value) || 0;
    
    if (a === 0) {
        showToast('⚠️ Coefficient a cannot be 0');
        return;
    }
    
    const discriminant = b * b - 4 * a * c;
    const sqrtD = Math.sqrt(Math.abs(discriminant));
    
    // Format equation
    const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
    const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    const aStr = a === 1 ? '' : a === -1 ? '-' : a;
    const equation = `${aStr}x² ${bStr} ${cStr} = 0`;
    
    $('qeEquation').textContent = equation;
    
    let root1, root2, rootsText, insight;
    
    if (discriminant > 0) {
        root1 = (-b + sqrtD) / (2 * a);
        root2 = (-b - sqrtD) / (2 * a);
        rootsText = `Roots: x₁ = ${root1.toFixed(4).replace(/\.?0+$/, '')}, x₂ = ${root2.toFixed(4).replace(/\.?0+$/, '')}`;
        insight = `📐 Two distinct real roots. Discriminant = ${discriminant} > 0`;
        $('qeRoot1').textContent = root1.toFixed(4).replace(/\.?0+$/, '');
        $('qeRoot2').textContent = root2.toFixed(4).replace(/\.?0+$/, '');
    } else if (discriminant === 0) {
        root1 = -b / (2 * a);
        rootsText = `One repeated root: x = ${root1.toFixed(4).replace(/\.?0+$/, '')}`;
        insight = `📐 One real root (repeated). Discriminant = 0`;
        $('qeRoot1').textContent = root1.toFixed(4).replace(/\.?0+$/, '');
        $('qeRoot2').textContent = root1.toFixed(4).replace(/\.?0+$/, '');
    } else {
        const realPart = (-b / (2 * a)).toFixed(4).replace(/\.?0+$/, '');
        const imagPart = (sqrtD / (2 * a)).toFixed(4).replace(/\.?0+$/, '');
        rootsText = `Complex roots: x = ${realPart} ± ${imagPart}i`;
        insight = `📐 Two complex roots. Discriminant = ${discriminant} < 0 (no real solutions)`;
        $('qeRoot1').textContent = `${realPart} + ${imagPart}i`;
        $('qeRoot2').textContent = `${realPart} - ${imagPart}i`;
    }
    
    $('qeRoots').textContent = rootsText;
    
    // Vertex
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    
    $('qeSteps').innerHTML = `
        <div class="tax-row"><span>Equation</span><strong>${equation}</strong></div>
        <div class="tax-row"><span>a, b, c</span><strong>${a}, ${b}, ${c}</strong></div>
        <div class="tax-row"><span>Formula</span><strong style="font-size:11px;">x = (-b ± √(b² - 4ac)) / 2a</strong></div>
        <div class="tax-row"><span>Discriminant (D)</span><strong>${b}² - 4(${a})(${c}) = ${discriminant}</strong></div>
        <div class="tax-row total"><span>Root 1</span><strong style="color:#059669;">${$('qeRoot1').textContent}</strong></div>
        <div class="tax-row total"><span>Root 2</span><strong style="color:#059669;">${$('qeRoot2').textContent}</strong></div>
        <div class="tax-row"><span>Vertex (h, k)</span><strong>(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})</strong></div>
        <div class="tax-row"><span>Axis of Symmetry</span><strong>x = ${vertexX.toFixed(2)}</strong></div>
        <div class="tax-row"><span>Parabola Opens</span><strong>${a > 0 ? '↑ Upward' : '↓ Downward'}</strong></div>
    `;
    
    $('qeInsight').textContent = insight;
}

function resetQuad() {
    $('qea').value = 1;
    $('qeb').value = -5;
    $('qec').value = 6;
    solveQuadratic();
    showToast('🔄 Reset!');
}

function copyQuad() {
    const txt = `📐 Quadratic Equation\n\nEquation: ${$('qeEquation').textContent}\n${$('qeRoots').textContent}\n\nhttps://calculator.aitoolcor.com/pages/math/quadratic-equation-solver.html`;
    copyToClipboard(txt, '✅ Copied!');
}

function shareQuad() {
    shareContent('Quadratic Solver', `${$('qeEquation').textContent} → ${$('qeRoots').textContent}`, location.href);
}

['qea', 'qeb', 'qec'].forEach(id => $(id).addEventListener('input', solveQuadratic));

document.addEventListener('DOMContentLoaded', () => {
    solveQuadratic();
    renderRelatedTools('quadratic-equation-solver', 'math', 6);
    console.log('✅ Quadratic Solver Loaded');
});
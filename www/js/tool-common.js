// ================================================
// AI ToolCor - Common Tool Functions
// ================================================

// ===== Sidebar Toggle =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== Scroll to Top =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Float Btn =====
window.addEventListener('scroll', function () {
    const btn = document.querySelector('.float-btn');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ===== Toast =====
function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    if (!toast || !messageEl) return;
    
    messageEl.textContent = msg;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), duration);
}

window.showToast = showToast;

// ===== Copy to Clipboard =====
function copyToClipboard(text, successMsg = 'Copied!') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(successMsg))
            .catch(() => showToast('Copy failed'));
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(successMsg);
        } catch {
            showToast('Copy failed');
        }
        document.body.removeChild(textarea);
    }
}

window.copyToClipboard = copyToClipboard;

// ===== Share =====
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
    } else {
        copyToClipboard(url, 'Link copied!');
    }
}

window.shareContent = shareContent;

// ===== FAQ Toggle =====
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('active');
    
    // Close all
    document.querySelectorAll('.faq-item.active').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    
    // Open clicked if was closed
    if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
    }
}

window.toggleFaq = toggleFaq;

// ===== Render Related Tools =====
function renderRelatedTools(currentSlug, category, count = 6) {
    const grid = document.getElementById('relatedGrid');
    if (!grid || typeof ALL_TOOLS === 'undefined') return;
    
    // Get tools from same category (excluding current)
    let related = ALL_TOOLS
        .filter(t => t.cat === category && t.slug !== currentSlug)
        .slice(0, count);
    
    // If not enough, add popular from other categories
    if (related.length < count) {
        const popular = ALL_TOOLS
            .filter(t => t.popular && t.slug !== currentSlug && !related.includes(t))
            .slice(0, count - related.length);
        related = [...related, ...popular];
    }
    
    grid.innerHTML = related.map(tool => `
        <a href="../${tool.cat}/${tool.slug}.html" class="tool-card">
            <div class="tool-card-icon ${tool.color}">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-card-name">${tool.name}</div>
            <div class="tool-card-desc">${tool.desc}</div>
            <div class="tool-card-footer">
                ${tool.popular ? '<span class="tool-badge popular">🔥 Popular</span>' : '<span></span>'}
                <div class="tool-card-arrow">
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        </a>
    `).join('');
}

window.renderRelatedTools = renderRelatedTools;

// ===== Keyboard =====
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
});

console.log('✅ Tool common loaded');
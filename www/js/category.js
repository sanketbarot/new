// ============================================
// AI ToolCor - Category Page JS
// ============================================

function createToolCard(tool, category) {
    const badgeHTML = tool.popular
        ? '<span class="tool-badge popular">🔥 Popular</span>'
        : tool.isNew
        ? '<span class="tool-badge new">✨ New</span>'
        : '<span></span>';

    return `
        <a 
            href="${tool.slug}.html"
            class="tool-card"
            title="${tool.name} - AI ToolCor Calculator"
            aria-label="Open ${tool.name}"
        >
            <div class="tool-card-icon ${tool.color}">
                <i class="${tool.icon}" aria-hidden="true"></i>
            </div>
            <div class="tool-card-name">${tool.name}</div>
            <div class="tool-card-desc">${tool.desc}</div>
            <div class="tool-card-footer">
                ${badgeHTML}
                <div class="tool-card-arrow">
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </div>
            </div>
        </a>
    `;
}

function renderGrid(tools) {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    grid.innerHTML = tools.map(t => createToolCard(t, PAGE_CATEGORY)).join('');
}

function handleSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
        renderGrid(PAGE_TOOLS);
        return;
    }
    const results = PAGE_TOOLS.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q)
    );
    if (results.length === 0) {
        document.getElementById('toolsGrid').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                <h3>No tools found</h3>
                <p>Try different keywords</p>
            </div>
        `;
    } else {
        renderGrid(results);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Float btn
window.addEventListener('scroll', function () {
    const btn = document.querySelector('.float-btn');
    if (btn) {
        btn.style.opacity = window.scrollY > 300 ? '1' : '0';
        btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
    }
}, { passive: true });

// Keyboard
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
});

function initCategoryPage() {
    renderGrid(PAGE_TOOLS);

    const btn = document.querySelector('.float-btn');
    if (btn) {
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 0.3s';
    }

    console.log(`✅ ${PAGE_CATEGORY} page loaded - ${PAGE_TOOLS.length} tools`);
}
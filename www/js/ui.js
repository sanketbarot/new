// ================================================
// AI ToolCor - Shared UI Functions
// ================================================

// === SIDEBAR ===
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

// === SCROLL ===
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === FLOAT BTN ===
function initFloatBtn() {
    const btn = document.querySelector('.float-btn');
    if (!btn) return;
    window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
}

// === TOAST ===
function showToast(msg, duration = 2500) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
    }, duration);
}

// === COPY ===
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('✅ Copied to clipboard!');
    } catch {
        showToast('❌ Copy failed. Try manually.');
    }
}

// === SHARE ===
function shareResult(title, text, url) {
    if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
    } else {
        copyToClipboard(url || window.location.href);
        showToast('🔗 Link copied!');
    }
}

// === FORMAT ===
function formatINR(n) {
    if (isNaN(n)) return '₹0';
    return '₹' + Math.round(n).toLocaleString('en-IN');
}

function formatNum(n, decimals = 2) {
    if (isNaN(n)) return '0';
    return parseFloat(n.toFixed(decimals)).toLocaleString('en-IN');
}

function formatPct(n, decimals = 2) {
    if (isNaN(n)) return '0%';
    return n.toFixed(decimals) + '%';
}

// === KEYBOARD ===
function initKeyboard(searchInputId) {
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const input = document.getElementById(searchInputId);
            if (input) input.focus();
        }
        if (e.key === 'Escape') {
            closeSidebar();
            const input = document.getElementById(searchInputId);
            if (input) { input.value = ''; input.blur(); }
        }
    });
}

// === ACTIVE NAV ===
function setActiveNav(category) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href') || '';
        if (category && href.includes(category)) {
            item.classList.add('active');
        }
    });
}

// === RANGE SYNC ===
function syncRangeToInput(rangeId, inputId) {
    const range = document.getElementById(rangeId);
    const input = document.getElementById(inputId);
    if (!range || !input) return;
    range.addEventListener('input', function () {
        input.value = this.value;
        input.dispatchEvent(new Event('input'));
    });
}

function syncInputToRange(inputId, rangeId) {
    const input = document.getElementById(inputId);
    const range = document.getElementById(rangeId);
    if (!input || !range) return;
    input.addEventListener('input', function () {
        const val = parseFloat(this.value);
        if (!isNaN(val)) {
            range.value = Math.min(Math.max(val, parseFloat(range.min)), parseFloat(range.max));
        }
    });
}

function linkRangeInput(inputId, rangeId) {
    syncRangeToInput(rangeId, inputId);
    syncInputToRange(inputId, rangeId);
}

// === SIDEBAR NAV BUILDER ===
function buildSidebarNav(activeCategory, basePath) {
    const navItems = [
        { cat:'finance',   icon:'fa-solid fa-coins',                label:'Finance Tools',   count:20 },
        { cat:'health',    icon:'fa-solid fa-heart-pulse',          label:'Health Tools',    count:10 },
        { cat:'business',  icon:'fa-solid fa-briefcase',            label:'Business Tools',  count:8  },
        { cat:'daily-use', icon:'fa-solid fa-wand-magic-sparkles',  label:'Daily Use',       count:10 },
        { cat:'education', icon:'fa-solid fa-graduation-cap',       label:'Education Tools', count:6  },
        { cat:'math',      icon:'fa-solid fa-square-root-variable', label:'Math Tools',      count:8  },
        { cat:'utility',   icon:'fa-solid fa-screwdriver-wrench',   label:'Utility Tools',   count:8  }
    ];

    return navItems.map(item => `
        <a href="${basePath}pages/${item.cat}/${item.cat === activeCategory ? '' : ''}"
           class="nav-item ${item.cat === activeCategory ? 'active' : ''}"
           aria-label="${item.label}">
            <i class="${item.icon}" aria-hidden="true"></i>
            <span>${item.label}</span>
            <span class="nav-count">${item.count}</span>
            <i class="fa-solid fa-chevron-right arrow" aria-hidden="true"></i>
        </a>
    `).join('');
}

// === INIT COMMON ===
function initCommon() {
    initFloatBtn();
    initKeyboard('searchInput');

    // Close sidebar on overlay click
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });

    console.log('✅ AI ToolCor Calculator Ready');
}
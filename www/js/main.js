// ================================================
// AI ToolCor Calculator - Homepage JS
// ================================================

'use strict';

// ===== Get Tools (with admin overrides) =====
function getActiveTools() {
    let tools = ALL_TOOLS;
    
    // Check if admin made changes (saved in localStorage)
    const savedTools = localStorage.getItem('aitoolcor_tools_data');
    if (savedTools) {
        try {
            tools = JSON.parse(savedTools);
            console.log('📦 Using admin-managed tools');
        } catch (e) {
            console.error('Failed to load saved tools, using defaults');
            tools = ALL_TOOLS;
        }
    }
    
    // ✅ Filter out inactive tools
    return tools.filter(t => t.active !== false);
}

// ===== Render Homepage =====
function renderHomepage() {
    console.log('🔄 Rendering homepage...');
    
    if (typeof ALL_TOOLS === 'undefined') {
        console.error('❌ tools-data.js not loaded!');
        return;
    }

    // Get active tools (filtered)
    const activeTools = getActiveTools();
    console.log(`✅ Active tools: ${activeTools.length}/${ALL_TOOLS.length}`);

    // Popular Tools (only active)
    const popularGrid = document.getElementById('popularToolsGrid');
    if (popularGrid) {
        const popular = activeTools.filter(t => t.popular);
        popularGrid.innerHTML = popular.map(toolCardHTML).join('');
        console.log(`✅ Popular: ${popular.length} tools`);
    }

    // Category Grids (only active)
    const catGrids = {
        'finance':   'financeGrid',
        'health':    'healthGrid',
        'business':  'businessGrid',
        'daily-use': 'dailyuseGrid',
        'education': 'educationGrid',
        'math':      'mathGrid',
        'utility':   'utilityGrid'
    };

    Object.entries(catGrids).forEach(([cat, gridId]) => {
        const el = document.getElementById(gridId);
        if (el) {
            const tools = activeTools.filter(t => t.cat === cat);
            el.innerHTML = tools.map(toolCardHTML).join('');
            console.log(`✅ ${cat}: ${tools.length} tools`);
            
            // Update count in nav if exists
            updateCategoryCount(cat, tools.length);
        }
    });
    
    // Update total stats in hero
    updateHeroStats(activeTools);
}

// ===== Update Category Count in Nav =====
function updateCategoryCount(cat, count) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('href') === '#' + cat) {
            const countEl = item.querySelector('.nav-count');
            if (countEl) countEl.textContent = count;
        }
    });
    
    // Update section tag counts
    const section = document.getElementById(cat);
    if (section) {
        const tag = section.querySelector('.tag');
        if (tag) tag.textContent = `${count} Tools`;
    }
}

// ===== Update Hero Stats =====
function updateHeroStats(activeTools) {
    const hsItems = document.querySelectorAll('.hs-value');
    if (hsItems.length >= 1 && hsItems[0]) {
        hsItems[0].textContent = activeTools.length + '+';
    }
}

// ===== Search Functionality =====
let searchTimer = null;

function handleSearch(val) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const q = val.trim();
        const searchSection = document.getElementById('searchResults');
        const mainSections  = document.getElementById('mainSections');
        const searchGrid    = document.getElementById('searchResultsGrid');
        const searchCount   = document.getElementById('searchCount');

        if (!q) {
            if (searchSection) searchSection.style.display = 'none';
            if (mainSections)  mainSections.style.display  = 'block';
            return;
        }

        // Search only active tools
        const activeTools = getActiveTools();
        const lowerQ = q.toLowerCase();
        const results = activeTools.filter(t =>
            t.name.toLowerCase().includes(lowerQ) ||
            t.desc.toLowerCase().includes(lowerQ) ||
            t.cat.toLowerCase().includes(lowerQ)
        );

        if (searchSection) searchSection.style.display = 'block';
        if (mainSections)  mainSections.style.display  = 'none';
        if (searchCount)   searchCount.textContent = `${results.length} tool${results.length !== 1 ? 's' : ''} found`;

        if (searchGrid) {
            if (results.length === 0) {
                searchGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <h3>No tools found</h3>
                        <p>Try different keywords like "EMI", "BMI", or "GST"</p>
                    </div>`;
            } else {
                searchGrid.innerHTML = results.map(toolCardHTML).join('');
            }
        }
    }, 250);
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const searchSection = document.getElementById('searchResults');
    const mainSections  = document.getElementById('mainSections');
    if (searchSection) searchSection.style.display = 'none';
    if (mainSections)  mainSections.style.display  = 'block';
}

// ===== Filter Category =====
function filterCategory(cat) {
    clearSearch();
    closeSidebar();

    if (cat === 'all') {
        scrollToTop();
        updateActiveNav('finance');
        return;
    }

    updateActiveNav(cat);

    const section = document.getElementById(cat);
    if (section) {
        setTimeout(() => {
            const offset = section.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }, 100);
    }
}

// ===== Update Active Nav =====
function updateActiveNav(cat) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + cat) {
            item.classList.add('active');
        }
    });
}

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

// ===== Scroll =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Scroll Spy =====
function initScrollSpy() {
    const sections = document.querySelectorAll('.category-section');
    if (!sections.length) return;
    
    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 150) {
                current = s.id;
            }
        });
        if (current) updateActiveNav(current);
    }, { passive: true });
}

// ===== Float Btn =====
function initFloatBtn() {
    const btn = document.querySelector('.float-btn');
    if (!btn) return;
    window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
}

// ===== Keyboard =====
function initKeyboard() {
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            if (input) {
                input.focus();
                input.select();
            }
        }
        if (e.key === 'Escape') {
            clearSearch();
            closeSidebar();
            const input = document.getElementById('searchInput');
            if (input) input.blur();
        }
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            if (input) input.focus();
        }
    });
}

// ===== Hash Navigation =====
function initHashNavigation() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
            const section = document.getElementById(hash);
            if (section) {
                const offset = section.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
                updateActiveNav(hash);
            }
        }, 200);
    }

    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) filterCategory(hash);
    });
}

// ===== Click Outside Closes Sidebar =====
function initOutsideClick() {
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('mobileMenuBtn');
        
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== menuBtn && !menuBtn?.contains(e.target)) {
                closeSidebar();
            }
        }
    });
}

// ===== Listen for Admin Changes =====
function listenForAdminChanges() {
    // Re-render if localStorage changes (in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'aitoolcor_tools_data') {
            console.log('🔄 Admin made changes, refreshing...');
            renderHomepage();
        }
    });
}

// ===== Initialize =====
function init() {
    console.log('🚀 AI ToolCor Calculator - Initializing...');
    
    if (typeof ALL_TOOLS === 'undefined') {
        console.error('❌ ALL_TOOLS not loaded! Check js/tools-data.js path');
        return;
    }
    
    renderHomepage();
    initScrollSpy();
    initFloatBtn();
    initKeyboard();
    initHashNavigation();
    initOutsideClick();
    listenForAdminChanges();
    
    console.log(`✅ Ready! Total tools: ${ALL_TOOLS.length}`);
}

// ===== Make Functions Global =====
window.handleSearch = handleSearch;
window.clearSearch = clearSearch;
window.filterCategory = filterCategory;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.scrollToTop = scrollToTop;

// ===== Run =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
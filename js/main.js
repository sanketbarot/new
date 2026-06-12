// ================================================
// AI ToolCor Calculator - Homepage JS
// ================================================

// ===== Render Homepage =====
function renderHomepage() {
    console.log('🔄 Rendering homepage...');
    
    if (typeof ALL_TOOLS === 'undefined') {
        console.error('❌ tools-data.js not loaded!');
        return;
    }

    // Popular Tools
    const popularGrid = document.getElementById('popularToolsGrid');
    if (popularGrid) {
        const popular = getPopularTools();
        popularGrid.innerHTML = popular.map(toolCardHTML).join('');
        console.log(`✅ Popular: ${popular.length} tools`);
    }

    // Category Grids
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
            const tools = getToolsByCategory(cat);
            el.innerHTML = tools.map(toolCardHTML).join('');
            console.log(`✅ ${cat}: ${tools.length} tools`);
        }
    });
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

        const results = searchTools(q);

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
        updateActiveNav('finance'); // Default to first
        return;
    }

    updateActiveNav(cat);

    // Scroll to section
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

// ===== Scroll Functions =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Scroll Spy - Update Active Nav on Scroll =====
function initScrollSpy() {
    const sections = document.querySelectorAll('.category-section');
    if (!sections.length) return;

    let scrollTimer = null;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            let current = '';
            sections.forEach(s => {
                const rect = s.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 200) {
                    current = s.id;
                }
            });
            if (current) updateActiveNav(current);
        }, 50);
    }, { passive: true });
}

// ===== Float Button - Back to Top =====
function initFloatBtn() {
    const btn = document.querySelector('.float-btn');
    if (!btn) return;
    
    window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
}

// ===== Keyboard Shortcuts =====
function initKeyboard() {
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + K = focus search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            if (input) {
                input.focus();
                input.select();
            }
        }
        
        // Escape = clear search & close sidebar
        if (e.key === 'Escape') {
            clearSearch();
            closeSidebar();
            const input = document.getElementById('searchInput');
            if (input) input.blur();
        }
        
        // / = focus search
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            if (input) input.focus();
        }
    });
}

// ===== Smooth Hash Navigation =====
function initHashNavigation() {
    // Handle initial hash on page load
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

    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            filterCategory(hash);
        }
    });
}

// ===== Click Outside to Close Sidebar =====
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

// ===== Initialize Everything =====
function init() {
    console.log('🚀 AI ToolCor Calculator - Initializing...');
    
    // Check if data loaded
    if (typeof ALL_TOOLS === 'undefined') {
        console.error('❌ ALL_TOOLS not loaded! Check js/tools-data.js path');
        return;
    }
    
    // Render content
    renderHomepage();
    
    // Initialize features
    initScrollSpy();
    initFloatBtn();
    initKeyboard();
    initHashNavigation();
    initOutsideClick();
    
    console.log(`✅ Ready! Total tools: ${ALL_TOOLS.length}`);
}

// ===== Run on DOM Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== Service Worker Registration (Optional for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed:', err));
    });
}
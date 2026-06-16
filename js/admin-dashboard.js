// ================================================
// AI ToolCor Admin - Dashboard JS (FIXED)
// ================================================

'use strict';

// ===== Prevent Multiple Init =====
let dashboardInitialized = false;

// ===== Check Auth (Dashboard) =====
function checkDashboardAuth() {
    const isLoggedIn = localStorage.getItem('aitoolcor_admin_auth');
    const loginTime = localStorage.getItem('aitoolcor_admin_login_time');
    
    if (isLoggedIn !== 'true' || !loginTime) {
        window.location.replace('login.html');
        return false;
    }
    
    const hoursPassed = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
    if (hoursPassed >= 24) {
        localStorage.removeItem('aitoolcor_admin_auth');
        localStorage.removeItem('aitoolcor_admin_login_time');
        window.location.replace('login.html');
        return false;
    }
    
    return true;
}

// ===== Helper: Safe Text Setter =====
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ===== Render Dashboard =====
function renderDashboard() {
    if (typeof ALL_TOOLS === 'undefined') {
        console.error('❌ tools-data.js not loaded!');
        return;
    }
    
    // Set username
    const username = localStorage.getItem('aitoolcor_admin_username') || 'admin';
    setText('adminUsername', username);
    setText('welcomeUser', username.charAt(0).toUpperCase() + username.slice(1));
    
    // Calculate stats
    const totalTools = ALL_TOOLS.length;
    const popularTools = ALL_TOOLS.filter(t => t.popular);
    const newTools = ALL_TOOLS.filter(t => t.isNew);
    const categories = [...new Set(ALL_TOOLS.map(t => t.cat))];
    
    // Update Stats
    setText('statTools', totalTools);
    setText('statPopular', popularTools.length);
    setText('statNew', newTools.length);
    setText('statCats', categories.length);
    setText('totalToolsHero', totalTools);
    setText('totalCatsHero', categories.length);
    setText('popularCountHero', popularTools.length);
    
    // Render sections
    renderCategoryStats();
    renderPopularToolsList();
    renderNewToolsList();
    updateSessionInfo();
    
    console.log('✅ Dashboard rendered');
}

// ===== Category Stats =====
function renderCategoryStats() {
    const container = document.getElementById('categoryStats');
    if (!container) return;
    
    const categoryData = {
        'finance':   { name: 'Finance Tools',    icon: 'fa-solid fa-coins',                color: 'green',  emoji: '💰' },
        'health':    { name: 'Health Tools',     icon: 'fa-solid fa-heart-pulse',          color: 'pink',   emoji: '❤️' },
        'business':  { name: 'Business Tools',   icon: 'fa-solid fa-briefcase',            color: 'blue',   emoji: '💼' },
        'daily-use': { name: 'Daily Use Tools',  icon: 'fa-solid fa-wand-magic-sparkles',  color: 'peach',  emoji: '🪄' },
        'education': { name: 'Education Tools',  icon: 'fa-solid fa-graduation-cap',       color: 'purple', emoji: '🎓' },
        'math':      { name: 'Math Tools',       icon: 'fa-solid fa-square-root-variable', color: 'yellow', emoji: '🔢' },
        'utility':   { name: 'Utility Tools',    icon: 'fa-solid fa-screwdriver-wrench',   color: 'blue',   emoji: '🛠️' }
    };
    
    const total = ALL_TOOLS.length;
    
    const html = Object.entries(categoryData).map(([cat, data]) => {
        const count = ALL_TOOLS.filter(t => t.cat === cat).length;
        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
        
        return `
            <div class="cat-stat-item">
                <div class="cat-stat-icon ${data.color}">
                    <i class="${data.icon}"></i>
                </div>
                <div class="cat-stat-info">
                    <span class="cat-stat-name">${data.emoji} ${data.name}</span>
                    <div class="cat-stat-bar">
                        <div class="cat-stat-fill ${data.color}" style="width:${percentage}%"></div>
                    </div>
                </div>
                <span class="cat-stat-count">${count}</span>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// ===== Popular Tools List =====
function renderPopularToolsList() {
    const container = document.getElementById('popularToolsList');
    if (!container) return;
    
    const popular = ALL_TOOLS.filter(t => t.popular).slice(0, 8);
    
    if (popular.length === 0) {
        container.innerHTML = '<p class="muted" style="text-align:center;padding:20px;">No popular tools yet</p>';
        return;
    }
    
    container.innerHTML = popular.map(tool => `
        <a href="../pages/${tool.cat}/${tool.slug}.html" target="_blank" rel="noopener" class="tool-list-item">
            <div class="tool-list-icon ${tool.color}">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-list-info">
                <span class="tool-list-name">${tool.name}</span>
                <span class="tool-list-cat">${tool.cat.replace('-', ' ')}</span>
            </div>
            <span class="tool-list-badge popular">🔥 Popular</span>
        </a>
    `).join('');
}

// ===== New Tools List =====
function renderNewToolsList() {
    const container = document.getElementById('newToolsList');
    if (!container) return;
    
    const newTools = ALL_TOOLS.filter(t => t.isNew);
    
    if (newTools.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:30px 20px;">
                <i class="fa-solid fa-sparkles" style="font-size:32px;color:var(--gray-400);margin-bottom:12px;display:block;"></i>
                <p class="muted">No new tools added yet</p>
                <a href="tools.html" class="chip-sm" style="margin-top:12px;display:inline-flex;">
                    <i class="fa-solid fa-plus"></i> Add New Tool
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = newTools.map(tool => `
        <a href="../pages/${tool.cat}/${tool.slug}.html" target="_blank" rel="noopener" class="tool-list-item">
            <div class="tool-list-icon ${tool.color}">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-list-info">
                <span class="tool-list-name">${tool.name}</span>
                <span class="tool-list-cat">${tool.cat.replace('-', ' ')}</span>
            </div>
            <span class="tool-list-badge new">✨ New</span>
        </a>
    `).join('');
}

// ===== Session Info =====
function updateSessionInfo() {
    const loginTime = parseInt(localStorage.getItem('aitoolcor_admin_login_time'));
    if (!loginTime) return;
    
    const now = Date.now();
    const minutesPassed = Math.floor((now - loginTime) / 60000);
    
    let lastLoginText = '';
    if (minutesPassed < 1) lastLoginText = 'Just now';
    else if (minutesPassed < 60) lastLoginText = `${minutesPassed} min${minutesPassed !== 1 ? 's' : ''} ago`;
    else {
        const hoursPassed = Math.floor(minutesPassed / 60);
        lastLoginText = `${hoursPassed} hour${hoursPassed !== 1 ? 's' : ''} ago`;
    }
    
    const expiresIn = Math.max(0, 24 - Math.floor(minutesPassed / 60));
    
    setText('lastLogin', lastLoginText);
    setText('sessionExpires', `In ${expiresIn} hour${expiresIn !== 1 ? 's' : ''}`);
}

// ===== Refresh Dashboard (Manual Only) =====
function refreshDashboard() {
    renderDashboard();
    showToast('🔄 Dashboard refreshed!');
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

// ===== Logout =====
function confirmLogout() {
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.add('show');
}

function closeLogoutModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.remove('show');
}

function performLogout() {
    localStorage.removeItem('aitoolcor_admin_auth');
    localStorage.removeItem('aitoolcor_admin_login_time');
    localStorage.removeItem('aitoolcor_admin_username');
    sessionStorage.setItem('justLoggedOut', 'true');
    
    showToast('👋 Logging out...');
    
    setTimeout(() => {
        window.location.replace('login.html');
    }, 800);
}

// ===== Toast =====
function showToast(message, type = 'success', duration = 2500) {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    if (!toast || !messageEl) return;
    
    messageEl.textContent = message;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLogoutModal();
        closeSidebar();
    }
});

// ===== Initialize Dashboard (RUN ONCE) =====
function initDashboard() {
    if (dashboardInitialized) {
        console.warn('⚠️ Dashboard already initialized');
        return;
    }
    dashboardInitialized = true;
    
    // Check auth first
    if (!checkDashboardAuth()) return;
    
    // Render data
    renderDashboard();
    
    console.log('🎯 Dashboard Loaded (No Auto-Refresh)');
}

// ===== Make Functions Global =====
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.confirmLogout = confirmLogout;
window.closeLogoutModal = closeLogoutModal;
window.performLogout = performLogout;
window.refreshDashboard = refreshDashboard;

// ===== Run on DOM Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
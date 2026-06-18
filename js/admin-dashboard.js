// ================================================
// AI ToolCor Admin - Dashboard with Analytics
// ================================================

'use strict';

let dashboardInitialized = false;
const TRACKER_KEY = 'aitoolcor_analytics';

// ===== Auth Check =====
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
        window.location.replace('login.html');
        return false;
    }
    return true;
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ===== Get Analytics Data =====
function getAnalytics() {
    try {
        return JSON.parse(localStorage.getItem(TRACKER_KEY)) || {};
    } catch { return {}; }
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

// ===== Render Dashboard =====
function renderDashboard() {
    if (typeof ALL_TOOLS === 'undefined') return;
    
    const username = localStorage.getItem('aitoolcor_admin_username') || 'admin';
    setText('adminUsername', username);
    setText('welcomeUser', username.charAt(0).toUpperCase() + username.slice(1));
    
    const totalTools = ALL_TOOLS.length;
    const popularTools = ALL_TOOLS.filter(t => t.popular);
    const newTools = ALL_TOOLS.filter(t => t.isNew);
    const categories = [...new Set(ALL_TOOLS.map(t => t.cat))];
    
    setText('totalToolsHero', totalTools);
    setText('totalCatsHero', categories.length);
    setText('popularCountHero', popularTools.length);
    
    // Render sections
    renderAnalyticsStats();
    renderTopTools();
    renderCategoryUsage();
    renderRecentActivity();
    renderWeeklyTrend();
    renderCategoryStats();
    renderPopularToolsList();
    renderNewToolsList();
    updateSessionInfo();
    
    console.log('✅ Dashboard with Analytics rendered');
}

// ===== Analytics Stats Cards =====
function renderAnalyticsStats() {
    const analytics = getAnalytics();
    const today = getToday();
    const last7Days = getLastNDays(7);
    
    let totalViews = 0;
    let todayViews = 0;
    let weekViews = 0;
    let toolsUsed = 0;
    
    Object.keys(analytics).forEach(key => {
        if (key === '_global') return;
        toolsUsed++;
        const tool = analytics[key];
        totalViews += tool.totalViews || 0;
        todayViews += (tool.dailyViews && tool.dailyViews[today]) || 0;
        
        last7Days.forEach(date => {
            weekViews += (tool.dailyViews && tool.dailyViews[date]) || 0;
        });
    });
    
    setText('statTotalViews', totalViews.toLocaleString('en-IN'));
    setText('statTodayViews', todayViews.toLocaleString('en-IN'));
    setText('statWeekViews', weekViews.toLocaleString('en-IN'));
    setText('statToolsUsed', toolsUsed);
}

// ===== Top 10 Most Used Tools =====
function renderTopTools() {
    const container = document.getElementById('topToolsChart');
    if (!container) return;
    
    const analytics = getAnalytics();
    const toolStats = [];
    
    Object.keys(analytics).forEach(key => {
        if (key === '_global') return;
        const tool = analytics[key];
        const toolInfo = ALL_TOOLS.find(t => t.slug === key);
        toolStats.push({
            slug: key,
            name: toolInfo ? toolInfo.name : key,
            icon: toolInfo ? toolInfo.icon : 'fa-solid fa-calculator',
            color: toolInfo ? toolInfo.color : 'green',
            cat: toolInfo ? toolInfo.cat : 'unknown',
            views: tool.totalViews || 0,
            today: (tool.dailyViews && tool.dailyViews[getToday()]) || 0,
            lastVisit: tool.lastVisit || '-'
        });
    });
    
    toolStats.sort((a, b) => b.views - a.views);
    const top10 = toolStats.slice(0, 10);
    const maxViews = top10.length > 0 ? top10[0].views : 1;
    
    if (top10.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px 20px;">
                <i class="fa-solid fa-chart-bar" style="font-size:48px;color:var(--gray-400);margin-bottom:12px;display:block;"></i>
                <p style="font-size:14px;font-weight:600;color:var(--ink);">No Analytics Data Yet</p>
                <p class="muted">Visit calculator pages to start tracking usage</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    top10.forEach((tool, i) => {
        const barWidth = Math.max(5, (tool.views / maxViews) * 100);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        
        html += `
            <div style="display:flex;align-items:center;gap:12px;padding:10px;background:${i < 3 ? 'var(--bg-soft)' : 'transparent'};border-radius:var(--r-sm);margin-bottom:8px;">
                <span style="font-size:16px;width:28px;text-align:center;font-weight:700;">${medal}</span>
                <div class="tool-list-icon ${tool.color}" style="width:32px;height:32px;border-radius:8px;font-size:12px;">
                    <i class="${tool.icon}"></i>
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:4px;">${tool.name}</div>
                    <div style="height:8px;background:var(--border-line);border-radius:999px;overflow:hidden;">
                        <div style="height:100%;width:${barWidth}%;background:linear-gradient(90deg,${i < 3 ? '#10B981,#059669' : '#3B82F6,#2563EB'});border-radius:999px;transition:width 0.5s;"></div>
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:16px;font-weight:800;color:var(--ink);">${tool.views}</div>
                    <div style="font-size:10px;color:var(--gray-500);">views</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ===== Category Usage =====
function renderCategoryUsage() {
    const container = document.getElementById('categoryUsageChart');
    if (!container) return;
    
    const analytics = getAnalytics();
    const catViews = {};
    let totalViews = 0;
    
    Object.keys(analytics).forEach(key => {
        if (key === '_global') return;
        const tool = analytics[key];
        const toolInfo = ALL_TOOLS.find(t => t.slug === key);
        if (toolInfo) {
            if (!catViews[toolInfo.cat]) catViews[toolInfo.cat] = 0;
            catViews[toolInfo.cat] += tool.totalViews || 0;
            totalViews += tool.totalViews || 0;
        }
    });
    
    const catData = {
        'finance': { emoji: '💰', color: '#10B981' },
        'health': { emoji: '❤️', color: '#EC4899' },
        'business': { emoji: '💼', color: '#3B82F6' },
        'daily-use': { emoji: '🪄', color: '#F97316' },
        'education': { emoji: '🎓', color: '#8B5CF6' },
        'math': { emoji: '🔢', color: '#EAB308' },
        'utility': { emoji: '🛠️', color: '#06B6D4' }
    };
    
    if (totalViews === 0) {
        container.innerHTML = '<p class="muted" style="text-align:center;padding:30px;">No usage data yet</p>';
        return;
    }
    
    let html = '';
    Object.keys(catData).forEach(cat => {
        const views = catViews[cat] || 0;
        const pct = totalViews > 0 ? ((views / totalViews) * 100).toFixed(1) : 0;
        const barWidth = totalViews > 0 ? (views / totalViews) * 100 : 0;
        
        html += `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
                <span style="font-size:18px;width:28px;">${catData[cat].emoji}</span>
                <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                        <span style="font-size:12px;font-weight:600;color:var(--ink);text-transform:capitalize;">${cat.replace('-', ' ')}</span>
                        <span style="font-size:12px;font-weight:700;color:var(--gray-700);">${views} (${pct}%)</span>
                    </div>
                    <div style="height:8px;background:var(--border-line);border-radius:999px;overflow:hidden;">
                        <div style="height:100%;width:${barWidth}%;background:${catData[cat].color};border-radius:999px;transition:width 0.5s;"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ===== Recent Activity =====
function renderRecentActivity() {
    const container = document.getElementById('recentActivityList');
    if (!container) return;
    
    const analytics = getAnalytics();
    const allSessions = [];
    
    Object.keys(analytics).forEach(key => {
        if (key === '_global') return;
        const tool = analytics[key];
        if (tool.sessions) {
            tool.sessions.forEach(s => {
                const toolInfo = ALL_TOOLS.find(t => t.slug === key);
                allSessions.push({
                    slug: key,
                    name: toolInfo ? toolInfo.name : key,
                    icon: toolInfo ? toolInfo.icon : 'fa-solid fa-calculator',
                    color: toolInfo ? toolInfo.color : 'green',
                    timestamp: s.timestamp,
                    date: s.date
                });
            });
        }
    });
    
    allSessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recent = allSessions.slice(0, 15);
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="muted" style="text-align:center;padding:30px;">No recent activity</p>';
        return;
    }
    
    container.innerHTML = recent.map(item => {
        const time = new Date(item.timestamp);
        const now = new Date();
        const diffMs = now - time;
        const diffMin = Math.floor(diffMs / 60000);
        
        let timeAgo;
        if (diffMin < 1) timeAgo = 'Just now';
        else if (diffMin < 60) timeAgo = `${diffMin}m ago`;
        else if (diffMin < 1440) timeAgo = `${Math.floor(diffMin / 60)}h ago`;
        else timeAgo = `${Math.floor(diffMin / 1440)}d ago`;
        
        return `
            <div class="tool-list-item">
                <div class="tool-list-icon ${item.color}"><i class="${item.icon}"></i></div>
                <div class="tool-list-info">
                    <span class="tool-list-name">${item.name}</span>
                    <span class="tool-list-cat">${timeAgo}</span>
                </div>
                <span style="font-size:11px;color:var(--gray-500);">${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
    }).join('');
}

// ===== Weekly Trend =====
function renderWeeklyTrend() {
    const container = document.getElementById('weeklyTrendChart');
    if (!container) return;
    
    const analytics = getAnalytics();
    const last7 = getLastNDays(7);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const dailyTotals = last7.map(date => {
        let total = 0;
        Object.keys(analytics).forEach(key => {
            if (key === '_global') return;
            const tool = analytics[key];
            total += (tool.dailyViews && tool.dailyViews[date]) || 0;
        });
        return { date, total, day: dayNames[new Date(date).getDay()] };
    });
    
    const maxTotal = Math.max(...dailyTotals.map(d => d.total), 1);
    
    let html = '<div style="display:flex;align-items:flex-end;justify-content:space-around;height:180px;gap:6px;padding:10px 0;">';
    
    dailyTotals.forEach((d, i) => {
        const barHeight = Math.max(4, (d.total / maxTotal) * 140);
        const isToday = d.date === getToday();
        const color = isToday ? 'linear-gradient(180deg, #10B981, #059669)' : 'linear-gradient(180deg, #D1D5DB, #9CA3AF)';
        
        html += `
            <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;">
                <span style="font-size:12px;font-weight:700;color:${isToday ? '#059669' : 'var(--ink)'};">${d.total}</span>
                <div style="width:100%;max-width:36px;height:${barHeight}px;background:${color};border-radius:8px 8px 4px 4px;transition:height 0.5s;"></div>
                <span style="font-size:11px;font-weight:${isToday ? '700' : '500'};color:${isToday ? '#059669' : 'var(--gray-500)'};">${d.day}</span>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ===== Category Stats (existing) =====
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
    
    container.innerHTML = Object.entries(categoryData).map(([cat, data]) => {
        const count = ALL_TOOLS.filter(t => t.cat === cat).length;
        const pct = ((count / total) * 100).toFixed(0);
        return `
            <div class="cat-stat-item">
                <div class="cat-stat-icon ${data.color}"><i class="${data.icon}"></i></div>
                <div class="cat-stat-info">
                    <span class="cat-stat-name">${data.emoji} ${data.name}</span>
                    <div class="cat-stat-bar"><div class="cat-stat-fill ${data.color}" style="width:${pct}%"></div></div>
                </div>
                <span class="cat-stat-count">${count}</span>
            </div>
        `;
    }).join('');
}

// ===== Popular Tools List =====
function renderPopularToolsList() {
    const container = document.getElementById('popularToolsList');
    if (!container) return;
    const popular = ALL_TOOLS.filter(t => t.popular).slice(0, 8);
    if (popular.length === 0) { container.innerHTML = '<p class="muted" style="text-align:center;padding:20px;">No popular tools</p>'; return; }
    container.innerHTML = popular.map(tool => `
        <a href="../pages/${tool.cat}/${tool.slug}.html" target="_blank" class="tool-list-item">
            <div class="tool-list-icon ${tool.color}"><i class="${tool.icon}"></i></div>
            <div class="tool-list-info"><span class="tool-list-name">${tool.name}</span><span class="tool-list-cat">${tool.cat.replace('-', ' ')}</span></div>
            <span class="tool-list-badge popular">🔥</span>
        </a>
    `).join('');
}

// ===== New Tools List =====
function renderNewToolsList() {
    const container = document.getElementById('newToolsList');
    if (!container) return;
    const newTools = ALL_TOOLS.filter(t => t.isNew);
    if (newTools.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px;"><i class="fa-solid fa-sparkles" style="font-size:32px;color:var(--gray-400);margin-bottom:12px;display:block;"></i><p class="muted">No new tools</p></div>';
        return;
    }
    container.innerHTML = newTools.map(tool => `
        <a href="../pages/${tool.cat}/${tool.slug}.html" target="_blank" class="tool-list-item">
            <div class="tool-list-icon ${tool.color}"><i class="${tool.icon}"></i></div>
            <div class="tool-list-info"><span class="tool-list-name">${tool.name}</span><span class="tool-list-cat">${tool.cat.replace('-', ' ')}</span></div>
            <span class="tool-list-badge new">✨</span>
        </a>
    `).join('');
}

// ===== Session Info =====
function updateSessionInfo() {
    const loginTime = parseInt(localStorage.getItem('aitoolcor_admin_login_time'));
    if (!loginTime) return;
    const minutesPassed = Math.floor((Date.now() - loginTime) / 60000);
    let lastLoginText;
    if (minutesPassed < 1) lastLoginText = 'Just now';
    else if (minutesPassed < 60) lastLoginText = `${minutesPassed} min ago`;
    else lastLoginText = `${Math.floor(minutesPassed / 60)}h ago`;
    const expiresIn = Math.max(0, 24 - Math.floor(minutesPassed / 60));
    setText('lastLogin', lastLoginText);
    setText('sessionExpires', `In ${expiresIn}h`);
}

// ===== Export Analytics =====
function exportAnalytics() {
    const analytics = getAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aitoolcor-analytics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Analytics exported!');
}

// ===== Clear Analytics =====
function clearAnalytics() {
    if (!confirm('Clear all analytics data? This cannot be undone.')) return;
    localStorage.removeItem(TRACKER_KEY);
    renderDashboard();
    showToast('🗑️ Analytics cleared!');
}

// ===== Refresh =====
function refreshDashboard() {
    renderDashboard();
    showToast('🔄 Dashboard refreshed!');
}

// ===== Sidebar =====
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
    document.getElementById('logoutModal').classList.add('show');
}

function closeLogoutModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('logoutModal').classList.remove('show');
}

function performLogout() {
    localStorage.removeItem('aitoolcor_admin_auth');
    localStorage.removeItem('aitoolcor_admin_login_time');
    localStorage.removeItem('aitoolcor_admin_username');
    sessionStorage.setItem('justLoggedOut', 'true');
    showToast('👋 Logging out...');
    setTimeout(() => window.location.replace('login.html'), 800);
}

// ===== Toast =====
function showToast(message, type = 'success', duration = 2500) {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    if (!toast || !messageEl) return;
    messageEl.textContent = message;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLogoutModal(); closeSidebar(); }
});

// ===== Initialize =====
function initDashboard() {
    if (dashboardInitialized) return;
    dashboardInitialized = true;
    if (!checkDashboardAuth()) return;
    renderDashboard();
    console.log('🎯 Dashboard v2.0 with Analytics Loaded');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
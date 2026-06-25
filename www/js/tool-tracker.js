// ================================================
// AI ToolCor - Tool Usage Tracker
// Place this in every tool page
// ================================================

'use strict';

const TRACKER_KEY = 'aitoolcor_analytics';

function getAnalytics() {
    try {
        return JSON.parse(localStorage.getItem(TRACKER_KEY)) || {};
    } catch { return {}; }
}

function saveAnalytics(data) {
    try {
        localStorage.setItem(TRACKER_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Analytics save failed:', e);
    }
}

function trackToolUsage() {
    // Get tool slug from URL
    const path = window.location.pathname;
    const fileName = path.split('/').pop().replace('.html', '');
    
    if (!fileName || fileName === 'index' || path.includes('admin')) return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 2025-01-15
    const hour = now.getHours();
    const weekDay = now.getDay();
    
    const analytics = getAnalytics();
    
    // Initialize tool entry if not exists
    if (!analytics[fileName]) {
        analytics[fileName] = {
            slug: fileName,
            totalViews: 0,
            firstVisit: today,
            lastVisit: today,
            dailyViews: {},
            hourlyViews: {},
            sessions: []
        };
    }
    
    const tool = analytics[fileName];
    
    // Increment total
    tool.totalViews++;
    tool.lastVisit = today;
    
    // Daily views
    if (!tool.dailyViews[today]) tool.dailyViews[today] = 0;
    tool.dailyViews[today]++;
    
    // Hourly distribution
    if (!tool.hourlyViews[hour]) tool.hourlyViews[hour] = 0;
    tool.hourlyViews[hour]++;
    
    // Add session (keep last 50)
    tool.sessions.push({
        timestamp: now.toISOString(),
        date: today,
        hour: hour,
        day: weekDay
    });
    if (tool.sessions.length > 50) {
        tool.sessions = tool.sessions.slice(-50);
    }
    
    // Clean old daily views (keep 90 days)
    const dailyKeys = Object.keys(tool.dailyViews).sort();
    if (dailyKeys.length > 90) {
        dailyKeys.slice(0, dailyKeys.length - 90).forEach(k => delete tool.dailyViews[k]);
    }
    
    // Update global stats
    if (!analytics._global) {
        analytics._global = {
            totalPageViews: 0,
            uniqueTools: 0,
            dailyViews: {},
            firstVisit: today
        };
    }
    
    analytics._global.totalPageViews++;
    analytics._global.uniqueTools = Object.keys(analytics).filter(k => k !== '_global').length;
    
    if (!analytics._global.dailyViews[today]) analytics._global.dailyViews[today] = 0;
    analytics._global.dailyViews[today]++;
    
    // Clean global daily (keep 90 days)
    const globalKeys = Object.keys(analytics._global.dailyViews).sort();
    if (globalKeys.length > 90) {
        globalKeys.slice(0, globalKeys.length - 90).forEach(k => delete analytics._global.dailyViews[k]);
    }
    
    saveAnalytics(analytics);
    
    console.log(`📊 Tracked: ${fileName} (Total: ${tool.totalViews})`);
}

// Auto-track on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackToolUsage);
} else {
    trackToolUsage();
}
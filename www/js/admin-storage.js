// ================================================
// AI ToolCor Admin - Storage Helper
// ================================================

'use strict';

const STORAGE_KEY = 'aitoolcor_tools_data';
const STORAGE_KEY_CATEGORIES = 'aitoolcor_categories_data';
const STORAGE_KEY_SETTINGS = 'aitoolcor_settings_data';

// ===== Tools Storage =====

// Save Tools to localStorage
function saveToolsData(tools) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
        console.log(`💾 Saved ${tools.length} tools`);
        return true;
    } catch (e) {
        console.error('❌ Save failed:', e);
        return false;
    }
}

// Load Tools from localStorage
function loadToolsData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('❌ Load failed:', e);
    }
    return null;
}

// Reset Tools to Default
function resetToolsData() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🔄 Tools reset to default');
}

// Get Current Tools (with admin overrides)
function getCurrentTools() {
    const saved = loadToolsData();
    
    if (saved && Array.isArray(saved) && saved.length > 0) {
        // Ensure all tools have 'active' field
        saved.forEach(t => {
            if (typeof t.active === 'undefined') t.active = true;
        });
        return saved;
    }
    
    // Fallback to default
    if (typeof ALL_TOOLS !== 'undefined') {
        const defaultTools = [...ALL_TOOLS];
        defaultTools.forEach(t => {
            if (typeof t.active === 'undefined') t.active = true;
        });
        return defaultTools;
    }
    
    return [];
}

// ===== Categories Storage =====

function saveCategoriesData(categories) {
    try {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
        return true;
    } catch (e) {
        console.error('❌ Categories save failed:', e);
        return false;
    }
}

function loadCategoriesData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
        if (data) return JSON.parse(data);
    } catch (e) {
        console.error('❌ Categories load failed:', e);
    }
    return null;
}

function resetCategoriesData() {
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
}

// ===== Settings Storage =====

function saveSettingsData(settings) {
    try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('❌ Settings save failed:', e);
        return false;
    }
}

function loadSettingsData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (data) return JSON.parse(data);
    } catch (e) {
        console.error('❌ Settings load failed:', e);
    }
    return null;
}

function getDefaultSettings() {
    return {
        siteName: 'AI ToolCor Calculator',
        siteTagline: '70+ Free Online Calculators',
        siteUrl: 'https://calculator.aitoolcor.com',
        siteEmail: 'hello@aitoolcor.com',
        seoTitle: 'AI ToolCor Calculator - Free Online Tools',
        seoDescription: '70+ free online calculators for finance, health, business, math and more.',
        seoKeywords: 'calculator, emi, sip, bmi, gst, free tools',
        adminUsername: 'admin',
        adminPassword: 'aitoolcor@2024',
        showPopularBadge: true,
        showNewBadge: true,
        enableSearch: true,
        enableDarkMode: false
    };
}

function getCurrentSettings() {
    const saved = loadSettingsData();
    return saved || getDefaultSettings();
}

// ===== Export/Import All Data =====

function exportAllData() {
    return {
        tools: getCurrentTools(),
        categories: loadCategoriesData(),
        settings: getCurrentSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
    };
}

function importAllData(data) {
    try {
        if (data.tools && Array.isArray(data.tools)) {
            saveToolsData(data.tools);
        }
        if (data.categories) {
            saveCategoriesData(data.categories);
        }
        if (data.settings) {
            saveSettingsData(data.settings);
        }
        return true;
    } catch (e) {
        console.error('❌ Import failed:', e);
        return false;
    }
}

// ===== Clear All Data =====

function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    console.log('🗑️ All data cleared');
}

// ===== Storage Size Info =====

function getStorageInfo() {
    let total = 0;
    let toolsSize = 0;
    let categoriesSize = 0;
    let settingsSize = 0;
    
    const toolsData = localStorage.getItem(STORAGE_KEY);
    const categoriesData = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    const settingsData = localStorage.getItem(STORAGE_KEY_SETTINGS);
    
    if (toolsData) toolsSize = new Blob([toolsData]).size;
    if (categoriesData) categoriesSize = new Blob([categoriesData]).size;
    if (settingsData) settingsSize = new Blob([settingsData]).size;
    
    total = toolsSize + categoriesSize + settingsSize;
    
    return {
        total: formatBytes(total),
        tools: formatBytes(toolsSize),
        categories: formatBytes(categoriesSize),
        settings: formatBytes(settingsSize),
        rawTotal: total
    };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== Make Functions Global =====
window.saveToolsData = saveToolsData;
window.loadToolsData = loadToolsData;
window.resetToolsData = resetToolsData;
window.getCurrentTools = getCurrentTools;

window.saveCategoriesData = saveCategoriesData;
window.loadCategoriesData = loadCategoriesData;
window.resetCategoriesData = resetCategoriesData;

window.saveSettingsData = saveSettingsData;
window.loadSettingsData = loadSettingsData;
window.getDefaultSettings = getDefaultSettings;
window.getCurrentSettings = getCurrentSettings;

window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.clearAllData = clearAllData;
window.getStorageInfo = getStorageInfo;

console.log('💾 Storage helper loaded');
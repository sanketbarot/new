// ================================================
// AI ToolCor Admin - Settings Manager
// ================================================

'use strict';

let currentSettings = {};
let pendingAction = null;
let settingsInitialized = false;

// ===== Auth Check =====
function checkAuth() {
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

// ===== Helper =====
function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setChecked(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = val === true;
}

function isChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

// ===== Initialize =====
function initSettings() {
    if (settingsInitialized) return;
    settingsInitialized = true;
    
    if (!checkAuth()) return;
    
    // Set username
    const username = localStorage.getItem('aitoolcor_admin_username') || 'admin';
    setText('adminUsername', username);
    
    // Load settings
    currentSettings = getCurrentSettings();
    populateSettings();
    
    // Storage info
    updateStorageInfo();
    
    // SEO character counter
    setupSeoCounters();
    
    console.log('✅ Settings Manager Loaded');
}

// ===== Populate Form =====
function populateSettings() {
    // General
    setValue('siteName', currentSettings.siteName);
    setValue('siteTagline', currentSettings.siteTagline);
    setValue('siteUrl', currentSettings.siteUrl);
    setValue('siteEmail', currentSettings.siteEmail);
    
    // SEO
    setValue('seoTitle', currentSettings.seoTitle);
    setValue('seoDescription', currentSettings.seoDescription);
    setValue('seoKeywords', currentSettings.seoKeywords);
    updateSeoPreview();
    updateSeoCounters();
    
    // Account
    setValue('accountUsername', currentSettings.adminUsername);
    
    // Features
    setChecked('featSearch', currentSettings.enableSearch !== false);
    setChecked('featPopular', currentSettings.showPopularBadge !== false);
    setChecked('featNew', currentSettings.showNewBadge !== false);
    setChecked('featDarkMode', currentSettings.enableDarkMode === true);
    setChecked('featStats', currentSettings.showStats !== false);
}

// ===== Switch Tabs =====
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update panels
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const activePanel = document.getElementById('tab-' + tabName);
    if (activePanel) activePanel.classList.add('active');
    
    // Refresh storage info if backup tab
    if (tabName === 'backup') updateStorageInfo();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SEO Counters =====
function setupSeoCounters() {
    const titleEl = document.getElementById('seoTitle');
    const descEl = document.getElementById('seoDescription');
    
    if (titleEl) {
        titleEl.addEventListener('input', () => {
            updateSeoCounters();
            updateSeoPreview();
        });
    }
    if (descEl) {
        descEl.addEventListener('input', () => {
            updateSeoCounters();
            updateSeoPreview();
        });
    }
}

function updateSeoCounters() {
    const title = getValue('seoTitle');
    const desc = getValue('seoDescription');
    
    setText('seoTitleCount', title.length);
    setText('seoDescCount', desc.length);
}

function updateSeoPreview() {
    const title = getValue('seoTitle') || 'AI ToolCor Calculator - Free Online Tools';
    const desc = getValue('seoDescription') || '70+ free online calculators for finance, health, business, math and more...';
    const url = getValue('siteUrl') || 'https://calculator.aitoolcor.com';
    
    setText('seoPrevTitle', title);
    setText('seoPrevDesc', desc);
    setText('seoPrevUrl', url);
}

// ===== Save General Settings =====
function saveGeneralSettings() {
    const siteName = getValue('siteName');
    
    if (!siteName) {
        showToast('❌ Site name is required', 'error');
        return;
    }
    
    currentSettings.siteName = siteName;
    currentSettings.siteTagline = getValue('siteTagline');
    currentSettings.siteUrl = getValue('siteUrl');
    currentSettings.siteEmail = getValue('siteEmail');
    
    saveSettingsData(currentSettings);
    updateSeoPreview();
    showToast('✅ General settings saved!');
}

// ===== Save SEO Settings =====
function saveSeoSettings() {
    currentSettings.seoTitle = getValue('seoTitle');
    currentSettings.seoDescription = getValue('seoDescription');
    currentSettings.seoKeywords = getValue('seoKeywords');
    
    saveSettingsData(currentSettings);
    showToast('✅ SEO settings saved!');
}

// ===== Save Account Settings =====
function saveAccountSettings() {
    const username = getValue('accountUsername');
    const currentPass = getValue('currentPassword');
    const newPass = getValue('newPassword');
    const confirmPass = getValue('confirmPassword');
    
    if (!username) {
        showToast('❌ Username cannot be empty', 'error');
        return;
    }
    
    // If changing password
    if (newPass || confirmPass || currentPass) {
        if (!currentPass) {
            showToast('❌ Enter current password', 'error');
            return;
        }
        
        // Verify current password
        if (currentPass !== currentSettings.adminPassword) {
            showToast('❌ Current password is incorrect!', 'error');
            return;
        }
        
        if (!newPass) {
            showToast('❌ Enter new password', 'error');
            return;
        }
        
        if (newPass.length < 8) {
            showToast('❌ Password must be at least 8 characters', 'error');
            return;
        }
        
        if (newPass !== confirmPass) {
            showToast('❌ Passwords do not match!', 'error');
            return;
        }
        
        currentSettings.adminPassword = newPass;
        
        // Update username
        const usernameChanged = username !== currentSettings.adminUsername;
        currentSettings.adminUsername = username;
        
        saveSettingsData(currentSettings);
        
        // Update localStorage credentials
        localStorage.setItem('aitoolcor_admin_creds', JSON.stringify({
            username: username,
            password: newPass
        }));
        
        if (usernameChanged) {
            localStorage.setItem('aitoolcor_admin_username', username);
        }
        
        showToast('✅ Account updated! Logging out...', 'success');
        
        // Logout after 2 seconds
        setTimeout(() => {
            performLogout();
        }, 2000);
        
    } else {
        // Just username change
        if (username !== currentSettings.adminUsername) {
            currentSettings.adminUsername = username;
            saveSettingsData(currentSettings);
            
            // Update credentials
            const creds = JSON.parse(localStorage.getItem('aitoolcor_admin_creds')) || {
                username: 'admin',
                password: 'aitoolcor@2024'
            };
            creds.username = username;
            localStorage.setItem('aitoolcor_admin_creds', JSON.stringify(creds));
            localStorage.setItem('aitoolcor_admin_username', username);
            
            showToast('✅ Username updated!');
            setText('adminUsername', username);
        } else {
            showToast('ℹ️ No changes to save');
        }
    }
}

// ===== Password Strength Check =====
function checkPasswordStrength() {
    const pass = getValue('newPassword');
    const strengthEl = document.getElementById('passStrength');
    const fillEl = document.getElementById('strengthFill');
    const textEl = document.getElementById('strengthText');
    
    if (!pass) {
        strengthEl.style.display = 'none';
        return;
    }
    
    strengthEl.style.display = 'flex';
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    const strengths = [
        { width: '20%', color: '#DC2626', text: 'Very Weak' },
        { width: '40%', color: '#F97316', text: 'Weak' },
        { width: '60%', color: '#EAB308', text: 'Medium' },
        { width: '80%', color: '#10B981', text: 'Strong' },
        { width: '100%', color: '#059669', text: 'Very Strong' }
    ];
    
    const level = strengths[Math.min(score - 1, 4)] || strengths[0];
    
    fillEl.style.width = level.width;
    fillEl.style.background = level.color;
    textEl.textContent = level.text;
    textEl.style.color = level.color;
}

// ===== Toggle Password Visibility =====
function togglePass(inputId, eyeId) {
    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);
    
    if (!input || !eye) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        eye.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        eye.className = 'fa-solid fa-eye';
    }
}

// ===== Save Features =====
function saveFeaturesSettings() {
    currentSettings.enableSearch = isChecked('featSearch');
    currentSettings.showPopularBadge = isChecked('featPopular');
    currentSettings.showNewBadge = isChecked('featNew');
    currentSettings.enableDarkMode = isChecked('featDarkMode');
    currentSettings.showStats = isChecked('featStats');
    
    saveSettingsData(currentSettings);
    showToast('✅ Features saved!');
}

// ===== Save All Settings =====
function saveAllSettings() {
    saveGeneralSettings();
    saveSeoSettings();
    saveFeaturesSettings();
    showToast('✅ All settings saved!');
}

// ===== Storage Info =====
function updateStorageInfo() {
    const grid = document.getElementById('storageGrid');
    if (!grid) return;
    
    const info = getStorageInfo();
    const tools = getCurrentTools();
    const categories = loadCategoriesData() || [];
    
    grid.innerHTML = `
        <div class="storage-item">
            <div class="storage-icon">
                <i class="fa-solid fa-toolbox"></i>
            </div>
            <div class="storage-info-text">
                <span class="storage-num">${tools.length}</span>
                <span class="storage-lbl">Tools</span>
            </div>
            <span class="storage-size">${info.tools}</span>
        </div>
        
        <div class="storage-item">
            <div class="storage-icon">
                <i class="fa-solid fa-folder-tree"></i>
            </div>
            <div class="storage-info-text">
                <span class="storage-num">${categories.length || 7}</span>
                <span class="storage-lbl">Categories</span>
            </div>
            <span class="storage-size">${info.categories}</span>
        </div>
        
        <div class="storage-item">
            <div class="storage-icon">
                <i class="fa-solid fa-gear"></i>
            </div>
            <div class="storage-info-text">
                <span class="storage-num">${Object.keys(currentSettings).length}</span>
                <span class="storage-lbl">Settings</span>
            </div>
            <span class="storage-size">${info.settings}</span>
        </div>
        
        <div class="storage-item total">
            <div class="storage-icon">
                <i class="fa-solid fa-database"></i>
            </div>
            <div class="storage-info-text">
                <span class="storage-num">Total</span>
                <span class="storage-lbl">Used Space</span>
            </div>
            <span class="storage-size">${info.total}</span>
        </div>
    `;
}

// ===== Export All Settings =====
function exportAllSettings() {
    const data = exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aitoolcor-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Backup downloaded!');
}

// ===== Import All Settings =====
function importAllSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!confirm('⚠️ This will REPLACE all current data!\n\nAre you sure you want to restore from backup?')) {
                return;
            }
            
            const success = importAllData(data);
            
            if (success) {
                showToast('✅ Backup restored! Reloading...', 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast('❌ Restore failed', 'error');
            }
        } catch (err) {
            showToast('❌ Invalid backup file', 'error');
            console.error(err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ===== Confirm Actions =====
function confirmResetTools() {
    pendingAction = 'resetTools';
    showConfirmModal(
        '🔄 Reset Tools?',
        'This will restore all tools to default. Custom changes will be lost. Are you sure?',
        'Reset Tools'
    );
}

function confirmResetCategories() {
    pendingAction = 'resetCategories';
    showConfirmModal(
        '🔄 Reset Categories?',
        'This will restore all categories to default. Are you sure?',
        'Reset Categories'
    );
}

function confirmResetSettings() {
    pendingAction = 'resetSettings';
    showConfirmModal(
        '🔄 Reset Settings?',
        'This will restore all settings to factory defaults. Are you sure?',
        'Reset Settings'
    );
}

function confirmDeleteAll() {
    pendingAction = 'deleteAll';
    showConfirmModal(
        '🗑️ Delete EVERYTHING?',
        '⚠️ WARNING: This will permanently delete all tools, categories, settings, and account. You will be logged out. This CANNOT be undone!',
        'Delete All Data'
    );
}

function showConfirmModal(title, message, btnText) {
    setText('confirmTitle', title);
    setText('confirmMessage', message);
    document.getElementById('confirmBtn').innerHTML = `<i class="fa-solid fa-check"></i> ${btnText}`;
    document.getElementById('confirmModal').classList.add('show');
}

function closeConfirmModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('confirmModal').classList.remove('show');
    pendingAction = null;
}

function executeConfirmAction() {
    if (!pendingAction) return;
    
    switch (pendingAction) {
        case 'resetTools':
            resetToolsData();
            showToast('✅ Tools reset to default!');
            break;
            
        case 'resetCategories':
            resetCategoriesData();
            showToast('✅ Categories reset to default!');
            break;
            
        case 'resetSettings':
            localStorage.removeItem('aitoolcor_settings_data');
            localStorage.removeItem('aitoolcor_admin_creds');
            showToast('✅ Settings reset! Reloading...');
            setTimeout(() => location.reload(), 1500);
            break;
            
        case 'deleteAll':
            clearAllData();
            localStorage.removeItem('aitoolcor_admin_auth');
            localStorage.removeItem('aitoolcor_admin_login_time');
            localStorage.removeItem('aitoolcor_admin_username');
            localStorage.removeItem('aitoolcor_admin_creds');
            showToast('🗑️ All data deleted!', 'error');
            setTimeout(() => {
                window.location.replace('login.html');
            }, 1500);
            break;
    }
    
    closeConfirmModal();
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
        closeConfirmModal();
        closeLogoutModal();
        closeSidebar();
    }
});

// ===== Make Global =====
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.confirmLogout = confirmLogout;
window.closeLogoutModal = closeLogoutModal;
window.performLogout = performLogout;
window.switchTab = switchTab;
window.saveGeneralSettings = saveGeneralSettings;
window.saveSeoSettings = saveSeoSettings;
window.saveAccountSettings = saveAccountSettings;
window.saveFeaturesSettings = saveFeaturesSettings;
window.saveAllSettings = saveAllSettings;
window.togglePass = togglePass;
window.checkPasswordStrength = checkPasswordStrength;
window.exportAllSettings = exportAllSettings;
window.importAllSettings = importAllSettings;
window.confirmResetTools = confirmResetTools;
window.confirmResetCategories = confirmResetCategories;
window.confirmResetSettings = confirmResetSettings;
window.confirmDeleteAll = confirmDeleteAll;
window.closeConfirmModal = closeConfirmModal;
window.executeConfirmAction = executeConfirmAction;

// ===== Initialize =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}
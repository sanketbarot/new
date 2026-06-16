// ================================================
// AI ToolCor Admin - Categories Manager
// ================================================

'use strict';

// ===== Default Categories =====
const DEFAULT_CATEGORIES = [
    { id: 'finance',   name: 'Finance Tools',    emoji: '💰', icon: 'fa-solid fa-coins',                color: 'green',  desc: 'Calculators for financial planning' },
    { id: 'health',    name: 'Health Tools',     emoji: '❤️', icon: 'fa-solid fa-heart-pulse',          color: 'pink',   desc: 'Calculators for health & fitness' },
    { id: 'business',  name: 'Business Tools',   emoji: '💼', icon: 'fa-solid fa-briefcase',            color: 'blue',   desc: 'Calculators for business growth' },
    { id: 'daily-use', name: 'Daily Use Tools',  emoji: '🪄', icon: 'fa-solid fa-wand-magic-sparkles',  color: 'peach',  desc: 'Calculators for everyday use' },
    { id: 'education', name: 'Education Tools',  emoji: '🎓', icon: 'fa-solid fa-graduation-cap',       color: 'purple', desc: 'Calculators for students' },
    { id: 'math',      name: 'Math Tools',       emoji: '🔢', icon: 'fa-solid fa-square-root-variable', color: 'yellow', desc: 'Calculators for mathematics' },
    { id: 'utility',   name: 'Utility Tools',    emoji: '🛠️', icon: 'fa-solid fa-screwdriver-wrench',   color: 'blue',   desc: 'Tools for everyday utility' }
];

let currentCategories = [];
let editingCategoryId = null;
let deletingCategoryId = null;
let categoriesInitialized = false;

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

// ===== Helper: Safe Text Setter =====
function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ===== Get Current Categories =====
function getCategories() {
    const saved = loadCategoriesData();
    if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved;
    }
    return [...DEFAULT_CATEGORIES];
}

// ===== Get Tool Count per Category =====
function getToolCountByCategory(catId) {
    const tools = getCurrentTools();
    return tools.filter(t => t.cat === catId).length;
}

function getActiveToolCountByCategory(catId) {
    const tools = getCurrentTools();
    return tools.filter(t => t.cat === catId && t.active !== false).length;
}

// ===== Initialize =====
function initCategories() {
    if (categoriesInitialized) return;
    categoriesInitialized = true;
    
    if (!checkAuth()) return;
    
    currentCategories = getCategories();
    
    // Set username
    const username = localStorage.getItem('aitoolcor_admin_username') || 'admin';
    setText('adminUsername', username);
    
    renderCategories();
    updateStats();
    
    console.log(`✅ Categories Manager Loaded - ${currentCategories.length} categories`);
}

// ===== Update Stats =====
function updateStats() {
    const totalCats = currentCategories.length;
    const tools = getCurrentTools();
    const totalTools = tools.length;
    const activeTools = tools.filter(t => t.active !== false).length;
    const avgTools = totalCats > 0 ? Math.round(totalTools / totalCats) : 0;
    
    setText('totalCatsCount', totalCats);
    setText('totalToolsCount', totalTools);
    setText('activeToolsCount', activeTools);
    setText('avgToolsCount', avgTools);
    setText('navCatCount', totalCats);
    setText('navToolCount', totalTools);
}

// ===== Render Categories Grid =====
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    if (currentCategories.length === 0) {
        grid.innerHTML = `
            <div class="empty-state-admin" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-folder-open"></i>
                <h3>No categories yet</h3>
                <p>Click "Add Category" to create your first one</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = currentCategories.map(cat => {
        const totalTools = getToolCountByCategory(cat.id);
        const activeTools = getActiveToolCountByCategory(cat.id);
        const inactiveTools = totalTools - activeTools;
        
        return `
            <div class="category-card">
                <div class="cat-card-header">
                    <div class="cat-card-icon ${cat.color}">
                        <i class="${cat.icon}"></i>
                    </div>
                    <div class="cat-card-emoji">${cat.emoji}</div>
                </div>
                
                <div class="cat-card-body">
                    <h3 class="cat-card-name">${cat.name}</h3>
                    <p class="cat-card-desc">${cat.desc || 'No description'}</p>
                    <div class="cat-card-id">
                        <i class="fa-solid fa-link"></i>
                        <code>${cat.id}</code>
                    </div>
                </div>
                
                <div class="cat-card-stats">
                    <div class="cat-stat">
                        <span class="cat-stat-num">${totalTools}</span>
                        <span class="cat-stat-lbl">Total</span>
                    </div>
                    <div class="cat-stat">
                        <span class="cat-stat-num text-green">${activeTools}</span>
                        <span class="cat-stat-lbl">Active</span>
                    </div>
                    <div class="cat-stat">
                        <span class="cat-stat-num text-red">${inactiveTools}</span>
                        <span class="cat-stat-lbl">Inactive</span>
                    </div>
                </div>
                
                <div class="cat-card-actions">
                    <a href="../index.html#${cat.id}" target="_blank" class="cat-action-btn view" title="View on Site">
                        <i class="fa-solid fa-eye"></i>
                        View
                    </a>
                    <button class="cat-action-btn edit" onclick="openEditCategoryModal('${cat.id}')" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>
                    <button class="cat-action-btn danger" onclick="confirmDeleteCategory('${cat.id}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Open Add Modal =====
function openAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById('catModalTitle').innerHTML = '<i class="fa-solid fa-plus"></i> Add New Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('catOriginalId').value = '';
    document.getElementById('catIcon').value = 'fa-solid fa-folder';
    
    // Default color = green
    const greenRadio = document.querySelector('input[name="catColor"][value="green"]');
    if (greenRadio) greenRadio.checked = true;
    
    updateCatPreview();
    document.getElementById('categoryModal').classList.add('show');
}

// ===== Open Edit Modal =====
function openEditCategoryModal(id) {
    const cat = currentCategories.find(c => c.id === id);
    if (!cat) return;
    
    editingCategoryId = id;
    document.getElementById('catModalTitle').innerHTML = '<i class="fa-solid fa-pen"></i> Edit Category';
    document.getElementById('catOriginalId').value = cat.id;
    document.getElementById('catName').value = cat.name;
    document.getElementById('catId').value = cat.id;
    document.getElementById('catEmoji').value = cat.emoji;
    document.getElementById('catIcon').value = cat.icon;
    document.getElementById('catDesc').value = cat.desc || '';
    
    // Set color radio
    const colorRadio = document.querySelector(`input[name="catColor"][value="${cat.color}"]`);
    if (colorRadio) colorRadio.checked = true;
    
    updateCatPreview();
    document.getElementById('categoryModal').classList.add('show');
}

// ===== Close Modal =====
function closeCategoryModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('categoryModal').classList.remove('show');
    editingCategoryId = null;
}

// ===== Generate Category ID from Name =====
function generateCatId() {
    if (editingCategoryId) return;
    
    const name = document.getElementById('catName').value;
    const id = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
    
    document.getElementById('catId').value = id;
}

// ===== Set Emoji from Picker =====
function setEmoji(emoji) {
    document.getElementById('catEmoji').value = emoji;
    updateCatPreview();
}

// ===== Live Preview =====
function updateCatPreview() {
    const name = document.getElementById('catName').value || 'Category Name';
    const emoji = document.getElementById('catEmoji').value || '📁';
    const desc = document.getElementById('catDesc').value || 'Category description here';
    const icon = document.getElementById('catIcon').value || 'fa-solid fa-folder';
    const colorRadio = document.querySelector('input[name="catColor"]:checked');
    const color = colorRadio ? colorRadio.value : 'green';
    
    const preview = document.getElementById('catPreviewCard');
    if (!preview) return;
    
    preview.innerHTML = `
        <div class="cat-preview-icon ${color}">
            <i class="${icon}"></i>
        </div>
        <div class="cat-preview-info">
            <span class="cat-preview-name">${emoji} ${name}</span>
            <span class="cat-preview-desc">${desc}</span>
        </div>
    `;
}

// ===== Save Category =====
function saveCategory(event) {
    event.preventDefault();
    
    const colorRadio = document.querySelector('input[name="catColor"]:checked');
    
    if (!colorRadio) {
        showToast('❌ Please select a color', 'error');
        return false;
    }
    
    const data = {
        id: document.getElementById('catId').value.trim(),
        name: document.getElementById('catName').value.trim(),
        emoji: document.getElementById('catEmoji').value.trim(),
        icon: document.getElementById('catIcon').value.trim(),
        color: colorRadio.value,
        desc: document.getElementById('catDesc').value.trim()
    };
    
    // Validate ID
    if (!/^[a-z0-9-]+$/.test(data.id)) {
        showToast('❌ Invalid ID! Use lowercase, numbers, hyphens only', 'error');
        return false;
    }
    
    // Check duplicate ID (only when adding new or changing ID)
    const originalId = document.getElementById('catOriginalId').value;
    const duplicate = currentCategories.find(c => c.id === data.id && c.id !== originalId);
    if (duplicate) {
        showToast('❌ Category ID already exists!', 'error');
        return false;
    }
    
    if (editingCategoryId) {
        // Update existing
        const index = currentCategories.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            // If ID changed, update all tools with old ID
            if (originalId && originalId !== data.id) {
                const tools = getCurrentTools();
                tools.forEach(t => {
                    if (t.cat === originalId) t.cat = data.id;
                });
                saveToolsData(tools);
            }
            currentCategories[index] = data;
        }
        showToast('✅ Category updated successfully!');
    } else {
        // Add new
        currentCategories.push(data);
        showToast('✅ Category added successfully!');
    }
    
    saveCategoriesData(currentCategories);
    closeCategoryModal();
    renderCategories();
    updateStats();
    
    return false;
}

// ===== Confirm Delete =====
function confirmDeleteCategory(id) {
    const cat = currentCategories.find(c => c.id === id);
    if (!cat) return;
    
    const toolCount = getToolCountByCategory(id);
    
    deletingCategoryId = id;
    
    let message = '';
    if (toolCount > 0) {
        message = `⚠️ Cannot delete "${cat.name}"!\n\nIt contains ${toolCount} tool${toolCount !== 1 ? 's' : ''}. Please move or delete these tools first.`;
        document.getElementById('deleteCatMessage').textContent = message;
        document.querySelector('#deleteCatModal .btn-modal-confirm').style.display = 'none';
    } else {
        message = `Are you sure you want to delete "${cat.name}"? This action cannot be undone.`;
        document.getElementById('deleteCatMessage').textContent = message;
        document.querySelector('#deleteCatModal .btn-modal-confirm').style.display = 'flex';
    }
    
    document.getElementById('deleteCatModal').classList.add('show');
}

function closeDeleteCatModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('deleteCatModal').classList.remove('show');
    deletingCategoryId = null;
    document.querySelector('#deleteCatModal .btn-modal-confirm').style.display = 'flex';
}

// ===== Perform Delete =====
function performDeleteCategory() {
    if (!deletingCategoryId) return;
    
    const cat = currentCategories.find(c => c.id === deletingCategoryId);
    const toolCount = getToolCountByCategory(deletingCategoryId);
    
    // Safety check
    if (toolCount > 0) {
        showToast('❌ Cannot delete category with tools!', 'error');
        closeDeleteCatModal();
        return;
    }
    
    const catName = cat ? cat.name : 'Category';
    currentCategories = currentCategories.filter(c => c.id !== deletingCategoryId);
    saveCategoriesData(currentCategories);
    
    showToast(`🗑️ "${catName}" deleted`);
    closeDeleteCatModal();
    renderCategories();
    updateStats();
}

// ===== Reset to Default =====
function resetCategoriesToDefault() {
    if (!confirm('Reset all categories to default? Your changes will be lost!')) return;
    
    resetCategoriesData();
    currentCategories = [...DEFAULT_CATEGORIES];
    renderCategories();
    updateStats();
    showToast('🔄 Categories reset to default!');
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
        closeCategoryModal();
        closeDeleteCatModal();
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

window.openAddCategoryModal = openAddCategoryModal;
window.openEditCategoryModal = openEditCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.saveCategory = saveCategory;
window.confirmDeleteCategory = confirmDeleteCategory;
window.closeDeleteCatModal = closeDeleteCatModal;
window.performDeleteCategory = performDeleteCategory;
window.resetCategoriesToDefault = resetCategoriesToDefault;
window.updateCatPreview = updateCatPreview;
window.generateCatId = generateCatId;
window.setEmoji = setEmoji;

// ===== Initialize =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategories);
} else {
    initCategories();
}
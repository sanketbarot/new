// ================================================
// AI ToolCor Admin - Tools Manager
// ================================================

'use strict';

let currentTools = [];
let filteredTools = [];
let selectedIds = new Set();
let editingToolId = null;
let deletingToolId = null;
let toolsInitialized = false;

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

// ===== Initialize =====
function initTools() {
    if (toolsInitialized) return;
    toolsInitialized = true;
    
    if (!checkAuth()) return;
    
    // Load tools
    currentTools = getCurrentTools();
    
    // Ensure all tools have 'active' field
    currentTools.forEach(t => {
        if (typeof t.active === 'undefined') t.active = true;
    });
    
    filteredTools = [...currentTools];
    
    // Set username
    const username = localStorage.getItem('aitoolcor_admin_username') || 'admin';
    setText('adminUsername', username);
    
    renderTable();
    updateStats();
    
    console.log(`✅ Tools Manager Loaded - ${currentTools.length} tools`);
}

// ===== Update Stats =====
function updateStats() {
    const total = currentTools.length;
    const active = currentTools.filter(t => t.active !== false).length;
    const inactive = total - active;
    const popular = currentTools.filter(t => t.popular).length;
    const newTools = currentTools.filter(t => t.isNew).length;
    const cats = [...new Set(currentTools.map(t => t.cat))].length;
    
    setText('totalCount', total);
    setText('activeCount', active);
    setText('inactiveCount', inactive);
    setText('popularCount', popular);
    setText('newCount', newTools);
    setText('catCount', cats);
    setText('selectedCount', selectedIds.size);
    setText('navToolCount', total);
    setText('totalShowing', total);
    setText('showingCount', filteredTools.length);
}

// ===== Render Table =====
function renderTable() {
    const tbody = document.getElementById('toolsTableBody');
    const empty = document.getElementById('emptyState');
    const tableWrap = document.querySelector('.table-wrapper-admin');
    
    if (!tbody) return;
    
    if (filteredTools.length === 0) {
        tbody.innerHTML = '';
        if (empty) empty.style.display = 'block';
        if (tableWrap) tableWrap.style.display = 'none';
        return;
    }
    
    if (empty) empty.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';
    
    tbody.innerHTML = filteredTools.map(tool => {
        const isSelected = selectedIds.has(tool.id);
        const isActive = tool.active !== false;
        
        return `
            <tr class="${isSelected ? 'selected' : ''} ${!isActive ? 'inactive-row' : ''}" data-id="${tool.id}">
                <td class="col-check">
                    <label class="check-wrap">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} 
                               onchange="toggleSelect(${tool.id})">
                        <span class="check-mark"></span>
                    </label>
                </td>
                <td class="col-id">${tool.id}</td>
                <td class="col-icon">
                    <div class="table-icon ${tool.color}">
                        <i class="${tool.icon}"></i>
                    </div>
                </td>
                <td class="col-name">
                    <div class="table-name">${tool.name}</div>
                    <div class="table-slug">/${tool.slug}</div>
                </td>
                <td class="col-cat">
                    <span class="tag ${tool.color}">${tool.cat.replace('-', ' ')}</span>
                </td>
                <td class="col-status">
                    <div class="status-toggles">
                        <button class="status-toggle ${tool.popular ? 'active popular' : ''}" 
                                onclick="toggleStatus(${tool.id}, 'popular')" 
                                title="Toggle Popular">
                            <i class="fa-solid fa-fire"></i>
                        </button>
                        <button class="status-toggle ${tool.isNew ? 'active new' : ''}" 
                                onclick="toggleStatus(${tool.id}, 'isNew')" 
                                title="Toggle New">
                            <i class="fa-solid fa-sparkles"></i>
                        </button>
                    </div>
                </td>
                <td class="col-active">
                    <label class="switch" title="${isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}">
                        <input type="checkbox" ${isActive ? 'checked' : ''} 
                               onchange="toggleActive(${tool.id})">
                        <span class="switch-slider"></span>
                    </label>
                </td>
                <td class="col-actions">
                    <div class="row-actions">
                        <a href="../pages/${tool.cat}/${tool.slug}.html" target="_blank" 
                           class="row-action-btn view" title="View">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                        <button class="row-action-btn" onclick="openEditModal(${tool.id})" title="Edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="row-action-btn danger" onclick="confirmDelete(${tool.id})" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    updateStats();
}

// ===== Toggle Active/Inactive =====
function toggleActive(id) {
    const tool = currentTools.find(t => t.id === id);
    if (!tool) return;
    
    // Default true if undefined
    if (typeof tool.active === 'undefined') tool.active = true;
    
    tool.active = !tool.active;
    saveToolsData(currentTools);
    renderTable();
    
    const status = tool.active ? '✅ Active' : '❌ Inactive';
    showToast(`${tool.name} is now ${status}`);
}

// ===== Toggle Status (Popular/New) =====
function toggleStatus(id, field) {
    const tool = currentTools.find(t => t.id === id);
    if (!tool) return;
    
    tool[field] = !tool[field];
    saveToolsData(currentTools);
    renderTable();
    
    const status = tool[field] ? 'enabled' : 'disabled';
    const fieldName = field === 'isNew' ? 'New' : 'Popular';
    showToast(`✅ ${fieldName} ${status} for ${tool.name}`);
}

// ===== Filter Tools =====
function filterTools() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const cat = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortBy').value;
    
    // Show/hide clear search
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) clearBtn.style.display = search ? 'flex' : 'none';
    
    filteredTools = currentTools.filter(t => {
        // Search
        if (search && !t.name.toLowerCase().includes(search) && 
            !t.desc.toLowerCase().includes(search)) return false;
        
        // Category
        if (cat !== 'all' && t.cat !== cat) return false;
        
        // Status
        const isActive = t.active !== false;
        if (status === 'active' && !isActive) return false;
        if (status === 'inactive' && isActive) return false;
        if (status === 'popular' && !t.popular) return false;
        if (status === 'new' && !t.isNew) return false;
        if (status === 'regular' && (t.popular || t.isNew)) return false;
        
        return true;
    });
    
    // Sort
    filteredTools.sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'cat') return a.cat.localeCompare(b.cat);
        return a.id - b.id;
    });
    
    renderTable();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterTools();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('sortBy').value = 'id';
    filterTools();
}

// ===== Selection =====
function toggleSelect(id) {
    if (selectedIds.has(id)) {
        selectedIds.delete(id);
    } else {
        selectedIds.add(id);
    }
    updateBulkUI();
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) row.classList.toggle('selected');
}

function toggleSelectAll() {
    const checked = document.getElementById('selectAll').checked;
    if (checked) {
        filteredTools.forEach(t => selectedIds.add(t.id));
    } else {
        selectedIds.clear();
    }
    renderTable();
    updateBulkUI();
}

function clearSelection() {
    selectedIds.clear();
    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.checked = false;
    renderTable();
    updateBulkUI();
}

function updateBulkUI() {
    const bulkActions = document.getElementById('bulkActions');
    const bulkText = document.getElementById('bulkSelectedText');
    
    if (selectedIds.size > 0) {
        if (bulkActions) bulkActions.style.display = 'flex';
        if (bulkText) bulkText.textContent = `${selectedIds.size} selected`;
    } else {
        if (bulkActions) bulkActions.style.display = 'none';
    }
    updateStats();
}

// ===== Bulk Action =====
function bulkAction(action) {
    if (selectedIds.size === 0) return;
    
    currentTools.forEach(t => {
        if (selectedIds.has(t.id)) {
            if (action === 'popular') t.popular = true;
            if (action === 'unpopular') t.popular = false;
            if (action === 'new') t.isNew = true;
            if (action === 'activate') t.active = true;
            if (action === 'deactivate') t.active = false;
        }
    });
    
    saveToolsData(currentTools);
    
    let actionText = action;
    if (action === 'activate') actionText = 'activated';
    else if (action === 'deactivate') actionText = 'deactivated';
    else if (action === 'unpopular') actionText = 'removed from popular';
    else actionText = `marked as ${action}`;
    
    showToast(`✅ ${selectedIds.size} tools ${actionText}`);
    clearSelection();
    filterTools();
}

function bulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} tools? This cannot be undone.`)) return;
    
    const count = selectedIds.size;
    currentTools = currentTools.filter(t => !selectedIds.has(t.id));
    saveToolsData(currentTools);
    showToast(`🗑️ ${count} tools deleted`);
    clearSelection();
    filterTools();
}

// ===== Add Tool Modal =====
function openAddModal() {
    editingToolId = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-plus"></i> Add New Tool';
    document.getElementById('toolForm').reset();
    document.getElementById('toolId').value = '';
    document.getElementById('toolIcon').value = 'fa-solid fa-calculator';
    document.getElementById('toolColor').value = 'green';
    document.getElementById('toolCat').value = 'finance';
    document.getElementById('toolActive').checked = true;
    document.getElementById('toolPopular').checked = false;
    document.getElementById('toolNew').checked = false;
    updatePreview();
    document.getElementById('toolModal').classList.add('show');
}

// ===== Edit Tool Modal =====
function openEditModal(id) {
    const tool = currentTools.find(t => t.id === id);
    if (!tool) return;
    
    editingToolId = id;
    document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-pen"></i> Edit Tool';
    document.getElementById('toolId').value = tool.id;
    document.getElementById('toolName').value = tool.name;
    document.getElementById('toolSlug').value = tool.slug;
    document.getElementById('toolDesc').value = tool.desc;
    document.getElementById('toolCat').value = tool.cat;
    document.getElementById('toolColor').value = tool.color;
    document.getElementById('toolIcon').value = tool.icon;
    document.getElementById('toolActive').checked = tool.active !== false;
    document.getElementById('toolPopular').checked = tool.popular || false;
    document.getElementById('toolNew').checked = tool.isNew || false;
    
    updatePreview();
    document.getElementById('toolModal').classList.add('show');
}

function closeToolModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('toolModal').classList.remove('show');
    editingToolId = null;
}

// ===== Generate Slug =====
function generateSlug() {
    if (editingToolId) return; // Don't auto-update slug when editing
    
    const name = document.getElementById('toolName').value;
    const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
    
    document.getElementById('toolSlug').value = slug;
}

// ===== Live Preview =====
function updatePreview() {
    const name = document.getElementById('toolName').value || 'Tool Name';
    const desc = document.getElementById('toolDesc').value || 'Tool description appears here...';
    const color = document.getElementById('toolColor').value;
    const icon = document.getElementById('toolIcon').value || 'fa-solid fa-calculator';
    
    const previewCard = document.getElementById('previewCard');
    if (!previewCard) return;
    
    previewCard.innerHTML = `
        <div class="tool-card-icon ${color}">
            <i class="${icon}"></i>
        </div>
        <div>
            <div class="tool-card-name">${name}</div>
            <div class="tool-card-desc">${desc}</div>
        </div>
    `;
}

// ===== Save Tool =====
function saveTool(event) {
    event.preventDefault();
    
    const data = {
        id: editingToolId || Math.max(...currentTools.map(t => t.id), 0) + 1,
        name: document.getElementById('toolName').value.trim(),
        slug: document.getElementById('toolSlug').value.trim(),
        desc: document.getElementById('toolDesc').value.trim(),
        cat: document.getElementById('toolCat').value,
        color: document.getElementById('toolColor').value,
        icon: document.getElementById('toolIcon').value.trim(),
        active: document.getElementById('toolActive').checked,
        popular: document.getElementById('toolPopular').checked,
        isNew: document.getElementById('toolNew').checked
    };
    
    // Validate slug
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
        showToast('❌ Invalid slug! Use lowercase, numbers, hyphens only', 'error');
        return false;
    }
    
    // Check duplicate slug
    const duplicate = currentTools.find(t => t.slug === data.slug && t.id !== data.id);
    if (duplicate) {
        showToast('❌ Slug already exists!', 'error');
        return false;
    }
    
    if (editingToolId) {
        // Update
        const index = currentTools.findIndex(t => t.id === editingToolId);
        if (index !== -1) currentTools[index] = data;
        showToast('✅ Tool updated successfully!');
    } else {
        // Add new
        currentTools.push(data);
        showToast('✅ Tool added successfully!');
    }
    
    saveToolsData(currentTools);
    closeToolModal();
    filterTools();
    
    return false;
}

// ===== Delete Tool =====
function confirmDelete(id) {
    const tool = currentTools.find(t => t.id === id);
    if (!tool) return;
    
    deletingToolId = id;
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete "${tool.name}"? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('deleteModal').classList.remove('show');
    deletingToolId = null;
}

function performDelete() {
    if (!deletingToolId) return;
    
    const tool = currentTools.find(t => t.id === deletingToolId);
    const toolName = tool ? tool.name : 'Tool';
    
    currentTools = currentTools.filter(t => t.id !== deletingToolId);
    saveToolsData(currentTools);
    
    showToast(`🗑️ "${toolName}" deleted`);
    closeDeleteModal();
    selectedIds.delete(deletingToolId);
    filterTools();
}

// ===== Reset to Defaults =====
function resetToDefaults() {
    if (!confirm('Reset all tools to default? Your changes will be lost!')) return;
    
    resetToolsData();
    currentTools = [...ALL_TOOLS];
    
    // Ensure active field
    currentTools.forEach(t => {
        if (typeof t.active === 'undefined') t.active = true;
    });
    
    filteredTools = [...currentTools];
    selectedIds.clear();
    renderTable();
    showToast('🔄 Reset to defaults!');
}

// ===== Export Data =====
function exportData() {
    const dataStr = JSON.stringify(currentTools, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aitoolcor-tools-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Data exported!');
}

// ===== Import Data =====
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) throw new Error('Invalid format');
            
            if (!confirm(`Import ${data.length} tools? Current data will be replaced.`)) return;
            
            currentTools = data;
            
            // Ensure active field
            currentTools.forEach(t => {
                if (typeof t.active === 'undefined') t.active = true;
            });
            
            saveToolsData(currentTools);
            filterTools();
            showToast(`✅ Imported ${data.length} tools!`);
        } catch (err) {
            showToast('❌ Invalid JSON file', 'error');
            console.error('Import error:', err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
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

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeToolModal();
        closeDeleteModal();
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
window.filterTools = filterTools;
window.clearSearch = clearSearch;
window.resetFilters = resetFilters;
window.toggleStatus = toggleStatus;
window.toggleActive = toggleActive;
window.toggleSelect = toggleSelect;
window.toggleSelectAll = toggleSelectAll;
window.clearSelection = clearSelection;
window.bulkAction = bulkAction;
window.bulkDelete = bulkDelete;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeToolModal = closeToolModal;
window.generateSlug = generateSlug;
window.updatePreview = updatePreview;
window.saveTool = saveTool;
window.confirmDelete = confirmDelete;
window.closeDeleteModal = closeDeleteModal;
window.performDelete = performDelete;
window.resetToDefaults = resetToDefaults;
window.exportData = exportData;
window.importData = importData;

// ===== Initialize =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTools);
} else {
    initTools();
}
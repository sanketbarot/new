// ================================================
// AI ToolCor Admin - Authentication (Login Page Only)
// ================================================

'use strict';

// ===== Default Credentials =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'aitoolcor@2024'
};

// ===== Check if Already Logged In (ONLY for login page) =====
function checkAuthOnLoginPage() {
    // Only check if we're on login page
    if (!window.location.pathname.includes('login.html')) {
        return false;
    }
    
    const isLoggedIn = localStorage.getItem('aitoolcor_admin_auth');
    const loginTime = localStorage.getItem('aitoolcor_admin_login_time');
    
    if (isLoggedIn === 'true' && loginTime) {
        const now = Date.now();
        const hoursPassed = (now - parseInt(loginTime)) / (1000 * 60 * 60);
        
        if (hoursPassed < 24) {
            // Already logged in, go to dashboard
            window.location.replace('dashboard.html');
            return true;
        } else {
            // Session expired
            clearAuth();
        }
    }
    return false;
}

// ===== Clear Auth Data =====
function clearAuth() {
    localStorage.removeItem('aitoolcor_admin_auth');
    localStorage.removeItem('aitoolcor_admin_login_time');
    localStorage.removeItem('aitoolcor_admin_username');
    localStorage.removeItem('aitoolcor_admin_remember');
}

// ===== Handle Login =====
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    // Hide previous error
    errorMsg.style.display = 'none';
    
    // Validate
    if (!username || !password) {
        showError('Please enter username and password');
        return false;
    }
    
    // Show loader
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    loginBtn.disabled = true;
    
    // Get saved credentials (or default)
    const savedCreds = JSON.parse(localStorage.getItem('aitoolcor_admin_creds')) || ADMIN_CREDENTIALS;
    
    // Simulate API delay
    setTimeout(() => {
        if (username === savedCreds.username && password === savedCreds.password) {
            // Success!
            localStorage.setItem('aitoolcor_admin_auth', 'true');
            localStorage.setItem('aitoolcor_admin_login_time', Date.now().toString());
            localStorage.setItem('aitoolcor_admin_username', username);
            
            if (rememberMe) {
                localStorage.setItem('aitoolcor_admin_remember', 'true');
            }
            
            showToast('✅ Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.replace('dashboard.html');
            }, 1000);
            
        } else {
            // Failed
            showError('Invalid username or password!');
            
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
            
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    }, 800);
    
    return false;
}

// ===== Show Error =====
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    const errorText = document.getElementById('errorText');
    if (!errorMsg || !errorText) return;
    
    errorText.textContent = message;
    errorMsg.style.display = 'flex';
    
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

// ===== Toggle Password =====
function togglePassword() {
    const password = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (!password || !eyeIcon) return;
    
    if (password.type === 'password') {
        password.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        password.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye';
    }
}

// ===== Forgot Password Info =====
function showForgotInfo() {
    showToast('💡 Default: admin / aitoolcor@2024', 'success', 4000);
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

// ===== Logout Function (used in other admin pages) =====
function logout() {
    clearAuth();
    sessionStorage.setItem('justLoggedOut', 'true');
    window.location.replace('login.html');
}

// ===== Initialize (ONLY on login page) =====
document.addEventListener('DOMContentLoaded', () => {
    // Only run on login page
    if (window.location.pathname.includes('login.html')) {
        if (!sessionStorage.getItem('justLoggedOut')) {
            checkAuthOnLoginPage();
        }
        sessionStorage.removeItem('justLoggedOut');
        console.log('🔐 Admin Login Page Loaded');
    }
});

// Make functions globally available
window.handleLogin = handleLogin;
window.togglePassword = togglePassword;
window.showForgotInfo = showForgotInfo;
window.logout = logout;
window.clearAuth = clearAuth;
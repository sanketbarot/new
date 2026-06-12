// ================================================
// AI ToolCor Admin - Authentication
// ================================================

// ===== Default Credentials =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'aitoolcor@2024'
};

// ===== Check if Already Logged In =====
function checkAuth() {
    const isLoggedIn = localStorage.getItem('aitoolcor_admin_auth');
    const loginTime = localStorage.getItem('aitoolcor_admin_login_time');
    
    if (isLoggedIn === 'true' && loginTime) {
        const now = Date.now();
        const loginDate = parseInt(loginTime);
        const hoursPassed = (now - loginDate) / (1000 * 60 * 60);
        
        // Session valid for 24 hours
        if (hoursPassed < 24) {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            return true;
        } else {
            // Session expired
            logout();
        }
    }
    return false;
}

// ===== Handle Login =====
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorMsg = document.getElementById('errorMsg');
    const errorText = document.getElementById('errorText');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    // Hide previous error
    errorMsg.style.display = 'none';
    
    // Validate empty
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
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            // Failed
            showError('Invalid username or password!');
            
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
            
            // Clear password
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
    
    errorText.textContent = message;
    errorMsg.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

// ===== Toggle Password =====
function togglePassword() {
    const password = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
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
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===== Logout Function (used in other pages) =====
function logout() {
    localStorage.removeItem('aitoolcor_admin_auth');
    localStorage.removeItem('aitoolcor_admin_login_time');
    localStorage.removeItem('aitoolcor_admin_username');
    window.location.href = 'login.html';
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Enter to submit
    if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
        const form = document.getElementById('loginForm');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
});

// ===== Check Auth on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    // Don't auto-redirect if user just logged out
    if (!sessionStorage.getItem('justLoggedOut')) {
        checkAuth();
    }
    sessionStorage.removeItem('justLoggedOut');
    
    console.log('🔐 Admin Login Page Loaded');
});
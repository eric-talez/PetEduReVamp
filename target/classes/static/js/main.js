// PetEdu Platform JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Alpine.js global data
    window.sidebarOpen = false;
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip absolute bg-gray-900 text-white text-sm rounded py-1 px-2 z-50';
    tooltip.textContent = tooltipText;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('[data-mobile-menu]');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            window.sidebarOpen = !window.sidebarOpen;
        });
    }
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('data-field-name') || field.name;
    let errorMessage = '';
    
    // Remove existing error
    removeFieldError(field);
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${fieldName}은(는) 필수 입력 항목입니다.`;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        errorMessage = '올바른 이메일 주소를 입력해주세요.';
    }
    
    // Password validation
    if (field.type === 'password' && value && value.length < 8) {
        errorMessage = '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        errorMessage = '올바른 전화번호를 입력해주세요.';
    }
    
    if (errorMessage) {
        showFieldError(field, errorMessage);
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function removeFieldError(field) {
    field.classList.remove('border-red-500');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+82|0)([1-9]\d{1,2})-?\d{3,4}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-lg">&times;</button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.className = 'fixed top-20 right-4 z-50 space-y-2';
    document.body.appendChild(container);
    return container;
}

function showLoader(show = true) {
    let loader = document.getElementById('global-loader');
    
    if (show && !loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    } else if (!show && loader) {
        loader.remove();
    }
}

// API utility functions
async function apiRequest(url, options = {}) {
    showLoader(true);
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showLoader(false);
        return data;
    } catch (error) {
        showLoader(false);
        showAlert('요청 처리 중 오류가 발생했습니다.', 'error');
        throw error;
    }
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showAlert('예기치 않은 오류가 발생했습니다.', 'error');
});

// Exposure to global scope for use in templates
window.PetEdu = {
    showAlert,
    showLoader,
    apiRequest,
    validateForm,
    validateField
};
document.addEventListener('DOMContentLoaded', function() {
  initSidebar();
  initNavigation();
  initForms();
  initTooltips();
});

function initSidebar() {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      if (overlay) {
        overlay.classList.toggle('active');
      }
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
}

function initForms() {
  const forms = document.querySelectorAll('form[data-validate="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
  });
  
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.addEventListener('blur', function() {
      validateField(this);
    });
    
    control.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const formControls = form.querySelectorAll('.form-control[required]');
  
  formControls.forEach(control => {
    if (!validateField(control)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const isRequired = field.hasAttribute('required');
  let isValid = true;
  let errorMessage = '';
  
  if (isRequired && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  } else if (field.type === 'tel' && value) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  } else if (field.minLength > 0 && value.length < field.minLength) {
    isValid = false;
    errorMessage = `Minimum length is ${field.minLength} characters`;
  }
  
  const existingError = field.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  if (!isValid) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-danger mt-1 small';
    errorDiv.textContent = errorMessage;
    field.parentElement.appendChild(errorDiv);
  } else {
    field.classList.remove('error');
  }
  
  return isValid;
}

function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      showTooltip(this);
    });
    
    element.addEventListener('mouseleave', function() {
      hideTooltip(this);
    });
  });
}

function showTooltip(element) {
  const tooltipText = element.getAttribute('data-tooltip');
  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  tooltip.textContent = tooltipText;
  tooltip.style.cssText = `
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    z-index: 9999;
    pointer-events: none;
  `;
  
  document.body.appendChild(tooltip);
  
  const rect = element.getBoundingClientRect();
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
  tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
  
  element._tooltip = tooltip;
}

function hideTooltip(element) {
  if (element._tooltip) {
    element._tooltip.remove();
    delete element._tooltip;
  }
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

window.showAlert = showAlert;
window.confirmAction = confirmAction;

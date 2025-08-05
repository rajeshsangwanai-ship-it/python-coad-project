// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initGlobalMarkets();
    initLanguageSelector();
    initMobileMenu();
    initScrollToTop();
    initLazyLoading();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes and observe elements
    const animatedElements = document.querySelectorAll('.section-header, .category-card, .service-card, .testimonial-card, .about-text, .about-image');
    
    animatedElements.forEach((el, index) => {
        // Add staggered animation delay
        el.style.transitionDelay = `${index * 0.1}s`;
        
        // Add appropriate animation class
        if (index % 2 === 0) {
            el.classList.add('fade-in');
        } else {
            el.classList.add('slide-in-left');
        }
        
        observer.observe(el);
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showNotification('Thank you for your inquiry! We will contact you within 24 hours.', 'success');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const required = ['firstName', 'lastName', 'email', 'company', 'country', 'message'];
    const errors = [];
    
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Global markets interactive functionality
function initGlobalMarkets() {
    const pins = document.querySelectorAll('.pin');
    const marketInfos = document.querySelectorAll('.market-info');
    
    pins.forEach(pin => {
        pin.addEventListener('click', function() {
            const market = this.getAttribute('data-market');
            
            // Remove active class from all market infos
            marketInfos.forEach(info => info.classList.remove('active'));
            
            // Add active class to selected market info
            const targetInfo = document.querySelector(`.market-info[data-market="${market}"]`);
            if (targetInfo) {
                targetInfo.classList.add('active');
            }
            
            // Update pin styles
            pins.forEach(p => p.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.2)';
        });
        
        // Hover effects
        pin.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        pin.addEventListener('mouseleave', function() {
            if (!this.style.transform.includes('1.2')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// Language selector functionality
function initLanguageSelector() {
    const langOptions = document.querySelectorAll('.lang-option');
    
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            const lang = this.getAttribute('data-lang');
            const href = this.getAttribute('href');
            
            // Update active language
            langOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Store language preference
            localStorage.setItem('preferredLanguage', lang);
            
            // Show notification about language change
            showNotification(`Language changed to ${this.textContent}. Redirecting...`, 'info');
            
            // Simulate redirect (in real implementation, this would redirect to the localized version)
            setTimeout(() => {
                // window.location.href = href;
                console.log(`Would redirect to: ${href}`);
            }, 1500);
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        const savedOption = document.querySelector(`[data-lang="${savedLang}"]`);
        if (savedOption) {
            langOptions.forEach(opt => opt.classList.remove('active'));
            savedOption.classList.add('active');
        }
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.remove();
            }
        }, 300);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const debouncedScroll = debounce(function() {
    // Handle scroll events
}, 16);

const throttledResize = throttle(function() {
    // Handle resize events
}, 250);

window.addEventListener('scroll', debouncedScroll);
window.addEventListener('resize', throttledResize);

// Analytics and tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, properties);
}

// Track important interactions
document.addEventListener('click', function(e) {
    const element = e.target.closest('button, a');
    if (element) {
        const elementText = element.textContent.trim();
        const elementClass = element.className;
        
        if (elementText && elementClass) {
            trackEvent('click', {
                element_text: elementText,
                element_class: elementClass
            });
        }
    }
});

// Track form submissions
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.id) {
        trackEvent('form_submit', {
            form_id: form.id
        });
    }
});

// Track language changes
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lang-option')) {
        const language = e.target.getAttribute('data-lang');
        trackEvent('language_change', {
            language: language
        });
    }
});

// International features
function detectUserCountry() {
    // This would typically use an IP geolocation service
    // For demo purposes, we'll use a placeholder
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const country = data.country_code;
            const countryName = data.country_name;
            
            // Show relevant market information
            showCountrySpecificContent(country, countryName);
        })
        .catch(error => {
            console.log('Could not detect user location:', error);
        });
}

function showCountrySpecificContent(countryCode, countryName) {
    // Show country-specific pricing, contact info, etc.
    const marketMappings = {
        'US': 'usa',
        'CA': 'usa',
        'GB': 'europe',
        'DE': 'europe',
        'FR': 'europe',
        'AE': 'middle-east',
        'SA': 'middle-east',
        'AU': 'asia',
        'SG': 'asia'
    };
    
    const market = marketMappings[countryCode];
    if (market) {
        // Highlight relevant market section
        const marketPin = document.querySelector(`[data-market="${market}"]`);
        if (marketPin) {
            marketPin.click();
        }
        
        // Show country-specific notification
        setTimeout(() => {
            showNotification(`Welcome visitor from ${countryName}! We serve your region with localized support.`, 'info');
        }, 2000);
    }
}

// Initialize country detection
setTimeout(detectUserCountry, 1000);

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export functions for testing or external use
window.RajeshSangwanExports = {
    showNotification,
    trackEvent,
    validateForm,
    isValidEmail
};
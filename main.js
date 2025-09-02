// Mobile menu toggle with touch support
document.getElementById('mobile-menu-btn').addEventListener('click', function (e) {
    e.preventDefault();
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBtn = document.getElementById('mobile-menu-btn');

    if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Smooth scrolling for navigation links with mobile optimization
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    const navHeight = window.innerWidth < 1024 ? 64 : 64; // Adjust for mobile
    const elementPosition = element.offsetTop - navHeight - 20; // Add extra padding

    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

// Add click handlers to navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        scrollToSection(sectionId);

        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Update active navigation link on scroll
window.addEventListener('scroll', function () {
    const sections = ['home', 'about', 'services', 'projects', 'contact'];
    const navHeight = 64;

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (section && navLink) {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('text-dp-navy');
                    link.classList.add('text-dp-charcoal');
                });

                // Add active class to current nav link
                navLink.classList.remove('text-dp-charcoal');
                navLink.classList.add('text-dp-navy');
            }
        }
    });
});

// Contact form submission with Formspree
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the submit button and show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    submitBtn.disabled = true;

    // Get form data
    const formData = new FormData(this);

    // Send to Formspree
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Success
                showNotification('Thank you for your message! We will contact you within 24 hours to discuss your gas and energy needs.', 'success');

                // Clear form fields
                this.reset();

                // Reset any custom styling or validation states
                this.querySelectorAll('.border-red-500').forEach(field => {
                    field.classList.remove('border-red-500');
                    field.classList.add('border-gray-300');
                });

                // Remove any error messages
                this.querySelectorAll('.error-message').forEach(msg => msg.remove());

            } else {
                // Handle different HTTP status codes
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error('Something went wrong. Please try again.');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification(error.message || 'Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
});

// Add form validation feedback
document.getElementById('contact-form').addEventListener('input', function (e) {
    const field = e.target;
    const errorMessage = field.parentNode.querySelector('.error-message');

    // Remove error styling on input
    if (field.classList.contains('border-red-500')) {
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-300');
    }

    // Remove error message if it exists
    if (errorMessage) {
        errorMessage.remove();
    }
});

// Add form validation on blur
document.getElementById('contact-form').addEventListener('blur', function (e) {
    const field = e.target;

    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
    } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'Please enter a valid email address');
    } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        showFieldError(field, 'Please enter a valid phone number');
    }
}, true);

// Helper function to show field errors
function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error styling
    field.classList.remove('border-gray-300');
    field.classList.add('border-red-500');

    // Create and add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper (basic South African format)
function isValidPhone(phone) {
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;

    // Set notification styles based on type
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
    } else if (type === 'error') {
        notification.className += ' bg-red-500 text-white';
    } else {
        notification.className += ' bg-blue-500 text-white';
    }

    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('section > div').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Scroll to Top Button Functionality
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide button based on scroll position
window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.remove('opacity-0', 'invisible');
        scrollToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        scrollToTopBtn.classList.add('opacity-0', 'invisible');
        scrollToTopBtn.classList.remove('opacity-100', 'visible');
    }
});

// Smooth scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add touch support for mobile devices
scrollToTopBtn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    this.style.transform = 'scale(0.95)';
});

scrollToTopBtn.addEventListener('touchend', function (e) {
    e.preventDefault();
    this.style.transform = 'scale(1)';
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced JavaScript for DP ENERGIES with comprehensive error handling
(function () {
    'use strict';

    // Initialize all functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeMobileMenu();
        initializeNavigation();
        initializeContactForm();
        initializeScrollEffects();
        initializeScrollToTop();
    });

    // Mobile menu functionality
    function initializeMobileMenu() {
        try {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    mobileMenu.classList.toggle('hidden');
                });

                // Close mobile menu when clicking outside
                document.addEventListener('click', function (e) {
                    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            }
        } catch (error) {
            console.warn('Mobile menu initialization failed:', error);
        }
    }

    // Navigation and smooth scrolling
    function initializeNavigation() {
        try {
            // Smooth scrolling function
            function scrollToSection(sectionId) {
                const element = document.getElementById(sectionId);
                if (!element) return;

                const navHeight = 64;
                const elementPosition = element.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }

            // Make scrollToSection available globally
            window.scrollToSection = scrollToSection;

            // Add click handlers to navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('href').substring(1);
                    scrollToSection(sectionId);

                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.add('hidden');
                    }
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
                                link.classList.remove('text-dp-orange');
                                link.classList.add('text-dp-charcoal');
                            });

                            // Add active class to current nav link
                            navLink.classList.remove('text-dp-charcoal');
                            navLink.classList.add('text-dp-orange');
                        }
                    }
                });
            });
        } catch (error) {
            console.warn('Navigation initialization failed:', error);
        }
    }

    // Contact form handling
    function initializeContactForm() {
        try {
            const contactForm = document.getElementById('contact-form');
            if (!contactForm) return;

            // Form submission
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const submitBtn = this.querySelector('button[type="submit"]');
                if (!submitBtn) return;

                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
                submitBtn.disabled = true;

                const formData = new FormData(this);

                fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            showNotification('Thank you for your message! We will contact you within 24 hours to discuss your gas and energy needs.', 'success');
                            this.reset();
                            clearFormErrors(this);
                        } else {
                            throw new Error('Failed to send message. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Form submission error:', error);
                        showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
                    })
                    .finally(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
            });

            // Form validation
            contactForm.addEventListener('input', function (e) {
                clearFieldError(e.target);
            });

            contactForm.addEventListener('blur', function (e) {
                validateField(e.target);
            }, true);

        } catch (error) {
            console.warn('Contact form initialization failed:', error);
        }
    }

    // Scroll effects with Intersection Observer
    function initializeScrollEffects() {
        try {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0px)';
                    }
                });
            }, observerOptions);

            // Observe sections for animation
            document.querySelectorAll('section > div').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        } catch (error) {
            console.warn('Scroll effects initialization failed:', error);
        }
    }

    // Scroll to top button
    function initializeScrollToTop() {
        try {
            const scrollToTopBtn = document.getElementById('scroll-to-top');
            if (!scrollToTopBtn) return;

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

            // Click handler
            scrollToTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Touch support
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
        } catch (error) {
            console.warn('Scroll to top initialization failed:', error);
        }
    }

    // Helper functions
    function clearFieldError(field) {
        try {
            if (field.classList.contains('border-red-500')) {
                field.classList.remove('border-red-500');
                field.classList.add('border-gray-300');
            }

            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        } catch (error) {
            console.warn('Error clearing field error:', error);
        }
    }

    function validateField(field) {
        try {
            if (field.hasAttribute('required') && !field.value.trim()) {
                showFieldError(field, 'This field is required');
            } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
            } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
            }
        } catch (error) {
            console.warn('Error validating field:', error);
        }
    }

    function showFieldError(field, message) {
        try {
            clearFieldError(field);

            field.classList.remove('border-gray-300');
            field.classList.add('border-red-500');

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-sm mt-1';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } catch (error) {
            console.warn('Error showing field error:', error);
        }
    }

    function clearFormErrors(form) {
        try {
            form.querySelectorAll('.border-red-500').forEach(field => {
                field.classList.remove('border-red-500');
                field.classList.add('border-gray-300');
            });
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
        } catch (error) {
            console.warn('Error clearing form errors:', error);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function showNotification(message, type = 'info') {
        try {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(notification => notification.remove());

            const notification = document.createElement('div');
            let bgClass = 'bg-blue-500';
            let iconClass = 'fa-info-circle';

            if (type === 'success') {
                bgClass = 'bg-green-500';
                iconClass = 'fa-check-circle';
            } else if (type === 'error') {
                bgClass = 'bg-red-500';
                iconClass = 'fa-exclamation-circle';
            }

            notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full ${bgClass} text-white`;

            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${iconClass} mr-3"></i>
                    <span>${message}</span>
                </div>
            `;

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
        } catch (error) {
            console.warn('Error showing notification:', error);
            // Fallback to alert
            alert(message);
        }
    }

})();

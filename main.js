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

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Show success message
    alert('Thank you for your message! We will contact you within 24 hours to discuss your gas and energy needs.');

    // Reset form
    this.reset();
});

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

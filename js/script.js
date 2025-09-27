// Enhanced Navigation and Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('.section');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Animate hamburger menu
        const lines = mobileMenuBtn.querySelectorAll('div');
        if (mobileMenu.classList.contains('hidden')) {
            // Reset to hamburger
            lines[0].style.transform = 'rotate(0) translateY(0)';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'rotate(0) translateY(0)';
        } else {
            // Transform to X
            lines[0].style.transform = 'rotate(45deg) translateY(6px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translateY(-6px)';
        }
    });

    // Enhanced Navigation functionality
    function handleNavigation(link) {
        // Remove active class from all links and sections
        [...navLinks, ...mobileNavLinks].forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile menu if open
        mobileMenu.classList.add('hidden');
        const lines = mobileMenuBtn.querySelectorAll('div');
        lines[0].style.transform = 'rotate(0) translateY(0)';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'rotate(0) translateY(0)';
    }

    // Desktop navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });

    // Mobile navigation click handlers
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });

    // Form handling and validation
    const messageForm = document.getElementById('messageForm');
    const displayInfo = {
        currentTime: document.getElementById('currentTime'),
        nama: document.getElementById('displayNama'),
        tanggalLahir: document.getElementById('displayTanggalLahir'),
        jenisKelamin: document.getElementById('displayJenisKelamin'),
        pesan: document.getElementById('displayPesan')
    };
    
    // Enhanced time display
    function updateCurrentTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        displayInfo.currentTime.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Update time every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Enhanced form submission handler
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const nama = formData.get('nama').trim();
        const tanggalLahir = formData.get('tanggalLahir');
        const jenisKelamin = formData.get('jenisKelamin');
        const pesan = formData.get('pesan').trim();
        
        // Enhanced validation
        if (!validateForm(nama, tanggalLahir, pesan)) {
            return;
        }
        
        // Display submitted information with animation
        displayInfo.nama.textContent = nama;
        displayInfo.tanggalLahir.textContent = formatDate(tanggalLahir);
        displayInfo.jenisKelamin.textContent = jenisKelamin;
        displayInfo.pesan.textContent = pesan;
        
        // Animate the display section
        const displaySection = document.querySelector('[data-testid="contact-info-display"]');
        displaySection.classList.add('ring-4', 'ring-bright-yellow', 'ring-opacity-50');
        setTimeout(() => {
            displaySection.classList.remove('ring-4', 'ring-bright-yellow', 'ring-opacity-50');
        }, 2000);
        
        // Show success notification
        showNotification('Message submitted successfully! 🎉', 'success');
        
        // Reset form with animation
        this.reset();
        
        // Scroll to display section
        displaySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    // Enhanced form validation
    function validateForm(nama, tanggalLahir, pesan) {
        clearAllErrors();
        let isValid = true;
        
        // Name validation
        if (nama.length < 2) {
            showFieldError('nama', 'Name must be at least 2 characters long');
            isValid = false;
        } else if (nama.length > 50) {
            showFieldError('nama', 'Name must be less than 50 characters');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(nama)) {
            showFieldError('nama', 'Name should only contain letters and spaces');
            isValid = false;
        }
        
        // Date validation
        if (tanggalLahir) {
            const birthDate = new Date(tanggalLahir);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (birthDate > today) {
                showFieldError('tanggalLahir', 'Date of birth cannot be in the future');
                isValid = false;
            } else if (age > 120) {
                showFieldError('tanggalLahir', 'Please enter a valid date of birth');
                isValid = false;
            } else if (age < 13) {
                showFieldError('tanggalLahir', 'You must be at least 13 years old');
                isValid = false;
            }
        }
        
        // Message validation
        if (pesan.length < 10) {
            showFieldError('pesan', 'Message must be at least 10 characters long');
            isValid = false;
        } else if (pesan.length > 500) {
            showFieldError('pesan', 'Message must be less than 500 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Real-time validation for form fields
    const formInputs = messageForm.querySelectorAll('input[type="text"], input[type="date"], textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this.name);
            // Real-time character counter for message
            if (this.name === 'pesan') {
                updateCharacterCounter(this);
            }
        });
    });
    
    // Character counter for message field
    function updateCharacterCounter(textarea) {
        let counter = document.getElementById('messageCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'messageCounter';
            counter.className = 'text-sm text-gray-500 mt-1';
            textarea.parentNode.appendChild(counter);
        }
        
        const remaining = 500 - textarea.value.length;
        counter.textContent = `${textarea.value.length}/500 characters`;
        counter.className = remaining < 50 ? 'text-sm text-red-500 mt-1' : 'text-sm text-gray-500 mt-1';
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        clearFieldError(fieldName);
        
        if (fieldName === 'nama' && value) {
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters');
                return false;
            }
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                showFieldError(fieldName, 'Name should only contain letters and spaces');
                return false;
            }
        }
        
        if (fieldName === 'pesan' && value) {
            if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters');
                return false;
            }
        }
        
        return true;
    }
    
    function showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        field.classList.add('border-red-500', 'border-2');
        field.classList.remove('border-gray-200');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1 animate-fade-in';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        field.classList.remove('border-red-500', 'border-2');
        field.classList.add('border-gray-200');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function clearAllErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorFields = document.querySelectorAll('.border-red-500');
        errorFields.forEach(field => {
            field.classList.remove('border-red-500', 'border-2');
            field.classList.add('border-gray-200');
        });
    }
    
    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.getElementById('notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Dynamic name greeting
    const userNameElement = document.getElementById('userName');
    const defaultName = 'Friend';
    
    function setUserName(name) {
        if (name && name.trim()) {
            userNameElement.textContent = name.trim();
        } else {
            userNameElement.textContent = defaultName;
        }
    }
    
    // Set default name
    setUserName(defaultName);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe portfolio items and cards
    document.querySelectorAll('[data-testid^="portfolio-item"], [data-testid="vision-card"], [data-testid="mission-card"]').forEach(item => {
        observer.observe(item);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('home');
        
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Enhanced scroll behavior for navigation
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            // Update active navigation based on scroll position
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Update active nav link
                    [...navLinks, ...mobileNavLinks].forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    });
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            isScrolling = true;
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });
    
    // Initialize animations on load
    setTimeout(() => {
        document.querySelectorAll('.animate-fade-in').forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});
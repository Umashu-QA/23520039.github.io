// Additional JavaScript components and utilities

// Form validation utility
const FormValidator = {
    validateEmail: function(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    
    validatePhone: function(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phone));
    },
    
    validateRequired: function(value) {
        return value.trim() !== '';
    }
};

// Local storage utility
const Storage = {
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    get: function(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    }
};

// API service utility
const ApiService = {
    get: function(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    },
    
    post: function(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
    }
};

// Image lazy loading utility
const LazyLoad = {
    init: function() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            let lazyLoadThrottleTimeout;
            
            function lazyLoad() {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }
                
                lazyLoadThrottleTimeout = setTimeout(function() {
                    const scrollTop = window.pageYOffset;
                    lazyImages.forEach(function(img) {
                        if (img.offsetTop < (window.innerHeight + scrollTop)) {
                            img.src = img.dataset.src || img.src;
                            img.classList.remove('lazy');
                        }
                    });
                    if (lazyImages.length === 0) { 
                        document.removeEventListener("scroll", lazyLoad);
                        window.removeEventListener("resize", lazyLoad);
                        window.removeEventListener("orientationChange", lazyLoad);
                    }
                }, 20);
            }
            
            document.addEventListener("scroll", lazyLoad);
            window.addEventListener("resize", lazyLoad);
            window.addEventListener("orientationChange", lazyLoad);
        }
    }
};

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
    LazyLoad.init();
});

// Dark mode toggle utility
const DarkMode = {
    init: function() {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        if (!darkModeToggle) return;
        
        // Check for saved dark mode preference
        const isDarkMode = Storage.get('darkMode') || false;
        
        // Apply dark mode if preference is set
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.classList.add('active');
        }
        
        // Toggle dark mode on button click
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.classList.toggle('active');
            
            // Save preference
            Storage.set('darkMode', document.body.classList.contains('dark-mode'));
        });
    }
};

// Initialize dark mode
document.addEventListener('DOMContentLoaded', function() {
    DarkMode.init();
});

// Print utility
const Print = {
    init: function() {
        const printButtons = document.querySelectorAll('.print-button');
        
        printButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-print-section');
                const section = document.getElementById(sectionId);
                
                if (section) {
                    const printContent = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Print</title>
                            <style>
                                body { font-family: 'Poppins', sans-serif; }
                                img { max-width: 100%; height: auto; }
                                .no-print { display: none; }
                                @media print {
                                    body { margin: 0; padding: 15px; }
                                }
                            </style>
                        </head>
                        <body>
                            ${section.innerHTML}
                        </body>
                        </html>
                    `;
                    
                    const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(printContent);
                    printWindow.document.close();
                    
                    printWindow.onload = function() {
                        printWindow.print();
                        printWindow.close();
                    };
                }
            });
        });
    }
};

// Initialize print functionality
document.addEventListener('DOMContentLoaded', function() {
    Print.init();
});
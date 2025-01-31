// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const menuContent = document.querySelector('.menu-content');
    const menuText = document.querySelector('.menu-text');


    // Toggle menu when clicking the menu icon
    menuIcon?.addEventListener('click', function(e) {
        menuContent.classList.toggle('show');
        menuIcon.classList.toggle('active');
        // Only update text if it's visible (larger screens)
        if (window.innerWidth > 1024 && menuText) {
            menuText.textContent = menuIcon.classList.contains('active') ? 'Close' : 'Menu';
        }
        e.stopPropagation();
    });

    // Close menu when clicking anywhere else on the page
    document.addEventListener('click', function(e) {
        if (!menuContent?.contains(e.target) && !menuIcon?.contains(e.target)) {
            menuContent?.classList.remove('show');
            menuIcon?.classList.remove('active');
            if (window.innerWidth > 1024 && menuText) {
                menuText.textContent = 'Menu';
            }
        }
    });

    // Close menu when clicking a menu item
    menuContent?.addEventListener('click', function() {
        menuContent.classList.remove('show');
        menuIcon.classList.remove('active');
        if (window.innerWidth > 1024 && menuText) {
            menuText.textContent = 'Menu';
        }
    });

    // Reset menu state when screen size changes
    window.addEventListener('resize', function() {
        menuContent?.classList.remove('show');
        menuIcon?.classList.remove('active');
        if (window.innerWidth > 1024 && menuText) {
            menuText.textContent = 'Menu';
        }
    });

    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                }
            });
            
            // Toggle current item
            item.classList.toggle('open');
        });
    });

    // Configuration for the observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Create observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Force visibility on the calendar section
                if (entry.target.classList.contains('course-calendar')) {
                    entry.target.style.opacity = '1';
                }
                
                // Add visible class to parent
                entry.target.classList.add('visible');
                
                // Stagger child elements if they exist
                const children = entry.target.querySelectorAll('.stagger-item');
                if (children.length) {
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, 150 * index);
                    });
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target sections to animate
    const sections = document.querySelectorAll('.hero, .faq, .course-calendar, .core-values-section');

    sections.forEach(section => {
        // Add fade-in class
        section.classList.add('fade-in');
        
        // Add stagger class to specific child elements in core-values section
        if (section.classList.contains('core-values-section')) {
            const valueBoxes = section.querySelectorAll('.value-box');
            valueBoxes.forEach(box => {
                box.classList.add('stagger-item');
            });
            
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.classList.add('stagger-item');
            }
        } else {
            // Regular stagger items for other sections
            const childElements = section.querySelectorAll('h1, h2, p, .button, .card');
            childElements.forEach(child => {
                child.classList.add('stagger-item');
            });
        }
        
        // Observe section
        observer.observe(section);
    });

    // Function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75
        );
    }

    // Function to handle scroll animation
    function handleScroll() {
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }

    // Check elements on load
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Calendar functionality
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        themeSystem: 'standard',
        height: 'auto',
        contentHeight: 'auto',
        fixedWeekCount: false,
        events: [
            { 
                title: 'Introduction to Machine Learning',
                start: '2024-10-01',
                extendedProps: {
                    type: 'Lecture',
                    time: '4:30 PM - 6:00 PM',
                    description: 'An overview of machine learning concepts and applications.'
                }
            },
            { 
                title: 'Data Exploration Workshop',
                start: '2024-10-03',
                extendedProps: {
                    type: 'Activity',
                    time: '4:30 PM - 6:00 PM',
                    description: 'Hands-on session working with real-world datasets.'
                }
            },
            { 
                title: 'Supervised Learning',
                start: '2024-10-08',
                extendedProps: {
                    type: 'Lecture',
                    time: '4:30 PM - 6:00 PM',
                    description: 'Understanding supervised learning algorithms and their use cases.'
                }
            },
            { 
                title: 'Building a Simple Classifier',
                start: '2024-10-10',
                extendedProps: {
                    type: 'Activity',
                    time: '4:30 PM - 6:00 PM',
                    description: 'Practical session on implementing a basic machine learning classifier.'
                }
            }
        ],
        dateClick: function(info) {
            const events = calendar.getEvents().filter(event => 
                event.startStr === info.dateStr
            );
            
            if (events.length > 0) {
                showEventDetails(events[0]);
            }
        },
        buttonText: {
            today: 'Today'
        },
        datesSet: function() {
            // Reset all event indicators
            document.querySelectorAll('.has-event').forEach(el => {
                el.classList.remove('has-event');
            });
            
            // Reapply event indicators for the current month view
            const events = calendar.getEvents();
            events.forEach(event => {
                const dateStr = event.startStr;
                const cell = document.querySelector(`[data-date="${dateStr}"]`);
                if (cell) {
                    cell.classList.add('has-event');
                }
            });
        }
    });
    calendar.render();

    const popup = document.getElementById('eventPopup');
    const overlay = document.getElementById('popupOverlay');
    const closeButton = document.querySelector('.close-button');

    // Add event listeners
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            closePopup();
        });
    }

    // Add escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    // Prevent popup close when clicking inside the popup
    if (popup) {
        popup.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    function showEventDetails(event) {
        const popup = document.getElementById('eventPopup');
        const overlay = document.getElementById('popupOverlay');
        
        document.getElementById('eventTitle').textContent = event.title;
        document.getElementById('eventDate').textContent = event.start.toDateString();
        document.getElementById('eventTime').textContent = event.extendedProps.time;
        document.getElementById('eventDescription').textContent = event.extendedProps.description;
        
        overlay.style.display = 'block';
        popup.style.display = 'block';
        
        // Trigger reflow
        void popup.offsetWidth;
        
        overlay.classList.add('visible');
        popup.classList.add('visible');
    }

    function closePopup() {
        const popup = document.getElementById('eventPopup');
        const overlay = document.getElementById('popupOverlay');
        
        popup.classList.remove('visible');
        overlay.classList.remove('visible');
        
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }
    
});


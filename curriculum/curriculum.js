
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

    
    console.log('Initializing Slideshow');
    initSlideshow();

});

// Data structure for the lessons
const lessonsData = {
    '1': {
        lessons: {
            'Tuesday': {
                time: '10:00 AM - 11:30 AM',
                title: 'Meeting #1',
                instructor: 'Dr. Smith',
                description: 'Introduction to Machine Learning:\n• Basic concepts and terminology\n• Types of Machine Learning\n• Common applications and use cases\n• Setting up the development environment'
            },
            'Thursday': {
                time: '10:00 AM - 11:30 AM',
                title: 'Meeting #2',
                instructor: 'Dr. Smith',
                description: 'Data Preprocessing:\n• Data cleaning techniques\n• Feature scaling and normalization\n• Handling missing values\n• Feature selection and engineering'
            }
        }
    },
    '2': {
        lessons: {
            'Tuesday': {
                time: '10:00 AM - 11:30 AM',
                title: 'Meeting #3',
                instructor: 'Dr. Smith',
                description: 'Supervised Learning:\n• Linear Regression\n• Logistic Regression\n• Decision Trees\n• Model evaluation metrics'
            },
            'Thursday': {
                time: '10:00 AM - 11:30 AM',
                title: 'Meeting #4',
                instructor: 'Dr. Smith',
                description: 'Neural Networks:\n• Perceptrons and neural networks\n• Activation functions\n• Backpropagation\n• Training neural networks'
            }
        }
    },
    '3': {
        lessons: {
            'Tuesday': {
                time: '10:00 AM - 11:30 AM',
                title: 'Meeting #5',
                instructor: 'Dr. Smith',
                description: 'Deep Learning:\n• Convolutional Neural Networks\n• Recurrent Neural Networks\n• Transfer Learning\n• Best practices in deep learning'
            },
            'Thursday': {
                time: '10:00 AM - 11:30 AM',
                title: 'Meeting #6',
                instructor: 'Dr. Smith',
                description: 'Project Implementation:\n• Real-world applications\n• Model deployment\n• Best practices\n• Final project presentation'
            }
        }
    }
};

// Current state
let currentWeek = 1;
let currentDay = 'Tuesday';

// Initialize the slideshow
function initSlideshow() {
    createFlashcards();
    setupEventListeners();
    updateActiveStates(); // This will now be called immediately
}

// Create flashcards
function createFlashcards() {
    const wrapper = document.querySelector('.flashcards-wrapper');
    wrapper.innerHTML = '';

    Object.entries(lessonsData).forEach(([week, weekData]) => {
        ['Tuesday', 'Thursday'].forEach(day => {
            const lesson = weekData.lessons[day];
            const flashcard = document.createElement('div');
            flashcard.className = `flashcard ${week === '1' && day === 'Tuesday' ? 'active' : ''}`;
            flashcard.dataset.week = week;
            flashcard.dataset.day = day;
            
            flashcard.innerHTML = `
                <div class="lesson-content">
                    <div class="lesson-time">${lesson.time}</div>
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-instructor">${lesson.instructor}</div>
                    <div class="lesson-description">${lesson.description}</div>
                </div>
            `;
            
            wrapper.appendChild(flashcard);
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Week buttons
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const week = parseInt(btn.dataset.week);
            currentWeek = week;
            currentDay = 'Tuesday';
            updateActiveStates();
        });
    });

    // Navigation buttons
    document.querySelector('.prev-btn').addEventListener('click', navigatePrev);
    document.querySelector('.next-btn').addEventListener('click', navigateNext);
}

// Navigation functions
function navigateNext() {
    if (currentDay === 'Tuesday') {
        currentDay = 'Thursday';
    } else {
        currentDay = 'Tuesday';
        currentWeek = Math.min(currentWeek + 1, 3);
    }
    updateActiveStates();
}

function navigatePrev() {
    if (currentDay === 'Thursday') {
        currentDay = 'Tuesday';
    } else {
        currentDay = 'Thursday';
        currentWeek = Math.max(currentWeek - 1, 1);
    }
    updateActiveStates();
}

// Modified updateActiveStates function
function updateActiveStates() {
    const allCards = document.querySelectorAll('.flashcard');
    
    // Calculate indices with looping
    let currentIndex = (currentWeek - 1) * 2 + (currentDay === 'Thursday' ? 1 : 0);
    let prevIndex = currentIndex - 1;
    let nextIndex = currentIndex + 1;
    
    // Handle looping for initial state
    if (prevIndex < 0) prevIndex = allCards.length - 1;
    if (nextIndex >= allCards.length) nextIndex = 0;
    
    // Update all cards immediately
    allCards.forEach((card, index) => {
        // Remove all classes first
        card.classList.remove('active', 'prev-peek', 'next-peek');
        
        // Add appropriate class based on position
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === prevIndex) {
            card.classList.add('prev-peek');
        } else if (index === nextIndex) {
            card.classList.add('next-peek');
        }
    });

    // Update week buttons
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.week) === currentWeek);
    });

    updateDayIndicator();
}

// Modify navigation functions to implement looping
function navigateNext() {
    if (currentDay === 'Tuesday') {
        currentDay = 'Thursday';
    } else {
        currentDay = 'Tuesday';
        currentWeek = currentWeek === 3 ? 1 : currentWeek + 1;
    }
    updateActiveStates();
}

function navigatePrev() {
    if (currentDay === 'Thursday') {
        currentDay = 'Tuesday';
    } else {
        currentDay = 'Thursday';
        currentWeek = currentWeek === 1 ? 3 : currentWeek - 1;
    }
    updateActiveStates();
}
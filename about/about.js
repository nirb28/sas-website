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

    // Get all elements we want to animate
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle');
    const missionElements = document.querySelectorAll('.mission-title, .mission-statement, .mission-image');
    
    // Function to add transition and animate
    const animateIn = (element, delay) => {
        // Add transition properties
        element.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
        }, delay);
    };

    // Animate hero section
    heroElements.forEach((element, index) => {
        animateIn(element, 100 + (index * 200));
    });

    // Animate mission section when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.animationDelay || 0;
                animateIn(element, parseInt(delay));
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    // Set delays and observe mission elements
    missionElements.forEach((element, index) => {
        element.dataset.animationDelay = 200 * index;
        observer.observe(element);
    });

    // Get team members
    const teamMembers = document.querySelectorAll('.team-member');
    const overlay = document.querySelector('.overlay');
    let expandedMember = null;

    function expandMember(member) {
        // Always reset any existing expanded member first
        if (expandedMember) {
            expandedMember.classList.remove('expanded');
            expandedMember.querySelector('.member-bio').classList.add('hidden');
        }
        
        // Set new expanded member
        expandedMember = member;
        member.classList.add('expanded');
        member.querySelector('.member-bio').classList.remove('hidden');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function collapseMember() {
        if (!expandedMember) return;
        
        expandedMember.classList.remove('expanded');
        expandedMember.querySelector('.member-bio').classList.add('hidden');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        expandedMember = null;
    }
    
    // Update the click handler
    teamMembers.forEach(member => {
        member.addEventListener('click', (e) => {
            if (!member.classList.contains('expanded')) {
                expandMember(member);
            }
        });
    
        // Update close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            collapseMember();
        });
        member.querySelector('.member-info').appendChild(closeButton);
    });

    // Click overlay to close
    overlay.addEventListener('click', () => {
        collapseMember();
    });

    // Press ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') collapseMember();
    });

    // Keep your existing animation code
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                setTimeout(() => {
                    element.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    teamMembers.forEach((member) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px) scale(0.98)';
        teamObserver.observe(member);
    });
});
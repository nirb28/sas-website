document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const menuIcon = document.querySelector('.menu-icon');
    const menuContent = document.querySelector('.menu-content');
    const menuText = document.querySelector('.menu-text');
    const gradeDisplay = document.getElementById('gradeDisplay');
    const gradeModal = document.getElementById('gradeModal');
    const gradeInput = document.getElementById('studentGrade');
    const cancelBtn = document.getElementById('cancelGrade');
    const confirmBtn = document.getElementById('confirmGrade');
    const otherGradeContainer = document.getElementById('otherGradeContainer');
    const otherGradeInput = document.getElementById('otherGrade');
    const successNotification = document.getElementById('successNotification');
    const notificationClose = successNotification.querySelector('.notification-close');
    
    // Add console logs to verify elements are found
    console.log('Grade Display:', gradeDisplay);
    console.log('Grade Modal:', gradeModal);

    // Form submit handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Log the data being sent
            const formData = {
                parentName: document.getElementById('parentName').value,
                parentEmail: document.getElementById('parentEmail').value,
                studentName: document.getElementById('studentName').value,
                studentEmail: document.getElementById('studentEmail').value,
                studentGrade: document.getElementById('studentGrade').value,
                interest: document.getElementById('interest').value
            };
            
            console.log('Sending data:', formData); // Added this line
    
            const response = await fetch('http://localhost:5000/api/registration/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
            console.log('Response:', data); // Added this line
    
            if (response.ok) {
                // Reset form fields
                const gradeDisplay = document.getElementById('gradeDisplay');
                const gradeInput = document.getElementById('studentGrade');
                
                // Show success notification
                successNotification.classList.add('show');
                
                // Reset all form fields
                form.reset();
                gradeDisplay.textContent = 'Select Grade';
                gradeInput.value = '';
                
                // Auto hide notification after 8 seconds
                setTimeout(() => {
                    successNotification.classList.remove('show');
                }, 8000);
            } else {
                // Show error notification or alert
                alert('Registration failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error details:', error);
            alert('An error occurred during registration');
        }
    });
    
    // Close notification when clicking the close button
    notificationClose.addEventListener('click', () => {
        successNotification.classList.remove('show');
    });


    // Menu handlers
    menuIcon?.addEventListener('click', function(e) {
        menuContent.classList.toggle('show');
        menuIcon.classList.toggle('active');
        if (window.innerWidth > 1024 && menuText) {
            menuText.textContent = menuIcon.classList.contains('active') ? 'Close' : 'Menu';
        }
        e.stopPropagation();
    });

    document.addEventListener('click', function(e) {
        if (!menuContent?.contains(e.target) && !menuIcon?.contains(e.target)) {
            menuContent?.classList.remove('show');
            menuIcon?.classList.remove('active');
            if (window.innerWidth > 1024 && menuText) {
                menuText.textContent = 'Menu';
            }
        }
    });

    menuContent?.addEventListener('click', function() {
        menuContent.classList.remove('show');
        menuIcon.classList.remove('active');
        if (window.innerWidth > 1024 && menuText) {
            menuText.textContent = 'Menu';
        }
    });

    window.addEventListener('resize', function() {
        menuContent?.classList.remove('show');
        menuIcon?.classList.remove('active');
        if (window.innerWidth > 1024 && menuText) {
            menuText.textContent = 'Menu';
        }
    });

    // Check if grade elements exist before adding event listeners
    if (!gradeDisplay || !gradeModal) {
        console.error('Required elements not found!');
        return;
    }

    let selectedGrade = null;

    // Grade modal handlers
    gradeDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        gradeModal.classList.add('show');
        console.log('Modal should be shown now');
    });

    document.querySelectorAll('.grade-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.grade-option').forEach(opt => 
                opt.classList.remove('selected'));
            this.classList.add('selected');
            
            if (this.dataset.grade === 'other') {
                otherGradeContainer.style.display = 'block';
                selectedGrade = null;
            } else {
                otherGradeContainer.style.display = 'none';
                selectedGrade = {
                    value: this.dataset.grade,
                    text: this.textContent
                };
            }
        });
    });

    otherGradeInput?.addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 12) {
            selectedGrade = {
                value: value.toString(),
                text: value + 'th Grade'
            };
        }
    });

    cancelBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        gradeModal.classList.remove('show');
        otherGradeContainer.style.display = 'none';
        otherGradeInput.value = '';
        if (!gradeInput.value) {
            selectedGrade = null;
            document.querySelectorAll('.grade-option').forEach(opt => 
                opt.classList.remove('selected'));
        }
    });

    confirmBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        if (selectedGrade) {
            gradeDisplay.textContent = selectedGrade.text;
            gradeInput.value = selectedGrade.value;
            gradeModal.classList.remove('show');
            otherGradeContainer.style.display = 'none';
            otherGradeInput.value = '';
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === gradeModal) {
            gradeModal.classList.remove('show');
            otherGradeContainer.style.display = 'none';
            otherGradeInput.value = '';
            if (!gradeInput.value) {
                selectedGrade = null;
                document.querySelectorAll('.grade-option').forEach(opt => 
                    opt.classList.remove('selected'));
            }
        }
    });
});
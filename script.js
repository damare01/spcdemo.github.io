document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('attendanceForm');
    const departmentSelect = document.getElementById('department');
    const yearLevelSelect = document.getElementById('yearLevel');
    const strandContainer = document.getElementById('strandContainer');
    const programContainer = document.getElementById('programContainer');
    const strandSelect = document.getElementById('strand');
    const programSelect = document.getElementById('program');
    const fileInput = document.getElementById('proof');
    const uploadArea = document.getElementById('uploadArea');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const uploadProgress = document.querySelector('.upload-progress');
    const successMessage = document.getElementById('successMessage');
    const confettiContainer = document.getElementById('confettiContainer');
    
    // Summary elements
    const summaryName = document.getElementById('summaryName');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryDepartment = document.getElementById('summaryDepartment');
    const summaryYearSection = document.getElementById('summaryYearSection');
    const summaryStrand = document.getElementById('summaryStrand');
    const summaryProgram = document.getElementById('summaryProgram');
    const summaryStrandContainer = document.getElementById('summaryStrandContainer');
    const summaryProgramContainer = document.getElementById('summaryProgramContainer');
    
    // Form navigation
    const formPages = document.querySelectorAll('.form-page');
    const steps = document.querySelectorAll('.step');
    const progressBar = document.getElementById('progressBar');
    const toPage1 = document.querySelectorAll('#toPage1');
    const toPage2 = document.querySelectorAll('#toPage2');
    const toPage3 = document.querySelectorAll('#toPage3');
    
    let currentPage = 1;
    
    // Navigation functions
    function showPage(pageNumber) {
        formPages.forEach(page => page.classList.remove('active'));
        document.getElementById(`page${pageNumber}`).classList.add('active');
        
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            if (stepNumber === pageNumber) {
                step.classList.add('active');
            } else if (stepNumber < pageNumber) {
                step.classList.add('completed');
            }
        });
        
        // Update progress bar
        progressBar.style.width = `${((pageNumber - 1) / 2) * 100}%`;
        currentPage = pageNumber;
        
        // Update summary when going to page 3
        if (pageNumber === 3) {
            updateSummary();
        }
    }
    
    // Update summary information
   function updateSummary() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const department = departmentSelect.value;
    const yearLevel = yearLevelSelect.value;
    const section = document.getElementById('section').value;
    const strand = strandSelect.value;
    const program = programSelect.value;

    summaryName.textContent = name || '-';
    summaryEmail.textContent = email || '-';
    summaryDepartment.textContent = department || '-';
    summaryYearSection.textContent = `${yearLevel || '-'}-${section || '-'}`;
    
    // Only show one of strand/program in summary
    if (department === 'SHS') {
        summaryStrandContainer.classList.remove('hidden');
        summaryStrand.textContent = strand || '-';
        summaryProgramContainer.classList.add('hidden');
        summaryProgram.textContent = '';
    } else if (department === 'College') {
        summaryProgramContainer.classList.remove('hidden');
        summaryProgram.textContent = program || '-';
        summaryStrandContainer.classList.add('hidden');
        summaryStrand.textContent = '';
    } else {
        summaryStrandContainer.classList.add('hidden');
        summaryProgramContainer.classList.add('hidden');
        summaryStrand.textContent = '';
        summaryProgram.textContent = '';
    }
}
    
    // Event listeners for navigation
    toPage1.forEach(btn => {
        btn.addEventListener('click', () => showPage(1));
    });
    
    toPage2.forEach(btn => {
        btn.addEventListener('click', function() {
            // Validate page 1 fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const department = document.getElementById('department');
            
            if (name.value && email.value && department.value) {
                showPage(2);
            } else {
                // Highlight empty required fields
                [name, email, department].forEach(field => {
                    if (!field.value) {
                        field.classList.add('border-red-500');
                        field.classList.add('animate-pulse');
                        setTimeout(() => {
                            field.classList.remove('animate-pulse');
                        }, 1000);
                    }
                });
            }
        });
    });
    
    toPage3.forEach(btn => {
        btn.addEventListener('click', function() {
            // Validate page 2 fields
            const yearLevel = document.getElementById('yearLevel');
            const section = document.getElementById('section');
            let isValid = true;
            
            if (!yearLevel.value || !section.value) {
                isValid = false;
            }
            
            if (departmentSelect.value === 'SHS' && !strandSelect.value) {
                isValid = false;
            }
            
            if (departmentSelect.value === 'College' && !programSelect.value) {
                isValid = false;
            }
            
            if (isValid) {
                showPage(3);
            } else {
                // Highlight empty required fields
                [yearLevel, section].forEach(field => {
                    if (!field.value) {
                        field.classList.add('border-red-500');
                        field.classList.add('animate-pulse');
                        setTimeout(() => {
                            field.classList.remove('animate-pulse');
                        }, 1000);
                    }
                });
                
                if (departmentSelect.value === 'SHS' && !strandSelect.value) {
                    strandSelect.classList.add('border-red-500');
                    strandSelect.classList.add('animate-pulse');
                    setTimeout(() => {
                        strandSelect.classList.remove('animate-pulse');
                    }, 1000);
                }
                
                if (departmentSelect.value === 'College' && !programSelect.value) {
                    programSelect.classList.add('border-red-500');
                    programSelect.classList.add('animate-pulse');
                    setTimeout(() => {
                        programSelect.classList.remove('animate-pulse');
                    }, 1000);
                }
            }
        });
    });
    
    // Remove red border when field is filled
    document.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', function() {
            if (this.value) {
                this.classList.remove('border-red-500');
            }
        });
    });
    
    // Update year level options based on department
    departmentSelect.addEventListener('change', function() {
        const department = this.value;
        yearLevelSelect.innerHTML = '<option value="" disabled selected>Select your year level</option>';
        
        if (department === 'SHS') {
            yearLevelSelect.innerHTML += `
                <option value="11">11</option>
                <option value="12">12</option>
            `;
            strandContainer.classList.remove('hidden');
            strandSelect.required = true;
            programContainer.classList.add('hidden');
            programSelect.required = false;
            programSelect.value = '';
        } else if (department === 'College') {
            yearLevelSelect.innerHTML += `
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            `;
            programContainer.classList.remove('hidden');
            programSelect.required = true;
            strandContainer.classList.add('hidden');
            strandSelect.required = false;
            strandSelect.value = '';
        }
    });
    
    // Enhanced file upload handling
    fileInput.addEventListener('change', handleFileSelect);
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            // Show file preview
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            filePreview.classList.remove('hidden');
            
            // Change upload area style
            uploadArea.classList.add('has-file');
            
            // Show upload progress animation
            uploadProgress.classList.remove('hidden');
            
            // Hide progress after animation completes
            setTimeout(() => {
                uploadProgress.classList.add('hidden');
            }, 2000);
        }
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Remove file
    removeFile.addEventListener('click', function() {
        fileInput.value = '';
        filePreview.classList.add('hidden');
        uploadArea.classList.remove('has-file');
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            fileInput.files = files;
            handleFileSelect({target: {files: files}});
        }
    }
    
    // Create confetti animation
    function createConfetti() {
        const colors = ['#e21b3c', '#ff4d6d', '#f9a826', '#10b981', '#3b82f6'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random position, size, color and animation
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 2;
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.top = '-20px';
            confetti.style.opacity = '1';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Animation
            confetti.style.animation = `
                fall ${animationDuration}s ease-in ${animationDelay}s forwards
            `;
            
            // Add to container
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, (animationDuration + animationDelay) * 1000);
        }
    }
    
    // Add fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                opacity: 1;
                top: -20px;
                transform: translateX(0) rotate(0deg);
            }
            25% {
                opacity: 1;
                transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
            }
            50% {
                opacity: 1;
                transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
            }
            75% {
                opacity: 0.7;
                transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
            }
            100% {
                opacity: 0;
                top: 100vh;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!form.checkValidity()) {
            return;
        }
        
        // Show success message with animation
        form.reset();
        filePreview.classList.add('hidden');
        uploadArea.classList.remove('has-file');
        strandContainer.classList.add('hidden');
        programContainer.classList.add('hidden');
        
        // Hide form card and show success message
        document.querySelector('.form-card').style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Create confetti animation
        createConfetti();
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset form after 5 seconds
        setTimeout(() => {
            document.querySelector('.form-card').style.display = 'block';
            successMessage.classList.add('hidden');
            showPage(1);
        }, 5000);
    });
});

// Import Firebase Database (no need to import app/config here; it's in the HTML <head> and globally initialized)
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    // Multi-step navigation
    const pages = Array.from(document.querySelectorAll('.form-page'));
    const progressBar = document.getElementById('progressBar');
    const steps = Array.from(document.querySelectorAll('.form-steps .step'));
    let currentPage = 0;

    function goToPage(idx) {
        if (idx < 0 || idx >= pages.length) return;
        pages.forEach((pg, i) => pg.classList.toggle('active', i === idx));
        steps.forEach((step, i) => step.classList.toggle('active', i === idx));
        progressBar.style.width = ((idx + 1) / pages.length * 100) + '%';
        currentPage = idx;
    }
    function nextPage() { goToPage(currentPage + 1); }
    function prevPage() { goToPage(currentPage - 1); }

    // Navigation buttons with unique IDs
    const toPage2Next = document.getElementById('toPage2Next');
    const toPage3Next = document.getElementById('toPage3Next');
    const toPage1Prev = document.getElementById('toPage1Prev');
    const toPage2Prev = document.getElementById('toPage2Prev');
    if (toPage2Next) toPage2Next.addEventListener('click', function () {
        if (validatePage(0)) nextPage();
    });
    if (toPage3Next) toPage3Next.addEventListener('click', function () {
        if (validatePage(1)) {
            updateSummary();
            nextPage();
        }
    });
    if (toPage1Prev) toPage1Prev.addEventListener('click', prevPage);
    if (toPage2Prev) toPage2Prev.addEventListener('click', prevPage);

    // Dynamic Year Level Options
    const departmentSelect = document.getElementById('department');
    const yearLevelSelect = document.getElementById('yearLevel');
    function updateYearLevelOptions() {
        const dept = departmentSelect.value;
        let html = '<option value="" disabled selected>Select your year level</option>';
        if (dept === 'SHS') {
            html += '<option value="11">Grade 11</option><option value="12">Grade 12</option>';
        } else if (dept === 'College') {
            html += '<option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option><option value="5">5th Year</option>';
        }
        yearLevelSelect.innerHTML = html;
    }
    departmentSelect.addEventListener('change', function () {
        updateYearLevelOptions();
        toggleStrandProgram();
    });

    // SHS/College dynamic fields
    const strandContainer = document.getElementById('strandContainer');
    const programContainer = document.getElementById('programContainer');
    function toggleStrandProgram() {
        const dept = departmentSelect.value;
        if (dept === 'SHS') {
            strandContainer.classList.remove('hidden');
            programContainer.classList.add('hidden');
            document.getElementById('strand').setAttribute('required', 'required');
            document.getElementById('program').removeAttribute('required');
        } else if (dept === 'College') {
            strandContainer.classList.add('hidden');
            programContainer.classList.remove('hidden');
            document.getElementById('program').setAttribute('required', 'required');
            document.getElementById('strand').removeAttribute('required');
        } else {
            strandContainer.classList.add('hidden');
            programContainer.classList.add('hidden');
            document.getElementById('strand').removeAttribute('required');
            document.getElementById('program').removeAttribute('required');
        }
    }

    // Prefill the dynamic fields on load
    updateYearLevelOptions();
    toggleStrandProgram();

    // Update summary before verification page
    function updateSummary() {
        document.getElementById('summaryName').textContent = document.getElementById('name').value || '-';
        document.getElementById('summaryEmail').textContent = document.getElementById('email').value || '-';
        const dept = departmentSelect.value;
        document.getElementById('summaryDepartment').textContent = dept === 'SHS' ? 'Senior High School (SHS)' : (dept === 'College' ? 'College' : '-');
        document.getElementById('summaryYearSection').textContent =
            (yearLevelSelect.options[yearLevelSelect.selectedIndex]?.text || '-') +
            ' / ' +
            (document.getElementById('section').value || '-');
        // Show/hide STRAND/PROGRAM in summary
        if (dept === 'SHS') {
            document.getElementById('summaryStrandContainer').style.display = '';
            document.getElementById('summaryProgramContainer').style.display = 'none';
            document.getElementById('summaryStrand').textContent = document.getElementById('strand').value || '-';
        } else if (dept === 'College') {
            document.getElementById('summaryStrandContainer').style.display = 'none';
            document.getElementById('summaryProgramContainer').style.display = '';
            document.getElementById('summaryProgram').textContent = document.getElementById('program').value || '-';
        } else {
            document.getElementById('summaryStrandContainer').style.display = 'none';
            document.getElementById('summaryProgramContainer').style.display = 'none';
        }
    }

    // Validation per page
    function validatePage(idx) {
        // Get all required fields on the current page
        const page = pages[idx];
        let valid = true;
        const requiredFields = page.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' && !field.checked) valid = false;
            else if (field.value === '' || field.value === null) valid = false;
            field.classList.toggle('invalid', field.value === '' || (field.type === 'checkbox' && !field.checked));
        });
        return valid;
    }

    // File upload logic
    const proofInput = document.getElementById('proof');
    const uploadArea = document.getElementById('uploadArea');
    const filePreview = document.getElementById('filePreview');
    const fileNameSpan = document.getElementById('fileName');
    const fileSizeSpan = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFile');

    function showFilePreview(file) {
        filePreview.classList.remove('hidden');
        fileNameSpan.textContent = file.name;
        fileSizeSpan.textContent = Math.round(file.size / 1024) + ' KB';
        uploadArea.classList.add('file-uploaded');
    }
    function clearFilePreview() {
        filePreview.classList.add('hidden');
        fileNameSpan.textContent = '';
        fileSizeSpan.textContent = '';
        proofInput.value = '';
        uploadArea.classList.remove('file-uploaded');
    }
    if (proofInput) {
        proofInput.addEventListener('change', function (e) {
            const file = this.files[0];
            if (file) showFilePreview(file);
        });
    }
    if (uploadArea) {
        uploadArea.addEventListener('click', function () {
            proofInput.click();
        });
    }
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            clearFilePreview();
        });
    }
    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                proofInput.files = e.dataTransfer.files;
                showFilePreview(file);
            }
        });
    }

    // Form submission
    const form = document.getElementById('attendanceForm');
    const successMsg = document.getElementById('successMessage');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!validatePage(2)) return;

            // Gather form data
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                yearLevel: document.getElementById('yearLevel').value,
                section: document.getElementById('section').value,
                strand: document.getElementById('strand').value || "",
                program: document.getElementById('program').value || "",
                timestamp: new Date().toISOString(),
            };

            try {
                // Use the already-initialized app from the window object, if available
                const db = getDatabase(window.firebaseApp || undefined);
                const registrationsRef = ref(db, 'registrations');
                await push(registrationsRef, data);
            } catch (err) {
                alert("There was an error submitting your attendance. Please try again.");
                return;
            }

            form.classList.add('hidden');
            if (successMsg) successMsg.classList.remove('hidden');
        });
    }
});

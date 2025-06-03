// College Red Cross Youth - Attendance Registration Form Script

// DOM Elements
const form = document.getElementById("attendanceForm");
const pages = Array.from(document.querySelectorAll(".form-page"));
const steps = Array.from(document.querySelectorAll(".step"));
const progressBar = document.getElementById("progressBar");

// Navigation Buttons
const toPage2Btn = document.getElementById("toPage2");
const toPage1Btn = document.getElementById("toPage1");
const toPage3Btn = document.getElementById("toPage3");

// Summary Elements
const summaryName = document.getElementById("summaryName");
const summaryEmail = document.getElementById("summaryEmail");
const summaryDepartment = document.getElementById("summaryDepartment");
const summaryYearSection = document.getElementById("summaryYearSection");
const summaryStrand = document.getElementById("summaryStrand");
const summaryStrandContainer = document.getElementById("summaryStrandContainer");
const summaryProgram = document.getElementById("summaryProgram");
const summaryProgramContainer = document.getElementById("summaryProgramContainer");

// Page-specific fields
const departmentSelect = document.getElementById("department");
const yearLevelSelect = document.getElementById("yearLevel");
const strandContainer = document.getElementById("strandContainer");
const strandSelect = document.getElementById("strand");
const programContainer = document.getElementById("programContainer");
const programSelect = document.getElementById("program");
const sectionSelect = document.getElementById("section");

// File upload
const uploadArea = document.getElementById("uploadArea");
const proofInput = document.getElementById("proof");
const filePreview = document.getElementById("filePreview");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const removeFileBtn = document.getElementById("removeFile");

// Success Message
const successMessage = document.getElementById("successMessage");
const confettiContainer = document.getElementById("confettiContainer");

// State
let currentPage = 0;
let uploadedFile = null;

// --- Helper Functions ---
function showPage(idx) {
    pages.forEach((page, i) => {
        page.classList.toggle("active", i === idx);
    });
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === idx);
    });
    progressBar.style.width = ((idx + 1) / pages.length * 100) + "%";
    currentPage = idx;
}
function nextPage() { if (currentPage < pages.length - 1) showPage(currentPage + 1); }
function prevPage() { if (currentPage > 0) showPage(currentPage - 1); }

// --- Dynamic Form Logic ---
function populateYearLevels() {
    // Clear
    yearLevelSelect.innerHTML = `<option value="" disabled selected>Select your year level</option>`;
    let options = [];
    if (departmentSelect.value === "SHS") {
        options = [
            { value: "Grade 11", text: "Grade 11" },
            { value: "Grade 12", text: "Grade 12" }
        ];
    } else if (departmentSelect.value === "College") {
        options = [
            { value: "1st Year", text: "1st Year" },
            { value: "2nd Year", text: "2nd Year" },
            { value: "3rd Year", text: "3rd Year" },
            { value: "4th Year", text: "4th Year" }
        ];
    }
    options.forEach(opt => {
        let o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.text;
        yearLevelSelect.appendChild(o);
    });
}

function updateAcademicFields() {
    // Show/hide STRAND and Program based on department
    if (departmentSelect.value === "SHS") {
        strandContainer.classList.remove("hidden");
        strandSelect.required = true;
        programContainer.classList.add("hidden");
        programSelect.required = false;
        programSelect.value = '';
    } else if (departmentSelect.value === "College") {
        programContainer.classList.remove("hidden");
        programSelect.required = true;
        strandContainer.classList.add("hidden");
        strandSelect.required = false;
        strandSelect.value = '';
    } else {
        strandContainer.classList.add("hidden");
        strandSelect.required = false;
        strandSelect.value = '';
        programContainer.classList.add("hidden");
        programSelect.required = false;
        programSelect.value = '';
    }
    populateYearLevels();
}

departmentSelect.addEventListener("change", () => {
    updateAcademicFields();
    yearLevelSelect.value = '';
});


// --- Navigation Logic ---
toPage2Btn.addEventListener("click", () => {
    if (validatePage(0)) {
        nextPage();
    }
});
toPage1Btn.addEventListener("click", () => prevPage());
toPage3Btn.addEventListener("click", () => {
    if (validatePage(1)) {
        updateSummary();
        nextPage();
    }
});
// Both "Previous" buttons on page 3 point to page 2
document.querySelectorAll("button#toPage2").forEach(btn => btn.addEventListener("click", () => prevPage()));

// --- Validation ---
function validatePage(pageIdx) {
    // Validate required fields on current page
    const page = pages[pageIdx];
    const requiredFields = page.querySelectorAll("[required]");
    let valid = true;
    requiredFields.forEach(field => {
        if (!field.checkValidity()) {
            field.classList.add("invalid");
            valid = false;
        } else {
            field.classList.remove("invalid");
        }
    });
    if (!valid) {
        page.querySelectorAll(".invalid")[0]?.focus();
    }
    return valid;
}

// --- Verification Summary ---
function updateSummary() {
    summaryName.textContent = form.name.value || "-";
    summaryEmail.textContent = form.email.value || "-";
    summaryDepartment.textContent = form.department.value || "-";
    summaryYearSection.textContent = form.yearLevel.value && form.section.value ?
        `${form.yearLevel.value} - ${form.section.value}` : "-";
    if (form.department.value === "SHS") {
        summaryStrandContainer.style.display = "";
        summaryStrand.textContent = form.strand.value || "-";
        summaryProgramContainer.style.display = "none";
        summaryProgram.textContent = "-";
    } else if (form.department.value === "College") {
        summaryProgramContainer.style.display = "";
        summaryProgram.textContent = form.program.value || "-";
        summaryStrandContainer.style.display = "none";
        summaryStrand.textContent = "-";
    } else {
        summaryStrandContainer.style.display = "none";
        summaryProgramContainer.style.display = "none";
        summaryStrand.textContent = "-";
        summaryProgram.textContent = "-";
    }
}

// --- File Upload Drag & Drop ---
uploadArea.addEventListener("click", () => proofInput.click());
uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
});
uploadArea.addEventListener("dragleave", e => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
});
uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        proofInput.files = e.dataTransfer.files;
        handleFileSelected(proofInput.files[0]);
    }
});
proofInput.addEventListener("change", () => {
    if (proofInput.files[0]) {
        handleFileSelected(proofInput.files[0]);
    }
});
function handleFileSelected(file) {
    uploadedFile = file;
    filePreview.classList.remove("hidden");
    fileName.textContent = file.name;
    fileSize.textContent = Math.round(file.size / 1024) + " KB";
    uploadArea.classList.add("file-uploaded");
}
removeFileBtn.addEventListener("click", () => {
    proofInput.value = "";
    uploadedFile = null;
    filePreview.classList.add("hidden");
    uploadArea.classList.remove("file-uploaded");
});

// --- Form Submission ---
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validatePage(2)) return;
    // Optional: Process uploaded file, send to server, etc.
    // For demo, just show success.
    form.classList.add("hidden");
    successMessage.classList.remove("hidden");
    launchConfetti();
    window.scrollTo(0, 0);
});

// --- Confetti Animation ---
function launchConfetti() {
    // Basic confetti animation using emojis for demo
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 64; i++) {
        let conf = document.createElement("span");
        conf.className = "confetti";
        conf.textContent = ["🎉", "✨", "🎈", "🥳", "🚩", "🦋"][Math.floor(Math.random() * 6)];
        conf.style.left = 5 + Math.random()*90 + "%";
        conf.style.animationDelay = (Math.random() * 2) + "s";
        confettiContainer.appendChild(conf);
    }
    confettiContainer.classList.add("show");
    setTimeout(() => confettiContainer.classList.remove("show"), 4000);
}

// --- Initial State ---
showPage(0);
updateAcademicFields();

// --- Accessibility: Remove invalid on input ---
document.querySelectorAll(".input-field").forEach(input => {
    input.addEventListener("input", () => input.classList.remove("invalid"));
});

// Helper
const el = selector => document.querySelector(selector);
const els = selector => document.querySelectorAll(selector);

// Progress and section logic
const progressSteps = els('.progress-step');
const formSections = els('.form-section');

function showSection(sectionNum) {
    // Show the correct section
    formSections.forEach(sec => {
        if (sec.dataset.section === sectionNum.toString()) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });
    // Update progress bar
    progressSteps.forEach((step, idx) => {
        const current = parseInt(step.dataset.step);
        if (current < sectionNum) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (current === sectionNum) {
            step.classList.remove('completed');
            step.classList.add('active');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

els('.next-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const next = btn.dataset.next;
        // Validate current section before moving on
        const section = btn.closest('.form-section');
        let valid = true;
        section.querySelectorAll('input,select').forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                valid = false;
            }
        });
        if (!valid) return;
        showSection(next);
        scrollToTop();
    });
});
els('.prev-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const prev = btn.dataset.prev;
        showSection(prev);
        scrollToTop();
    });
});
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Academic logic
const department = el('#department');
const yearLevel = el('#yearLevel');
const strandGroup = el('#strandGroup');
const programGroup = el('#programGroup');
const strand = el('#strand');
const program = el('#program');

const yearOptions = {
    SHS: [11, 12],
    College: [1, 2, 3, 4]
};

department.addEventListener('change', () => {
    // Year level options
    yearLevel.innerHTML = `<option value="">Select Year Level</option>`;
    if (department.value && yearOptions[department.value]) {
        yearOptions[department.value].forEach(yr => {
            yearLevel.innerHTML += `<option value="${yr}">${yr}</option>`;
        });
    }
    // Show/hide strand/program
    if(department.value === "SHS") {
        strandGroup.style.display = '';
        programGroup.style.display = 'none';
        strand.required = true;
        program.required = false;
        program.value = '';
    } else if(department.value === "College") {
        strandGroup.style.display = 'none';
        programGroup.style.display = '';
        strand.required = false;
        program.required = true;
        strand.value = '';
    } else {
        strandGroup.style.display = 'none';
        programGroup.style.display = 'none';
        strand.required = false;
        program.required = false;
        strand.value = '';
        program.value = '';
    }
});

// Form submit logic
const form = el('#attendanceForm');
const formMessage = el('#formMessage');

form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate academic section dynamic fields
    if(department.value === "SHS" && strand.value === "") {
        formMessage.textContent = "Please select your STRAND.";
        strand.focus();
        showSection(2);
        return;
    }
    if(department.value === "College" && program.value === "") {
        formMessage.textContent = "Please select your Program.";
        program.focus();
        showSection(2);
        return;
    }
    // Validate proof of attendance file
    const proof = el('#proof');
    if (!proof.value) {
        formMessage.textContent = "Please upload your Proof of Attendance.";
        proof.focus();
        showSection(3);
        return;
    }

    formMessage.textContent = "Submitting...";
    formMessage.style.color = "#333";

    // Simulate submission
    setTimeout(() => {
        formMessage.textContent = "Attendance submitted successfully!";
        formMessage.style.color = "#388e3c";
        form.reset();
        // Reset sections and progress after submit
        showSection(1);
        strandGroup.style.display = 'none';
        programGroup.style.display = 'none';
    }, 1800);
});

// Initialize first section
showSection(1);

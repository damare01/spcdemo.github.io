// Helper for DOM
const el = selector => document.querySelector(selector);

const department = el('#department');
const yearLevel = el('#yearLevel');
const strandGroup = el('#strandGroup');
const programGroup = el('#programGroup');
const strand = el('#strand');
const program = el('#program');
const form = el('#attendanceForm');
const formMessage = el('#formMessage');

const yearOptions = {
    SHS: [11, 12],
    College: [1, 2, 3, 4]
};

// Handle department change
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

// Form submission handling
form.addEventListener('submit', e => {
    e.preventDefault();

    // Simple validation for dynamic fields
    if(department.value === "SHS" && strand.value === "") {
        formMessage.textContent = "Please select your STRAND.";
        strand.focus();
        return;
    }
    if(department.value === "College" && program.value === "") {
        formMessage.textContent = "Please select your Program.";
        program.focus();
        return;
    }

    formMessage.textContent = "Submitting...";
    formMessage.style.color = "#333";

    // Simulate submission
    setTimeout(() => {
        formMessage.textContent = "Attendance submitted successfully!";
        formMessage.style.color = "#388e3c";
        form.reset();
        strandGroup.style.display = 'none';
        programGroup.style.display = 'none';
    }, 1800);
});

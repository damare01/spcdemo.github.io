// Utility
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Fill Section A-Z
(function fillSections() {
    const sectionSelect = $('#section');
    if (sectionSelect) {
        for (let c = 65; c <= 90; c++) {
            const opt = document.createElement('option');
            opt.value = String.fromCharCode(c);
            opt.text = String.fromCharCode(c);
            sectionSelect.appendChild(opt);
        }
    }
})();

// Multi-Step Form Logic
const steps = $$('.step');
const pages = $$('.form-page');
let currentStep = 1;

function showStep(step) {
    currentStep = step;
    pages.forEach(page => page.classList.remove('active'));
    $(`.form-page[data-page="${step}"]`).classList.add('active');
    steps.forEach(s => {
        s.classList.remove('active', 'completed');
        const sNum = parseInt(s.dataset.step);
        if (sNum < step) {
            s.classList.add('completed');
        } else if (sNum === step) {
            s.classList.add('active');
        }
    });
    $('#formMessage').textContent = '';
}

$$('.next-btn').forEach(btn => {
    btn.onclick = function() {
        const next = parseInt(btn.dataset.next);
        const page = btn.closest('.form-page');
        const fields = page.querySelectorAll('input, select');
        let valid = true;
        for (const field of fields) {
            if (!field.checkValidity()) {
                field.reportValidity();
                valid = false;
                break;
            }
        }
        // Academic: check dynamic field too
        if (valid && next === 3) {
            const department = $('#department').value;
            if (department === 'SHS' && !$('#strand').value) {
                $('#formMessage').textContent = 'Please select your STRAND.';
                showStep(2);
                $('#strand').focus();
                return;
            }
            if (department === 'College' && !$('#program').value) {
                $('#formMessage').textContent = 'Please select your Program.';
                showStep(2);
                $('#program').focus();
                return;
            }
        }
        if (valid) showStep(next);
        window.scrollTo({top:0,behavior:'smooth'});
    }
});
$$('.prev-btn').forEach(btn => {
    btn.onclick = function() {
        showStep(parseInt(btn.dataset.prev));
        window.scrollTo({top:0,behavior:'smooth'});
    }
});

// Department logic
const department = $('#department');
const yearLevel = $('#yearLevel');
const strandGroup = $('#strandGroup');
const programGroup = $('#programGroup');
const strand = $('#strand');
const program = $('#program');

const yearOptions = {
    SHS: [11, 12],
    College: [1, 2, 3, 4]
};

department.addEventListener('change', () => {
    yearLevel.innerHTML = `<option value="">Select Year Level</option>`;
    if (department.value && yearOptions[department.value]) {
        yearOptions[department.value].forEach(yr => {
            yearLevel.innerHTML += `<option value="${yr}">${yr}</option>`;
        });
    }
    if (department.value === "SHS") {
        strandGroup.style.display = '';
        programGroup.style.display = 'none';
        strand.required = true;
        program.required = false;
        program.value = '';
    } else if (department.value === "College") {
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

// Form Submit
const form = $('#attendanceForm');
const formMessage = $('#formMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const proofInput = $('#proof');
    if (!proofInput.value) {
        formMessage.textContent = "Please upload your Proof of Attendance.";
        proofInput.focus();
        showStep(3);
        return;
    }
    formMessage.textContent = "Submitting...";
    formMessage.style.color = "#e21b3c";
    setTimeout(() => {
        formMessage.textContent = 'Attendance submitted! Thank you.';
        form.reset();
        showStep(1);
    }, 1500);
});

showStep(1);

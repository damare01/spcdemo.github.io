import { getDatabase, ref, onValue, set, remove, push, update } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const db = getDatabase();

const eventSelect = document.getElementById('eventSelect');
const addEventBtn = document.getElementById('addEventBtn');
const exportBtn = document.getElementById('exportBtn');
const filterName = document.getElementById('filterName');
const filterDept = document.getElementById('filterDept');
const tableBody = document.getElementById('attendanceTableBody');
const noDataMsg = document.getElementById('noDataMsg');

const modalBG = document.getElementById('modalBG');
const modalTitle = document.getElementById('modalTitle');
const entryForm = document.getElementById('entryForm');
const modalCancel = document.getElementById('modalCancel');
const eventModalBG = document.getElementById('eventModalBG');
const eventForm = document.getElementById('eventForm');
const eventCancel = document.getElementById('eventCancel');

let allEvents = {};
let allEntries = {}; // structure: {eventId: {entryId: entryObj,...}, ...}
let selectedEvent = '';
let filteredEntries = [];

function loadEvents() {
  onValue(ref(db, 'events'), snap => {
    allEvents = snap.val() || {};
    renderEventSelect();
  });
}
function renderEventSelect() {
  eventSelect.innerHTML = '';
  Object.entries(allEvents).forEach(([id, evt], idx) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = evt.name;
    eventSelect.appendChild(opt);
    if (idx === 0 && !selectedEvent) selectedEvent = id;
  });
  if (!selectedEvent && eventSelect.options.length) selectedEvent = eventSelect.options[0].value;
  eventSelect.value = selectedEvent;
  loadAttendance();
}
eventSelect.addEventListener('change', () => {
  selectedEvent = eventSelect.value;
  loadAttendance();
});
addEventBtn.addEventListener('click', () => {
  eventModalBG.style.display = '';
  setTimeout(() => document.getElementById('eventName').focus(), 120);
});
eventCancel.addEventListener('click', () => { eventModalBG.style.display = 'none'; eventForm.reset(); });
eventForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('eventName').value.trim();
  if (!name) return;
  await push(ref(db, 'events'), { name });
  eventModalBG.style.display = 'none';
  eventForm.reset();
});

function loadAttendance() {
  if (!selectedEvent) { tableBody.innerHTML = ''; noDataMsg.style.display = ''; return; }
  onValue(ref(db, `attendance/${selectedEvent}`), snap => {
    allEntries[selectedEvent] = snap.val() || {};
    renderTable();
  });
}
function renderTable() {
  const filterN = filterName.value.trim().toLowerCase();
  const filterD = filterDept.value;
  const entriesArr = Object.entries(allEntries[selectedEvent] || {});
  filteredEntries = entriesArr.filter(([id, entry]) => {
    const matchName = filterN ? (entry.name || '').toLowerCase().includes(filterN) : true;
    const matchDept = filterD ? (entry.department === filterD) : true;
    return matchName && matchDept;
  });
  tableBody.innerHTML = '';
  if (filteredEntries.length === 0) {
    noDataMsg.style.display = '';
    return;
  } else {
    noDataMsg.style.display = 'none';
  }
  for (const [id, entry] of filteredEntries) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.name || ''}</td>
      <td>${entry.email || ''}</td>
      <td>${entry.department || ''}</td>
      <td>${entry.yearLevel || ''}</td>
      <td>${entry.section || ''}</td>
      <td>${entry.strand || ''}</td>
      <td>${entry.program || ''}</td>
      <td>${entry.proof ? `<a href="${entry.proof}" target="_blank">View</a>` : ''}</td>
      <td class="admin-actions">
        <button class="admin-btn secondary" data-edit="${id}">Edit</button>
        <button class="admin-btn danger" data-del="${id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  }
}
filterName.addEventListener('input', renderTable);
filterDept.addEventListener('change', renderTable);

// Add / Edit entry
tableBody.addEventListener('click', function(e) {
  if (e.target.dataset.edit) {
    openEditModal(e.target.dataset.edit);
  } else if (e.target.dataset.del) {
    if (confirm('Delete this entry?')) {
      remove(ref(db, `attendance/${selectedEvent}/${e.target.dataset.del}`));
    }
  }
});

function openEditModal(entryId) {
  const entry = allEntries[selectedEvent][entryId];
  modalTitle.textContent = 'Edit Entry';
  document.getElementById('entryId').value = entryId;
  document.getElementById('entryName').value = entry.name || '';
  document.getElementById('entryEmail').value = entry.email || '';
  document.getElementById('entryDept').value = entry.department || '';
  document.getElementById('entryYear').value = entry.yearLevel || '';
  document.getElementById('entrySection').value = entry.section || '';
  document.getElementById('entryStrand').value = entry.strand || '';
  document.getElementById('entryProgram').value = entry.program || '';
  document.getElementById('entryProof').value = entry.proof || '';
  modalBG.style.display = '';
}
modalCancel.addEventListener('click', () => { modalBG.style.display = 'none'; entryForm.reset(); });
entryForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('entryId').value;
  const obj = {
    name: document.getElementById('entryName').value,
    email: document.getElementById('entryEmail').value,
    department: document.getElementById('entryDept').value,
    yearLevel: document.getElementById('entryYear').value,
    section: document.getElementById('entrySection').value,
    strand: document.getElementById('entryStrand').value,
    program: document.getElementById('entryProgram').value,
    proof: document.getElementById('entryProof').value,
    timestamp: new Date().toISOString()
  };
  if (id) {
    await set(ref(db, `attendance/${selectedEvent}/${id}`), obj);
  } else {
    await push(ref(db, `attendance/${selectedEvent}`), obj);
  }
  modalBG.style.display = 'none';
  entryForm.reset();
});

// Add new entry
// (For admin, could add a + Add Entry button, or use "edit" modal with blank fields for new entries if needed)

// Export CSV
exportBtn.addEventListener('click', function() {
  if (!filteredEntries.length) return alert('No data to export!');
  const header = ['Name','Email','Department','Year','Section','Strand','Program','Proof'];
  const csvRows = [
    header.join(','),
    ...filteredEntries.map(([id, entry]) =>
      header.map(k => {
        let val = '';
        switch (k) {
          case 'Name': val = entry.name; break;
          case 'Email': val = entry.email; break;
          case 'Department': val = entry.department; break;
          case 'Year': val = entry.yearLevel; break;
          case 'Section': val = entry.section; break;
          case 'Strand': val = entry.strand; break;
          case 'Program': val = entry.program; break;
          case 'Proof': val = entry.proof; break;
        }
        if (val == null) val = '';
        // Escape CSV
        val = (''+val).replace(/"/g, '""');
        if (/,|\n|"/.test(val)) val = `"${val}"`;
        return val;
      }).join(',')
    )
  ];
  const blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (allEvents[selectedEvent]?.name || 'attendance') + '-attendance.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 250);
});

loadEvents();
const STORAGE_KEY = 'trakk-state';
const LEGACY_STORAGE_KEY = 'trakk-v0-2-state';
const APP_VERSION = '0.4.0-dev';

const clubs = [
  { id: 'club_gym', name: 'Gym', clubType: 'gym', defaultCurrency: 'AUD', timezone: 'Australia/Adelaide' },
  { id: 'club_001', name: '4D Dance', clubType: 'dance_school', defaultCurrency: 'AUD', timezone: 'Australia/Adelaide' }
];

const pricingPlans = [
  { id: 'gym_subscription', clubId: 'club_gym', name: 'Weekly subscription', price: 40, cadence: 'per week' },
  { id: 'gym_casual', clubId: 'club_gym', name: 'Casual', price: null, cadence: 'per visit' },
  { id: 'gym_cash', clubId: 'club_gym', name: 'Cashie', price: null, cadence: 'per visit' },
  { id: 'dance_single', clubId: 'club_001', name: 'Single class', price: 20, cadence: 'per class' },
  { id: 'dance_8_pass', clubId: 'club_001', name: '8 class pass', price: 120, cadence: '4 month expiry' },
  { id: 'dance_term', clubId: 'club_001', name: 'Term pass', price: 80, cadence: '8 consecutive weeks' },
  { id: 'dance_private_one', clubId: 'club_001', name: 'Private lesson — one teacher', price: 80, cadence: 'per hour' },
  { id: 'dance_private_two', clubId: 'club_001', name: 'Private lesson — two teachers', price: 120, cadence: 'per hour' },
  { id: 'dance_intro', clubId: 'club_001', name: 'Newcomer group intro', price: 30, cadence: 'first 8 classes' }
];

const initialMembers = [
  { id: 'gym_001', clubId: 'club_gym', firstName: 'Chris', lastName: 'Walker', status: 'active', pricingLabel: 'Weekly subscription', sessionBalance: null, memberType: 'member', notes: 'Regular.' },
  { id: 'gym_002', clubId: 'club_gym', firstName: 'Jordan', lastName: 'King', status: 'active', pricingLabel: 'Weekly subscription', sessionBalance: null, memberType: 'member', notes: 'Regular.' },
  { id: 'gym_003', clubId: 'club_gym', firstName: 'Taylor', lastName: 'Mills', status: 'casual', pricingLabel: 'Casual', sessionBalance: 0, memberType: 'member', notes: 'Casual attendee.' },
  {
    id: 'member_001',
    clubId: 'club_001',
    firstName: 'Jane',
    lastName: 'Smith',
    status: 'active',
    pricingLabel: '8 Class Pass',
    sessionBalance: 7,
    memberType: 'member',
    notes: 'Regular Monday attendee.'
  },
  {
    id: 'member_002',
    clubId: 'club_001',
    firstName: 'Alex',
    lastName: 'Brown',
    status: 'trial',
    pricingLabel: 'Free Trial',
    sessionBalance: 1,
    memberType: 'trial',
    notes: 'First night free.'
  },
  {
    id: 'member_003',
    clubId: 'club_001',
    firstName: 'Morgan',
    lastName: 'Lee',
    status: 'active',
    pricingLabel: 'Casual',
    sessionBalance: 0,
    memberType: 'member',
    notes: 'Pays casually.'
  },
  {
    id: 'member_004',
    clubId: 'club_001',
    firstName: 'Sam',
    lastName: 'Taylor',
    status: 'active',
    pricingLabel: 'Term Pass',
    sessionBalance: 5,
    memberType: 'member',
    notes: 'Often attends Level 2.'
  },
  {
    id: 'member_005',
    clubId: 'club_001',
    firstName: 'Riley',
    lastName: 'Chen',
    status: 'active',
    pricingLabel: 'Private Lessons',
    sessionBalance: 3,
    memberType: 'member',
    notes: 'Private lesson package.'
  },
  {
    id: 'member_006',
    clubId: 'club_001',
    firstName: 'Casey',
    lastName: 'Nguyen',
    status: 'staff',
    pricingLabel: 'Staff / Volunteer',
    sessionBalance: null,
    memberType: 'staff',
    notes: 'Volunteer helper.'
  }
];

const initialSessions = [
  { id: 'gym_mon_run', clubId: 'club_gym', title: 'Monday Run Training', sessionType: 'Run training', startDateTime: '2026-07-13T18:00:00+09:30', endDateTime: '2026-07-13T19:00:00+09:30', instructor: 'Coach', location: 'Gym', capacity: 30, notes: 'Weekly run training.' },
  { id: 'gym_tue_am', clubId: 'club_gym', title: 'Tuesday AM', sessionType: 'Group training', startDateTime: '2026-07-14T06:00:00+09:30', endDateTime: '2026-07-14T07:00:00+09:30', instructor: 'Coach', location: 'Gym', capacity: 30, notes: 'Regular morning session.' },
  { id: 'gym_tue_pm', clubId: 'club_gym', title: 'Tuesday PM', sessionType: 'Group training', startDateTime: '2026-07-14T18:00:00+09:30', endDateTime: '2026-07-14T19:00:00+09:30', instructor: 'Coach', location: 'Gym', capacity: 30, notes: 'Regular evening session.' },
  { id: 'gym_wed_am', clubId: 'club_gym', title: 'Wednesday AM', sessionType: 'Group training', startDateTime: '2026-07-15T06:00:00+09:30', endDateTime: '2026-07-15T07:00:00+09:30', instructor: 'Coach', location: 'Gym', capacity: 30, notes: 'Regular morning session.' },
  { id: 'gym_wed_pm', clubId: 'club_gym', title: 'Wednesday PM', sessionType: 'Group training', startDateTime: '2026-07-15T18:00:00+09:30', endDateTime: '2026-07-15T19:00:00+09:30', instructor: 'Coach', location: 'Gym', capacity: 30, notes: 'Regular evening session.' },
  { id: 'gym_private', clubId: 'club_gym', title: 'Gym Private Sessions', sessionType: 'Private lessons', startDateTime: '2026-07-16T18:00:00+09:30', endDateTime: '2026-07-16T20:00:00+09:30', instructor: 'Coach', location: 'Gym', capacity: 4, notes: 'Private coaching block.' },
  {
    id: 'session_001',
    clubId: 'club_001',
    title: 'Monday Beginners Class',
    sessionType: 'Group class',
    startDateTime: '2026-07-06T19:30:00+09:30',
    endDateTime: '2026-07-06T21:30:00+09:30',
    instructor: 'John',
    location: 'Mitcham Cultural Centre',
    capacity: 40,
    notes: 'Beginners and Level 2 classes.'
  },
  { id: 'session_shed', clubId: 'club_001', title: 'Tuesday Shed', sessionType: 'Group class', startDateTime: '2026-07-14T19:00:00+09:30', endDateTime: '2026-07-14T21:00:00+09:30', instructor: 'Team', location: 'The Shed', capacity: 30, notes: 'Tuesday dance session.' },
  {
    id: 'session_002',
    clubId: 'club_001',
    title: 'Tuesday Private Lessons',
    sessionType: 'Private lessons',
    startDateTime: '2026-07-07T18:00:00+09:30',
    endDateTime: '2026-07-07T21:00:00+09:30',
    instructor: 'John',
    location: 'Studio Room',
    capacity: 6,
    notes: 'Private lesson block.'
  },
  {
    id: 'session_003',
    clubId: 'club_001',
    title: 'Sunday Social',
    sessionType: 'Social event',
    startDateTime: '2026-07-12T19:00:00+09:30',
    endDateTime: '2026-07-12T23:00:00+09:30',
    instructor: 'Team',
    location: 'Marion Hotel',
    capacity: 100,
    notes: 'Monthly social dance.'
  }
];

const paymentOptions = [
  { id: 'paid_casual', label: 'Paid' },
  { id: 'pass_used', label: 'Pass' },
  { id: 'free_trial', label: 'Trial' },
  { id: 'complimentary', label: 'Free' },
  { id: 'private_lesson', label: 'Private' },
  { id: 'staff_volunteer', label: 'Staff' }
];

let state = loadState();
let memberSearch = '';

function createInitialState() {
  return {
    selectedClubId: 'club_001',
    selectedSessionId: 'session_001',
    members: initialMembers,
    sessions: initialSessions,
    attendanceRecords: []
  };
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!savedState) {
    return createInitialState();
  }

  try {
    const parsedState = JSON.parse(savedState);

    const mergeById = (saved = [], defaults = []) => [
      ...saved,
      ...defaults.filter(defaultItem => !saved.some(savedItem => savedItem.id === defaultItem.id))
    ];

    return {
      ...createInitialState(),
      ...parsedState,
      selectedClubId: parsedState.selectedClubId || 'club_001',
      members: mergeById(parsedState.members, initialMembers),
      sessions: mergeById(parsedState.sessions, initialSessions),
      attendanceRecords: parsedState.attendanceRecords || []
    };
  } catch (error) {
    console.warn('Unable to load saved Trakk state. Starting fresh.', error);
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatMemberName(member) {
  return `${member.firstName} ${member.lastName}`;
}

function getSelectedSession() {
  return state.sessions.find(session => session.id === state.selectedSessionId)
    || state.sessions.find(session => session.clubId === state.selectedClubId);
}

function getSelectedClub() {
  return clubs.find(club => club.id === state.selectedClubId) || clubs[0];
}

function getClubSessions() {
  return state.sessions.filter(session => session.clubId === state.selectedClubId);
}

function getClubMembers() {
  return state.members.filter(member => member.clubId === state.selectedClubId);
}

function getAttendanceForSelectedSession() {
  const session = getSelectedSession();
  return state.attendanceRecords.filter(record => record.sessionId === session.id);
}

function getRecordForMember(memberId) {
  const session = getSelectedSession();
  return state.attendanceRecords.find(
    record => record.memberId === memberId && record.sessionId === session.id
  );
}

function formatPaymentStatus(status) {
  const option = paymentOptions.find(item => item.id === status);
  return option ? option.label : status;
}

function formatSessionDate(dateTime) {
  return new Date(dateTime).toLocaleString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function recordAttendance(memberId, paymentStatus) {
  const session = getSelectedSession();
  const existingRecord = getRecordForMember(memberId);

  if (existingRecord) {
    existingRecord.paymentStatus = paymentStatus;
    existingRecord.attendanceStatus = 'present';
    existingRecord.recordedAt = new Date().toISOString();
  } else {
    state.attendanceRecords.push({
      id: `attendance_${Date.now()}`,
      clubId: state.selectedClubId,
      sessionId: session.id,
      memberId,
      attendanceStatus: 'present',
      paymentStatus,
      recordedAt: new Date().toISOString(),
      notes: ''
    });
  }

  saveState();
  render();
}

function removeAttendance(memberId) {
  const session = getSelectedSession();
  state.attendanceRecords = state.attendanceRecords.filter(
    record => !(record.memberId === memberId && record.sessionId === session.id)
  );

  saveState();
  render();
}

function addWalkIn(event) {
  event.preventDefault();
  const form = event.target;
  const nameInput = form.elements.walkInName;
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    return;
  }

  const [firstName, ...lastNameParts] = name.split(' ');
  const member = {
    id: `walkin_${Date.now()}`,
    clubId: state.selectedClubId,
    firstName,
    lastName: lastNameParts.join(' ') || 'Walk-in',
    status: 'walk-in',
    pricingLabel: 'Walk-in',
    sessionBalance: 0,
    memberType: 'walk-in',
    notes: 'Added during attendance check-in.'
  };

  state.members.push(member);
  recordAttendance(member.id, form.elements.walkInPayment.value);
  form.reset();
}

function addMember(event) {
  event.preventDefault();
  const form = event.target;
  const firstName = form.elements.firstName.value.trim();
  const lastName = form.elements.lastName.value.trim();

  if (!firstName || !lastName) return;

  state.members.push({
    id: `member_${Date.now()}`,
      clubId: state.selectedClubId,
    firstName,
    lastName,
    status: 'active',
    pricingLabel: form.elements.pricingLabel.value,
    sessionBalance: Number(form.elements.sessionBalance.value || 0),
    memberType: 'member',
    notes: ''
  });
  saveState();
  render();
}

function exportBackup() {
  const payload = JSON.stringify({ version: APP_VERSION, exportedAt: new Date().toISOString(), ...state }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = `trakk-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importBackup(event) {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.members) || !Array.isArray(imported.sessions) || !Array.isArray(imported.attendanceRecords)) {
        throw new Error('Missing Trakk data collections.');
      }
      state = { ...createInitialState(), ...imported };
      saveState();
      render();
    } catch (error) {
      window.alert(`Backup could not be imported: ${error.message}`);
    }
  });
  reader.readAsText(file);
}

function resetSelectedSession() {
  if (!window.confirm('Clear every attendance record for this session?')) return;
  const session = getSelectedSession();
  state.attendanceRecords = state.attendanceRecords.filter(
    record => record.sessionId !== session.id
  );

  saveState();
  render();
}

function getSummary() {
  const records = getAttendanceForSelectedSession();
  return paymentOptions.reduce((summary, option) => {
    summary[option.id] = records.filter(record => record.paymentStatus === option.id).length;
    return summary;
  }, { total: records.length });
}

function renderSummaryCards(summary) {
  return `
    <div class="summary-grid">
      <div class="summary-card hero-summary">
        <span class="summary-number">${summary.total}</span>
        <span class="summary-label">Present</span>
      </div>
      ${paymentOptions.map(option => `
        <div class="summary-card compact-summary">
          <span class="summary-number">${summary[option.id]}</span>
          <span class="summary-label">${option.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSessionSelector() {
  return `
    <label class="field-label" for="session-select">Session</label>
    <select id="session-select">
      ${getClubSessions().map(session => `
        <option value="${session.id}" ${session.id === state.selectedSessionId ? 'selected' : ''}>
          ${session.title} — ${formatSessionDate(session.startDateTime)}
        </option>
      `).join('')}
    </select>
  `;
}

function renderClubSelector() {
  return `<label class="field-label" for="club-select">Club profile</label>
    <select id="club-select">${clubs.map(club => `<option value="${club.id}" ${club.id === state.selectedClubId ? 'selected' : ''}>${club.name}</option>`).join('')}</select>`;
}

function renderPricingPlans() {
  return `<section class="pricing-card"><h2>Pricing</h2><div class="pricing-grid">
    ${pricingPlans.filter(plan => plan.clubId === state.selectedClubId).map(plan => `<article><strong>${escapeHtml(plan.name)}</strong><span>${plan.price === null ? 'Price set at check-in' : `$${plan.price}`} · ${escapeHtml(plan.cadence)}</span></article>`).join('')}
  </div></section>`;
}

function renderWalkInForm() {
  return `
    <form class="walk-in-form" id="walk-in-form">
      <div>
        <label class="field-label" for="walkInName">Add walk-in</label>
        <input id="walkInName" name="walkInName" type="text" placeholder="Name" autocomplete="off" />
      </div>
      <div>
        <label class="field-label" for="walkInPayment">Type</label>
        <select id="walkInPayment" name="walkInPayment">
          ${paymentOptions.map(option => `<option value="${option.id}">${option.label}</option>`).join('')}
        </select>
      </div>
      <button type="submit">Add & check in</button>
    </form>
  `;
}

function renderMemberCard(member) {
  const record = getRecordForMember(member.id);
  const isPresent = Boolean(record);
  const balanceLabel = member.sessionBalance === null ? 'unlimited' : `${member.sessionBalance} sessions left`;

  return `
    <article class="member-card ${isPresent ? 'is-present' : ''}">
      <div class="member-info">
        <h3>${escapeHtml(formatMemberName(member))}</h3>
        <p>${escapeHtml(member.status)} · ${escapeHtml(member.pricingLabel)} · ${balanceLabel}</p>
        ${record ? `<p class="record-status">Marked: ${formatPaymentStatus(record.paymentStatus)}</p>` : ''}
      </div>
      <div class="actions">
        ${paymentOptions.map(option => `
          <button
            class="${record && record.paymentStatus === option.id ? 'selected-action' : ''}"
            data-action="record"
            data-member-id="${member.id}"
            data-payment-status="${option.id}"
          >${option.label}</button>
        `).join('')}
        ${record ? `<button class="secondary-button" data-action="remove" data-member-id="${member.id}">Undo</button>` : ''}
      </div>
    </article>
  `;
}

function render() {
  const app = document.querySelector('#app');
  const club = getSelectedClub();
  const session = getSelectedSession();
  const summary = getSummary();

  app.innerHTML = `
    <header class="app-header">
      <div>
        <p class="eyebrow">${club.name}</p>
        <h1>Trakk Attendance</h1>
        <p class="version-label">v${APP_VERSION} Member & Data Tools</p>
      </div>
      <div class="data-actions">
        <button class="secondary-button" id="export-backup">Export backup</button>
        <label class="button-label" for="import-backup">Import backup</label>
        <input class="visually-hidden" id="import-backup" type="file" accept="application/json,.json" />
      </div>
    </header>

    ${renderSummaryCards(summary)}

    <section class="session-card">
      ${renderClubSelector()}
      <div class="club-selector-spacer"></div>
      ${renderSessionSelector()}
      <div class="session-details">
        <h2>${session.title}</h2>
        <p>${session.sessionType} · ${formatSessionDate(session.startDateTime)}</p>
        <p>${session.location} · Instructor: ${session.instructor} · Capacity: ${session.capacity}</p>
        <p>${session.notes}</p>
      </div>
      <button class="secondary-button danger-button" id="reset-session">Clear this session</button>
    </section>

    ${renderPricingPlans()}

    <section class="walk-in-card">
      ${renderWalkInForm()}
    </section>

    <section class="member-tools-card">
      <div>
        <label class="field-label" for="member-search">Find member</label>
        <input id="member-search" type="search" placeholder="Search by name" value="${escapeHtml(memberSearch)}" />
      </div>
      <form class="add-member-form" id="add-member-form">
        <input name="firstName" required placeholder="First name" />
        <input name="lastName" required placeholder="Last name" />
        <select name="pricingLabel">${pricingPlans.filter(plan => plan.clubId === state.selectedClubId).map(plan => `<option>${escapeHtml(plan.name)}</option>`).join('')}</select>
        <input name="sessionBalance" type="number" min="0" value="0" aria-label="Session balance" />
        <button type="submit">Add member</button>
      </form>
    </section>

    <section class="member-list">
      ${getClubMembers()
        .filter(member => formatMemberName(member).toLowerCase().includes(memberSearch.toLowerCase()))
        .map(renderMemberCard).join('') || '<p class="empty-state">No members match that search.</p>'}
    </section>
  `;

  document.querySelector('#session-select').addEventListener('change', event => {
    state.selectedSessionId = event.target.value;
    saveState();
    render();
  });
  document.querySelector('#club-select').addEventListener('change', event => {
    state.selectedClubId = event.target.value;
    state.selectedSessionId = getClubSessions()[0].id;
    memberSearch = '';
    saveState();
    render();
  });

  document.querySelector('#walk-in-form').addEventListener('submit', addWalkIn);
  document.querySelector('#add-member-form').addEventListener('submit', addMember);
  document.querySelector('#member-search').addEventListener('input', event => {
    memberSearch = event.target.value;
    render();
    const search = document.querySelector('#member-search');
    search.focus();
    search.setSelectionRange(memberSearch.length, memberSearch.length);
  });
  document.querySelector('#export-backup').addEventListener('click', exportBackup);
  document.querySelector('#import-backup').addEventListener('change', importBackup);
  document.querySelector('#reset-session').addEventListener('click', resetSelectedSession);

  document.querySelectorAll('[data-action="record"]').forEach(button => {
    button.addEventListener('click', event => {
      recordAttendance(
        event.target.dataset.memberId,
        event.target.dataset.paymentStatus
      );
    });
  });

  document.querySelectorAll('[data-action="remove"]').forEach(button => {
    button.addEventListener('click', event => {
      removeAttendance(event.target.dataset.memberId);
    });
  });
}

render();

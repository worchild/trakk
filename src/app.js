const TRAKK_BOOTSTRAP = window.TRAKK_BOOTSTRAP || {};
const STORAGE_KEY = TRAKK_BOOTSTRAP.storageKey || 'trakk-state';
const LEGACY_STORAGE_KEY = TRAKK_BOOTSTRAP.storageKey ? null : 'trakk-v0-2-state';
const APP_VERSION = TRAKK_BOOTSTRAP.version || '0.11.0-rc.2';
const APP_CONFIG = {
  activeClubId: TRAKK_BOOTSTRAP.activeClubId || 'club_001'
};

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

const initialMembers = TRAKK_BOOTSTRAP.members || [
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

const initialSessions = TRAKK_BOOTSTRAP.sessions || [
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

const initialScheduleTemplates = [
  { id: 'tpl_gym_mon_run', clubId: 'club_gym', title: 'Monday Run Training', weekday: 1, startTime: '18:00', durationMinutes: 60, sessionType: 'Run training', instructor: 'Coach', location: 'Gym', capacity: 30 },
  { id: 'tpl_gym_tue_am', clubId: 'club_gym', title: 'Tuesday AM', weekday: 2, startTime: '06:00', durationMinutes: 60, sessionType: 'Group training', instructor: 'Coach', location: 'Gym', capacity: 30 },
  { id: 'tpl_gym_tue_pm', clubId: 'club_gym', title: 'Tuesday PM', weekday: 2, startTime: '18:00', durationMinutes: 60, sessionType: 'Group training', instructor: 'Coach', location: 'Gym', capacity: 30 },
  { id: 'tpl_gym_wed_am', clubId: 'club_gym', title: 'Wednesday AM', weekday: 3, startTime: '06:00', durationMinutes: 60, sessionType: 'Group training', instructor: 'Coach', location: 'Gym', capacity: 30 },
  { id: 'tpl_gym_wed_pm', clubId: 'club_gym', title: 'Wednesday PM', weekday: 3, startTime: '18:00', durationMinutes: 60, sessionType: 'Group training', instructor: 'Coach', location: 'Gym', capacity: 30 },
  { id: 'tpl_dance_mon', clubId: 'club_001', title: 'Monday Dance Classes', weekday: 1, startTime: '19:30', durationMinutes: 120, sessionType: 'Group class', instructor: 'Team', location: 'Mitcham Cultural Centre', capacity: 40 },
  { id: 'tpl_dance_shed', clubId: 'club_001', title: 'Tuesday Shed', weekday: 2, startTime: '19:00', durationMinutes: 120, sessionType: 'Group class', instructor: 'Team', location: 'The Shed', capacity: 30 }
];

const paymentOptions = [
  { id: 'pending', label: 'Pending' },
  { id: 'paid_casual', label: 'Paid' },
  { id: 'pass_used', label: 'Pass' },
  { id: 'free_trial', label: 'Trial' },
  { id: 'complimentary', label: 'Free' },
  { id: 'private_lesson', label: 'Private' },
  { id: 'staff_volunteer', label: 'Staff' }
];

const referralOptions = ['Friend', 'Group ON', 'FaceBook', 'Another dance school', 'Other'];

let state = loadState();
let memberSearch = '';
let activeTab = 'attendance';
let adminTermFilter = 'All terms';

function createInitialState() {
  return {
    selectedClubId: APP_CONFIG.activeClubId,
    selectedSessionId: TRAKK_BOOTSTRAP.selectedSessionId || initialSessions[0]?.id,
    members: initialMembers,
    sessions: initialSessions,
    scheduleTemplates: initialScheduleTemplates,
    attendanceRecords: []
  };
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY)
    || (LEGACY_STORAGE_KEY ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);

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
      selectedClubId: APP_CONFIG.activeClubId,
      members: mergeById(parsedState.members, initialMembers).map(member => ({
        ...member,
        clubId: member.clubId || APP_CONFIG.activeClubId
      })),
      sessions: mergeById(parsedState.sessions, initialSessions),
      scheduleTemplates: mergeById(parsedState.scheduleTemplates, initialScheduleTemplates),
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
  return state.sessions.find(session => session.id === state.selectedSessionId && session.clubId === state.selectedClubId)
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

function getAttendanceMemberMatches() {
  const query = memberSearch.trim().toLowerCase();
  if (!query) return getClubMembers();

  return getClubMembers().filter(member => [
    formatMemberName(member),
    member.phone,
    member.email
  ].some(value => String(value || '').toLowerCase().includes(query)));
}

function getClubScheduleTemplates() {
  return state.scheduleTemplates.filter(template => template.clubId === state.selectedClubId);
}

function getDefaultTerm(date = new Date()) {
  const month = date.getMonth() + 1;
  const termNumber = month <= 3 ? 1 : month <= 6 ? 2 : month <= 9 ? 3 : 4;
  return `${date.getFullYear()} Term ${termNumber}`;
}

function getSessionTerm(session) {
  return session.term || getDefaultTerm(new Date(session.startDateTime));
}

function getTermOptions() {
  const terms = [...new Set(getClubSessions().map(getSessionTerm))].sort();
  return ['All terms', ...terms];
}

function getAdminSessions() {
  return getClubSessions()
    .filter(session => adminTermFilter === 'All terms' || getSessionTerm(session) === adminTermFilter)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
}

function toLocalInputValue(dateTime) {
  const date = new Date(dateTime);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toIsoDateTime(localDateTime) {
  return new Date(localDateTime).toISOString();
}

function formatLocalDatePart(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMinutes(dateTime, minutes) {
  return new Date(new Date(dateTime).getTime() + minutes * 60000).toISOString();
}

function saveSession(event) {
  event.preventDefault();
  const form = event.target;
  const existing = state.sessions.find(session => session.id === form.elements.sessionId.value);
  const startDateTime = toIsoDateTime(form.elements.startDateTime.value);
  const session = {
    id: existing?.id || `session_${Date.now()}`,
    clubId: state.selectedClubId,
    title: form.elements.title.value.trim(),
    sessionType: form.elements.sessionType.value.trim(),
    term: form.elements.term.value.trim(),
    startDateTime,
    endDateTime: addMinutes(startDateTime, Number(form.elements.durationMinutes.value)),
    instructor: form.elements.instructor.value.trim(),
    location: form.elements.location.value.trim(),
    capacity: Number(form.elements.capacity.value),
    notes: form.elements.notes.value.trim()
  };

  if (existing) Object.assign(existing, session);
  else state.sessions.push(session);
  state.selectedSessionId = session.id;
  saveState();
  render();
}

function generateRecurringSessions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let added = 0;

  getClubScheduleTemplates().forEach(template => {
    for (let week = 0; week < 4; week += 1) {
      const date = new Date(today);
      const daysAhead = (template.weekday - date.getDay() + 7) % 7 + week * 7;
      date.setDate(date.getDate() + daysAhead);
      const datePart = formatLocalDatePart(date);
      const startDateTime = toIsoDateTime(`${datePart}T${template.startTime}`);
      const id = `${template.id}_${datePart}`;
      if (state.sessions.some(session => session.id === id)) continue;
      state.sessions.push({
        ...template,
        id,
        templateId: template.id,
        startDateTime,
        endDateTime: addMinutes(startDateTime, template.durationMinutes),
        notes: 'Generated from weekly schedule.'
      });
      added += 1;
    }
  });
  saveState();
  window.alert(`${added} sessions added for the next four weeks.`);
  render();
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
  const referralSource = form.elements.referralSource.value;

  if (!name || !referralSource) {
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
    referralSource,
    notes: `Added during attendance check-in. Heard about us: ${referralSource}.`
  };

  state.members.push(member);
  recordAttendance(member.id, 'pending');
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
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(),
    emergencyContactName: form.elements.emergencyContactName.value.trim(),
    emergencyContactPhone: form.elements.emergencyContactPhone.value.trim(),
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

function renderPricingPlans() {
  return `<section class="pricing-card"><h2>Pricing</h2><div class="pricing-grid">
    ${pricingPlans.filter(plan => plan.clubId === state.selectedClubId).map(plan => `<article><strong>${escapeHtml(plan.name)}</strong><span>${plan.price === null ? 'Price set at check-in' : `$${plan.price}`} · ${escapeHtml(plan.cadence)}</span></article>`).join('')}
  </div></section>`;
}

function renderScheduleManager(session) {
  const durationMinutes = Math.round((new Date(session.endDateTime) - new Date(session.startDateTime)) / 60000);
  return `
    <section class="schedule-card">
      <div class="section-heading">
        <div><p class="eyebrow">Term scheduling</p><h2>Session editor</h2></div>
        <button id="generate-sessions" type="button">Generate next 4 weeks</button>
      </div>
      <p class="template-summary">${getClubScheduleTemplates().length} weekly templates configured for ${escapeHtml(getSelectedClub().name)}.</p>
      <div class="session-admin-controls">
        <label><span>Term</span><select id="admin-term-filter">${getTermOptions().map(term => `<option ${term === adminTermFilter ? 'selected' : ''}>${escapeHtml(term)}</option>`).join('')}</select></label>
        <label><span>Session to edit</span><select id="admin-session-select">${getAdminSessions().map(item => `<option value="${item.id}" ${item.id === session.id ? 'selected' : ''}>${escapeHtml(item.title)} — ${formatSessionDate(item.startDateTime)}</option>`).join('')}</select></label>
      </div>
      <form class="session-form" id="session-form">
        <input type="hidden" name="sessionId" value="${session.id}" />
        <label><span>Title</span><input name="title" required value="${escapeHtml(session.title)}" /></label>
        <label><span>Type</span><input name="sessionType" required value="${escapeHtml(session.sessionType)}" /></label>
        <label><span>Term</span><input name="term" required value="${escapeHtml(getSessionTerm(session))}" placeholder="2026 Term 3" /></label>
        <label><span>Starts</span><input name="startDateTime" type="datetime-local" required value="${toLocalInputValue(session.startDateTime)}" /></label>
        <label><span>Minutes</span><input name="durationMinutes" type="number" min="15" step="15" required value="${durationMinutes}" /></label>
        <label><span>Instructor</span><input name="instructor" required value="${escapeHtml(session.instructor)}" /></label>
        <label><span>Location</span><input name="location" required value="${escapeHtml(session.location)}" /></label>
        <label><span>Capacity</span><input name="capacity" type="number" min="1" required value="${session.capacity}" /></label>
        <label class="wide-field"><span>Notes</span><input name="notes" value="${escapeHtml(session.notes)}" /></label>
        <div class="form-actions">
          <button type="submit">Save session</button>
          <button type="button" class="secondary-button" id="new-session">Create new</button>
        </div>
      </form>
    </section>`;
}

function prepareNewSession() {
  const start = new Date();
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  state.sessions.push({
    id: `draft_${Date.now()}`,
    clubId: state.selectedClubId,
    title: 'New session',
    sessionType: 'Group session',
    term: adminTermFilter === 'All terms' ? getDefaultTerm(start) : adminTermFilter,
    startDateTime: start.toISOString(),
    endDateTime: addMinutes(start.toISOString(), 60),
    instructor: '',
    location: '',
    capacity: 20,
    notes: '',
    isDraft: true
  });
  state.selectedSessionId = state.sessions.at(-1).id;
  render();
}

function renderNewcomerRows() {
  return `
    <section class="newcomer-card">
      <div class="section-heading"><div><p class="eyebrow">New and casual attendees</p><h2>Newcomer check-in</h2></div></div>
      <div class="newcomer-rows">
          <form class="walk-in-form" data-newcomer-form>
            <input name="walkInName" type="text" placeholder="New attendee name" autocomplete="off" aria-label="New attendee name" />
            <select name="referralSource" required aria-label="How did they hear about us?">
              <option value="" disabled selected>How did they hear about us?</option>
              ${referralOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
            <button type="submit" class="here-button">Add & Here</button>
          </form>
      </div>
    </section>
  `;
}

function getBillingSummary(member) {
  const plan = pricingPlans.find(item => item.clubId === member.clubId && item.name.toLowerCase() === member.pricingLabel.toLowerCase());
  const balance = member.sessionBalance === null ? 'Subscription active' : `${member.sessionBalance} classes remaining`;
  if (!plan) return `${member.pricingLabel} · ${balance}`;
  const price = plan.price === null ? 'Pay at attendance' : `$${plan.price}`;
  return `${plan.name} · ${price} ${plan.cadence} · ${balance}`;
}

function renderContactDetails(member) {
  return `<div class="contact-control">
    <button type="button" class="contact-button" data-action="contact" aria-expanded="false">Contact details</button>
    <div class="contact-popover">
      <strong>Member</strong>
      <span>${escapeHtml(member.phone || 'Phone not recorded')}</span>
      <span>${escapeHtml(member.email || 'Email not recorded')}</span>
      <strong>Emergency contact</strong>
      <span>${escapeHtml(member.emergencyContactName || 'Name not recorded')}</span>
      <span>${escapeHtml(member.emergencyContactPhone || 'Phone not recorded')}</span>
    </div>
  </div>`;
}

function renderMemberCard(member) {
  const record = getRecordForMember(member.id);
  const isPresent = Boolean(record);

  return `
    <article class="member-card ${isPresent ? 'is-present' : ''}" data-attendance-card data-member-id="${member.id}" role="button" tabindex="0" aria-pressed="${isPresent}">
      <div class="member-info">
        <h3>${escapeHtml(formatMemberName(member))}${member.memberType === 'walk-in' ? '<span class="new-badge">New</span>' : ''}</h3>
        <p class="billing-info">${escapeHtml(getBillingSummary(member))}</p>
        <p class="member-status">${escapeHtml(member.status)}</p>
        ${record ? `<p class="record-status">Marked: ${formatPaymentStatus(record.paymentStatus)}</p>` : ''}
        ${renderContactDetails(member)}
      </div>
      <div class="actions">
        <button
          class="here-button ${record ? 'is-here' : ''}"
          data-action="here"
          data-member-id="${member.id}"
        >${record ? 'Here ✓' : 'Here'}</button>
      </div>
    </article>
  `;
}

function renderTabs() {
  return `<nav class="tabs" aria-label="Trakk sections">
    <button class="tab-button ${activeTab === 'attendance' ? 'active-tab' : ''}" data-tab="attendance">Attendance</button>
    <button class="tab-button ${activeTab === 'members' ? 'active-tab' : ''}" data-tab="members">Members</button>
    <button class="tab-button ${activeTab === 'sessions' ? 'active-tab' : ''}" data-tab="sessions">Sessions</button>
  </nav>`;
}

function renderBillingButtons(record) {
  return paymentOptions.filter(option => option.id !== 'pending').map(option => `
    <button class="charge-button ${record.paymentStatus === option.id ? 'selected-charge' : ''}"
      data-action="charge" data-member-id="${record.memberId}" data-payment-status="${option.id}">${option.label}</button>
  `).join('');
}

function getTermAttendanceRows() {
  const clubSessionIds = new Set(getClubSessions().map(session => session.id));
  const rows = new Map();
  state.attendanceRecords.filter(record => clubSessionIds.has(record.sessionId)).forEach(record => {
    const member = state.members.find(item => item.id === record.memberId);
    if (!member) return;
    const row = rows.get(member.id) || { member, records: [] };
    row.records.push(record);
    rows.set(member.id, row);
  });
  return [...rows.values()].sort((a, b) => formatMemberName(a.member).localeCompare(formatMemberName(b.member)));
}

function renderMemberAdministration() {
  return `<section class="member-tools-card">
    <p class="eyebrow">Member administration</p>
    <h2>Add a regular member</h2>
    <form class="add-member-form" id="add-member-form">
      <input name="firstName" required placeholder="First name" />
      <input name="lastName" required placeholder="Last name" />
      <input name="phone" type="tel" placeholder="Phone" />
      <input name="email" type="email" placeholder="Email" />
      <input name="emergencyContactName" placeholder="Emergency contact name" />
      <input name="emergencyContactPhone" type="tel" placeholder="Emergency contact phone" />
      <select name="pricingLabel">${pricingPlans.filter(plan => plan.clubId === state.selectedClubId).map(plan => `<option>${escapeHtml(plan.name)}</option>`).join('')}</select>
      <input name="sessionBalance" type="number" min="0" value="0" aria-label="Session balance" />
      <button type="submit">Add member</button>
    </form>
  </section>`;
}

function renderMembersTab() {
  const currentRecords = getAttendanceForSelectedSession();
  const termRows = getTermAttendanceRows();
  return `
    <section class="billing-card">
      <p class="eyebrow">Current session</p><h2>Charging</h2>
      <div class="billing-list">
        ${currentRecords.map(record => {
          const member = state.members.find(item => item.id === record.memberId);
          return member ? `<article class="billing-row"><div><strong>${escapeHtml(formatMemberName(member))}</strong><span>${escapeHtml(formatPaymentStatus(record.paymentStatus))}</span></div><div class="charge-actions">${renderBillingButtons(record)}</div></article>` : '';
        }).join('') || '<p class="empty-state">No one has checked in yet.</p>'}
      </div>
    </section>
    <section class="term-card">
      <p class="eyebrow">Current term</p><h2>Term attendees and payment details</h2>
      <div class="term-table-wrap"><table class="term-table"><thead><tr><th>Attendee</th><th>Sessions</th><th>Payment details</th><th>Contact</th></tr></thead><tbody>
        ${termRows.map(row => `<tr><td>${escapeHtml(formatMemberName(row.member))}${row.member.memberType === 'walk-in' ? '<span class="new-badge">New</span>' : ''}</td><td>${row.records.length}</td><td>${row.records.map(record => escapeHtml(formatPaymentStatus(record.paymentStatus))).join(', ')}</td><td>${renderContactDetails(row.member)}</td></tr>`).join('') || '<tr><td colspan="4">No term attendance recorded yet.</td></tr>'}
      </tbody></table></div>
    </section>
    ${renderMemberAdministration()}`;
}

function renderSessionStrip(session) {
  return `<section class="session-card session-strip">
    <div class="session-picker">${renderSessionSelector()}</div>
    <div class="session-inline-details">
      <strong>${escapeHtml(session.title)}</strong>
      <span>${escapeHtml(session.sessionType)} · ${formatSessionDate(session.startDateTime)}</span>
      <span>${escapeHtml(session.location)} · ${escapeHtml(session.instructor)} · ${session.capacity} places</span>
    </div>
  </section>`;
}

function renderAttendanceTab(session, summary) {
  const registeredMembers = getClubMembers();
  const matchingMembers = getAttendanceMemberMatches();
  return `
    ${renderSessionStrip(session)}
    <section class="attendee-heading">
      <div><p class="eyebrow">Session check-in</p><h2>Attendees</h2></div>
      <div class="attendance-search">
        <input id="member-search" type="search" placeholder="Search all registered members" value="${escapeHtml(memberSearch)}" aria-label="Search all registered members" />
        <span>${memberSearch ? `${matchingMembers.length} match${matchingMembers.length === 1 ? '' : 'es'}` : `${registeredMembers.length} registered members`}</span>
      </div>
    </section>
    <section class="member-list">
      ${matchingMembers.map(renderMemberCard).join('') || '<p class="empty-state">No registered members match that search.</p>'}
    </section>
    ${renderNewcomerRows()}
    <section class="statistics-section">
      <p class="eyebrow">Session results</p>
      <h2>Attendance statistics</h2>
      ${renderSummaryCards(summary)}
    </section>`;
}

function renderSessionsTab(session) {
  return `${renderScheduleManager(session)}
    <section class="backup-tools-card">
      <p class="eyebrow">Data management</p>
      <h2>Backup and restore</h2>
      <p>Export a copy of all members, sessions and attendance records, or restore a previous Trakk backup.</p>
      <div class="data-actions">
        <button class="secondary-button" id="export-backup">Export backup</button>
        <label class="button-label" for="import-backup">Import backup</label>
        <input class="visually-hidden" id="import-backup" type="file" accept="application/json,.json" />
      </div>
    </section>`;
}

function render() {
  const app = document.querySelector('#app');
  const session = getSelectedSession();
  const summary = getSummary();

  app.innerHTML = `
    <header class="app-header">
      <div>
        <h1>Trakk Attendance</h1>
        <p class="version-label">v${APP_VERSION} Tabbed Attendance</p>
      </div>
    </header>
    ${renderTabs()}
    ${activeTab === 'attendance' ? renderAttendanceTab(session, summary) : activeTab === 'members' ? renderMembersTab() : renderSessionsTab(session)}
  `;

  document.querySelector('#session-select')?.addEventListener('change', event => {
    state.selectedSessionId = event.target.value;
    saveState();
    render();
  });
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', event => {
    activeTab = event.currentTarget.dataset.tab;
    render();
  }));

  document.querySelectorAll('[data-newcomer-form]').forEach(form => form.addEventListener('submit', addWalkIn));
  document.querySelector('#add-member-form')?.addEventListener('submit', addMember);
  document.querySelector('#member-search')?.addEventListener('input', event => {
    memberSearch = event.target.value;
    render();
    const search = document.querySelector('#member-search');
    search.focus();
    search.setSelectionRange(memberSearch.length, memberSearch.length);
  });
  document.querySelector('#export-backup')?.addEventListener('click', exportBackup);
  document.querySelector('#import-backup')?.addEventListener('change', importBackup);
  document.querySelector('#session-form')?.addEventListener('submit', saveSession);
  document.querySelector('#generate-sessions')?.addEventListener('click', generateRecurringSessions);
  document.querySelector('#new-session')?.addEventListener('click', prepareNewSession);
  document.querySelector('#admin-term-filter')?.addEventListener('change', event => {
    adminTermFilter = event.target.value;
    const firstSession = getAdminSessions()[0];
    if (firstSession) state.selectedSessionId = firstSession.id;
    render();
  });
  document.querySelector('#admin-session-select')?.addEventListener('change', event => {
    state.selectedSessionId = event.target.value;
    saveState();
    render();
  });

  const toggleAttendance = memberId => {
      if (getRecordForMember(memberId)) removeAttendance(memberId);
      else recordAttendance(memberId, 'pending');
  };

  document.querySelectorAll('[data-attendance-card]').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('[data-action="contact"]')) return;
      toggleAttendance(event.currentTarget.dataset.memberId);
    });
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleAttendance(event.currentTarget.dataset.memberId);
    });
  });

  document.querySelectorAll('[data-action="contact"]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const popover = event.currentTarget.nextElementSibling;
      const isOpen = popover.classList.toggle('is-open');
      event.currentTarget.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.querySelectorAll('[data-action="charge"]').forEach(button => {
    button.addEventListener('click', event => {
      recordAttendance(event.currentTarget.dataset.memberId, event.currentTarget.dataset.paymentStatus);
    });
  });

  document.querySelectorAll('[data-action="remove"]').forEach(button => {
    button.addEventListener('click', event => {
      removeAttendance(event.target.dataset.memberId);
    });
  });
}

render();

const TRAKK_BUILD_VERSION = '0.10.4-dev';
const REGULAR_DANCE_TEMPLATE_IDS = new Set(['tpl_dance_mon', 'tpl_dance_shed']);
const LEGACY_AD_HOC_SESSION_IDS = new Set(['session_002', 'session_003']);

function simplifyDanceSessions() {
  state.scheduleTemplates = state.scheduleTemplates.filter(template =>
    template.clubId !== APP_CONFIG.activeClubId || REGULAR_DANCE_TEMPLATE_IDS.has(template.id)
  );

  state.sessions = state.sessions.filter(session =>
    session.clubId !== APP_CONFIG.activeClubId || !LEGACY_AD_HOC_SESSION_IDS.has(session.id)
  );

  const selectedSession = getSelectedSession();
  state.selectedSessionId = selectedSession?.id || state.sessions.find(session => session.clubId === state.selectedClubId)?.id;
  saveState();
}

function deleteSelectedSession() {
  const session = getSelectedSession();
  if (!session) return;

  const clubSessions = getClubSessions();
  if (clubSessions.length <= 1) {
    window.alert('At least one session must remain so attendance can still be recorded.');
    return;
  }

  const attendanceCount = state.attendanceRecords.filter(record => record.sessionId === session.id).length;
  const attendanceMessage = attendanceCount
    ? ` This will also remove ${attendanceCount} linked attendance record${attendanceCount === 1 ? '' : 's'}.`
    : '';

  if (!window.confirm(`Delete “${session.title}”?${attendanceMessage}`)) return;

  state.sessions = state.sessions.filter(item => item.id !== session.id);
  state.attendanceRecords = state.attendanceRecords.filter(record => record.sessionId !== session.id);

  const nextSession = getAdminSessions()[0] || getClubSessions()[0];
  state.selectedSessionId = nextSession?.id;
  saveState();
  render();
}

function generateRecurringSessions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let added = 0;

  getClubScheduleTemplates().forEach(template => {
    const date = new Date(today);
    const daysAhead = (template.weekday - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysAhead);
    const datePart = formatLocalDatePart(date);
    const startDateTime = toIsoDateTime(`${datePart}T${template.startTime}`);
    const id = `${template.id}_${datePart}`;

    if (state.sessions.some(session => session.id === id)) return;

    state.sessions.push({
      ...template,
      id,
      templateId: template.id,
      startDateTime,
      endDateTime: addMinutes(startDateTime, template.durationMinutes),
      notes: 'Generated from weekly schedule.'
    });
    added += 1;
  });

  saveState();
  window.alert(added
    ? `${added} session${added === 1 ? '' : 's'} added for the next week.`
    : 'The next Monday and Tuesday sessions already exist.');
  render();
}

function normaliseSearchText(value) {
  return String(value || '').trim().toLocaleLowerCase('en-AU');
}

function applyAttendanceSearch(query) {
  const searchText = normaliseSearchText(query);
  let visibleCount = 0;

  document.querySelectorAll('[data-attendance-card]').forEach(card => {
    const member = state.members.find(item => item.id === card.dataset.memberId);
    const searchableText = normaliseSearchText([
      member?.firstName,
      member?.lastName,
      member?.phone,
      member?.email
    ].filter(Boolean).join(' '));
    const isMatch = !searchText || searchableText.includes(searchText);
    card.hidden = !isMatch;
    if (isMatch) visibleCount += 1;
  });

  const resultLabel = document.querySelector('.attendance-search span');
  if (resultLabel) {
    resultLabel.textContent = searchText
      ? `${visibleCount} match${visibleCount === 1 ? '' : 'es'}`
      : `${getClubMembers().length} registered members`;
  }
}

function bindMobileSafeAttendanceSearch() {
  const currentInput = document.querySelector('#member-search');
  if (!currentInput) return;

  const replacementInput = currentInput.cloneNode(true);
  currentInput.replaceWith(replacementInput);
  replacementInput.value = memberSearch;

  replacementInput.addEventListener('input', event => {
    memberSearch = event.target.value;
    applyAttendanceSearch(memberSearch);
  });

  replacementInput.addEventListener('search', event => {
    memberSearch = event.target.value;
    applyAttendanceSearch(memberSearch);
  });

  applyAttendanceSearch(memberSearch);
}

function showCurrentBuild() {
  const versionLabel = document.querySelector('.version-label');
  if (versionLabel) versionLabel.textContent = `v${TRAKK_BUILD_VERSION} · Mobile search fix`;
}

const baseGetAttendanceMemberMatches = getAttendanceMemberMatches;
getAttendanceMemberMatches = function getAllAttendanceMembersForClientFiltering() {
  const members = getClubMembers();
  return members.length ? members : baseGetAttendanceMemberMatches();
};

const baseRenderScheduleManager = renderScheduleManager;
renderScheduleManager = function renderSimplifiedScheduleManager(session) {
  return baseRenderScheduleManager(session)
    .replace(
      /<p class="template-summary">.*?<\/p>/,
      '<p class="template-summary">Monday Dance Classes and Tuesday Shed are the regular weekly sessions. Add one more week when needed; create anything else as an ad hoc session.</p>'
    )
    .replace('Generate next 4 weeks', 'Add next week')
    .replace(
      '<button type="button" class="secondary-button" id="new-session">Create new</button>',
      '<button type="button" class="secondary-button" id="new-session">Create ad hoc session</button><button type="button" class="secondary-button" id="delete-session">Delete session</button>'
    );
};

const baseRender = render;
render = function renderWithSessionEnhancements() {
  baseRender();
  document.querySelector('#delete-session')?.addEventListener('click', deleteSelectedSession);
  bindMobileSafeAttendanceSearch();
  showCurrentBuild();
};

simplifyDanceSessions();
render();

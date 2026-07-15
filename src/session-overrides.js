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

const baseRenderScheduleManager = renderScheduleManager;
renderScheduleManager = function renderSimplifiedScheduleManager(session) {
  return baseRenderScheduleManager(session)
    .replace(
      /<p class="template-summary">.*?<\/p>/,
      `<p class="template-summary">Monday Dance Classes and Tuesday Shed are the regular weekly sessions. Create any other session as an ad hoc session.</p>`
    )
    .replace(
      '<button type="button" class="secondary-button" id="new-session">Create new</button>',
      '<button type="button" class="secondary-button" id="new-session">Create ad hoc session</button><button type="button" class="secondary-button" id="delete-session">Delete session</button>'
    );
};

const baseRender = render;
render = function renderWithSessionDeletion() {
  baseRender();
  document.querySelector('#delete-session')?.addEventListener('click', deleteSelectedSession);
};

simplifyDanceSessions();
render();

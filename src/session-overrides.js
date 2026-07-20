const TRAKK_BUILD_VERSION = '0.11.0-rc.2';
const REGULAR_DANCE_TEMPLATE_IDS = new Set(['tpl_dance_mon', 'tpl_dance_shed']);
const LEGACY_AD_HOC_SESSION_IDS = new Set(['session_002', 'session_003']);
let membersTabSearch = '';
let membersStatusFilter = 'active';
let editingMemberId = null;

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
  if (getClubSessions().length <= 1) {
    window.alert('At least one session must remain so attendance can still be recorded.');
    return;
  }
  const attendanceCount = state.attendanceRecords.filter(record => record.sessionId === session.id).length;
  const linked = attendanceCount ? ` This also removes ${attendanceCount} attendance record${attendanceCount === 1 ? '' : 's'}.` : '';
  if (!window.confirm(`Delete “${session.title}”?${linked}`)) return;
  state.sessions = state.sessions.filter(item => item.id !== session.id);
  state.attendanceRecords = state.attendanceRecords.filter(record => record.sessionId !== session.id);
  state.selectedSessionId = getAdminSessions()[0]?.id || getClubSessions()[0]?.id;
  saveState();
  render();
}

function duplicateSelectedSession() {
  const session = getSelectedSession();
  if (!session) return;
  const start = new Date(session.startDateTime);
  const end = new Date(session.endDateTime);
  start.setDate(start.getDate() + 7);
  end.setDate(end.getDate() + 7);
  const copy = {
    ...session,
    id: `session_${Date.now()}`,
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    isDraft: false
  };
  state.sessions.push(copy);
  state.selectedSessionId = copy.id;
  saveState();
  render();
}

function cancelSelectedSession() {
  const session = getSelectedSession();
  if (!session) return;
  session.cancelled = !session.cancelled;
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
  window.alert(added ? `${added} session${added === 1 ? '' : 's'} added for the next week.` : 'The next regular sessions already exist.');
  render();
}

function normaliseSearchText(value) {
  return String(value || '').trim().toLocaleLowerCase('en-AU');
}

function memberSearchText(member) {
  return normaliseSearchText([
    member?.firstName, member?.lastName, member?.phone, member?.email,
    member?.emergencyContactName, member?.emergencyContactPhone
  ].filter(Boolean).join(' '));
}

function applyAttendanceSearch(query) {
  const searchText = normaliseSearchText(query);
  let visibleCount = 0;
  document.querySelectorAll('[data-attendance-card]').forEach(card => {
    const member = state.members.find(item => item.id === card.dataset.memberId);
    const isMatch = !searchText || memberSearchText(member).includes(searchText);
    card.hidden = !isMatch;
    if (isMatch) visibleCount += 1;
  });
  document.querySelectorAll('[data-attendance-group]').forEach(group => {
    group.hidden = !group.querySelector('[data-attendance-card]:not([hidden])');
  });
  const resultLabel = document.querySelector('.attendance-search span');
  if (resultLabel) resultLabel.textContent = searchText
    ? `${visibleCount} match${visibleCount === 1 ? '' : 'es'}`
    : `${getClubMembers().length} registered members`;
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

function getMemberAttendance(memberId) {
  const sessionById = new Map(getClubSessions().map(session => [session.id, session]));
  return state.attendanceRecords
    .filter(record => record.memberId === memberId && sessionById.has(record.sessionId))
    .map(record => ({ ...record, session: sessionById.get(record.sessionId) }))
    .sort((a, b) => new Date(b.session.startDateTime) - new Date(a.session.startDateTime));
}

function getLastAttendedLabel(memberId) {
  const last = getMemberAttendance(memberId)[0];
  return last ? formatSessionDate(last.session.startDateTime) : 'Never';
}

function getFilteredMembers() {
  const query = normaliseSearchText(membersTabSearch);
  return getClubMembers()
    .filter(member => {
      if (membersStatusFilter === 'all') return true;
      if (membersStatusFilter === 'inactive') return member.status === 'inactive';
      return member.status !== 'inactive';
    })
    .filter(member => !query || memberSearchText(member).includes(query))
    .sort((a, b) => formatMemberName(a).localeCompare(formatMemberName(b)));
}

function renderMemberListRow(member) {
  const attendance = getMemberAttendance(member.id);
  return `<article class="member-admin-row ${member.status === 'inactive' ? 'is-inactive' : ''}">
    <button type="button" class="member-row-main" data-action="edit-member" data-member-id="${member.id}">
      <span class="member-row-name">${escapeHtml(formatMemberName(member))}${member.pricingLabel === 'Staff / Volunteer' ? '<span class="new-badge">Staff</span>' : member.memberType === 'walk-in' ? '<span class="new-badge">New</span>' : ''}</span>
      <span>${escapeHtml(member.pricingLabel || 'No pricing plan')}</span>
      <span>${member.sessionBalance === null ? 'Subscription' : `${member.sessionBalance || 0} remaining`}</span>
      <span>Last: ${escapeHtml(getLastAttendedLabel(member.id))}</span>
      <span>${attendance.length} visit${attendance.length === 1 ? '' : 's'}</span>
    </button>
    <div class="member-row-actions">
      ${renderContactDetails(member)}
      <button type="button" class="secondary-button" data-action="toggle-member-status" data-member-id="${member.id}">${member.status === 'inactive' ? 'Reactivate' : 'Make inactive'}</button>
    </div>
  </article>`;
}

function renderMemberEditor(member) {
  const isEditing = Boolean(member);
  return `<section class="member-tools-card member-editor-card">
    <div class="section-heading"><div><p class="eyebrow">Member administration</p><h2>${isEditing ? `Edit ${escapeHtml(formatMemberName(member))}` : 'Add a regular member'}</h2></div>${isEditing ? '<button type="button" class="secondary-button" id="cancel-member-edit">Close</button>' : ''}</div>
    <form class="add-member-form" id="member-editor-form">
      <input type="hidden" name="memberId" value="${member?.id || ''}" />
      <input name="firstName" required placeholder="First name" value="${escapeHtml(member?.firstName || '')}" />
      <input name="lastName" required placeholder="Last name" value="${escapeHtml(member?.lastName || '')}" />
      <input name="phone" type="tel" placeholder="Phone" value="${escapeHtml(member?.phone || '')}" />
      <input name="email" type="email" placeholder="Email" value="${escapeHtml(member?.email || '')}" />
      <input name="emergencyContactName" placeholder="Emergency contact name" value="${escapeHtml(member?.emergencyContactName || '')}" />
      <input name="emergencyContactPhone" type="tel" placeholder="Emergency contact phone" value="${escapeHtml(member?.emergencyContactPhone || '')}" />
      <select name="pricingLabel">${pricingPlans.filter(plan => plan.clubId === state.selectedClubId).map(plan => `<option ${plan.name === member?.pricingLabel ? 'selected' : ''}>${escapeHtml(plan.name)}</option>`).join('')}</select>
      <input name="sessionBalance" type="number" min="0" value="${member?.sessionBalance ?? 0}" aria-label="Session balance" />
      <select name="status"><option value="active" ${member?.status !== 'inactive' ? 'selected' : ''}>Active</option><option value="inactive" ${member?.status === 'inactive' ? 'selected' : ''}>Inactive</option></select>
      <input name="notes" placeholder="Notes" value="${escapeHtml(member?.notes || '')}" />
      <button type="submit">${isEditing ? 'Save member' : 'Add member'}</button>
    </form>
  </section>`;
}

function saveMemberEditor(event) {
  event.preventDefault();
  const form = event.target;
  const memberId = form.elements.memberId.value;
  const existing = state.members.find(member => member.id === memberId);
  const values = {
    clubId: state.selectedClubId,
    firstName: form.elements.firstName.value.trim(),
    lastName: form.elements.lastName.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(),
    emergencyContactName: form.elements.emergencyContactName.value.trim(),
    emergencyContactPhone: form.elements.emergencyContactPhone.value.trim(),
    pricingLabel: form.elements.pricingLabel.value,
    sessionBalance: Number(form.elements.sessionBalance.value || 0),
    status: form.elements.status.value,
    notes: form.elements.notes.value.trim(),
    memberType: form.elements.pricingLabel.value === 'Staff / Volunteer' ? 'staff' : 'member'
  };
  if (!values.firstName || !values.lastName) return;
  if (existing) Object.assign(existing, values);
  else state.members.push({ id: `member_${Date.now()}`, ...values });
  editingMemberId = null;
  saveState();
  render();
}

function renderMemberDirectory() {
  const members = getFilteredMembers();
  const activeCount = getClubMembers().filter(member => member.status !== 'inactive').length;
  const staffCount = getClubMembers().filter(member => member.status !== 'inactive' && member.pricingLabel === 'Staff / Volunteer').length;
  const inactiveCount = getClubMembers().filter(member => member.status === 'inactive').length;
  return `<section class="member-directory-card">
    <div class="section-heading"><div><p class="eyebrow">Member directory</p><h2>Members</h2></div><span>${activeCount} active · ${staffCount} staff · ${inactiveCount} inactive</span></div>
    <div class="member-directory-controls">
      <input id="members-tab-search" type="search" placeholder="Search name, phone, email or emergency contact" value="${escapeHtml(membersTabSearch)}" />
      <select id="members-status-filter"><option value="active" ${membersStatusFilter === 'active' ? 'selected' : ''}>Active members</option><option value="inactive" ${membersStatusFilter === 'inactive' ? 'selected' : ''}>Inactive members</option><option value="all" ${membersStatusFilter === 'all' ? 'selected' : ''}>All members</option></select>
    </div>
    <div class="member-admin-list">${members.map(renderMemberListRow).join('') || '<p class="empty-state">No members match this filter.</p>'}</div>
  </section>`;
}

function renderChargingSection() {
  const currentRecords = getAttendanceForSelectedSession();
  return `<section class="billing-card">
    <p class="eyebrow">Current session</p><h2>Charging</h2>
    <div class="billing-list">${currentRecords.map(record => {
      const member = state.members.find(item => item.id === record.memberId);
      return member ? `<article class="billing-row"><div><strong>${escapeHtml(formatMemberName(member))}</strong><span>${escapeHtml(formatPaymentStatus(record.paymentStatus))}</span></div><div class="charge-actions">${renderBillingButtons(record)}</div></article>` : '';
    }).join('') || '<p class="empty-state">No one has checked in yet.</p>'}</div>
  </section>`;
}

function renderRcMembersTab() {
  const editingMember = state.members.find(member => member.id === editingMemberId);
  return `${renderMemberDirectory()}${renderMemberEditor(editingMember)}${renderChargingSection()}`;
}

function getRecentMemberIds(limit = 8) {
  const currentSessionId = getSelectedSession()?.id;
  const seen = new Set();
  return state.attendanceRecords
    .filter(record => record.sessionId !== currentSessionId)
    .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
    .map(record => record.memberId)
    .filter(memberId => !seen.has(memberId) && seen.add(memberId))
    .filter(memberId => getClubMembers().some(member => member.id === memberId))
    .slice(0, limit);
}

function renderAttendanceGroup(title, members, hint) {
  if (!members.length) return '';
  return `<section class="attendance-member-group" data-attendance-group><div class="attendance-group-heading"><h3>${title}</h3><span>${hint}</span></div><div class="member-list">${members.map(renderMemberCard).join('')}</div></section>`;
}

function renderRcAttendanceTab(session, summary) {
  const members = getClubMembers();
  const present = members.filter(member => getRecordForMember(member.id));
  const presentIds = new Set(present.map(member => member.id));
  const recentIds = getRecentMemberIds();
  const recent = recentIds.map(id => members.find(member => member.id === id)).filter(member => member && !presentIds.has(member.id));
  const recentSet = new Set(recent.map(member => member.id));
  const available = members.filter(member => !presentIds.has(member.id) && !recentSet.has(member.id) && member.status !== 'inactive');
  const inactive = members.filter(member => !presentIds.has(member.id) && member.status === 'inactive');
  return `${renderSessionStrip(session)}
    ${session.cancelled ? '<div class="rc-alert">This session is marked cancelled. Attendance can still be reviewed, but check-in is disabled until it is restored.</div>' : ''}
    <section class="attendee-heading"><div><p class="eyebrow">Session check-in</p><h2>${summary.total} here today</h2></div><div class="attendance-search"><input id="member-search" type="search" placeholder="Search every member" value="${escapeHtml(memberSearch)}" /><span>${members.length} registered members</span></div></section>
    <div class="attendance-groups ${session.cancelled ? 'attendance-disabled' : ''}">
      ${renderAttendanceGroup('Here today', present, 'Tap again to remove')}
      ${renderAttendanceGroup('Recent members', recent, 'Likely arrivals')}
      ${renderAttendanceGroup('Available members', available, 'Tap to check in')}
      ${renderAttendanceGroup('Inactive members', inactive, 'Still searchable and available')}
    </div>
    ${renderNewcomerRows()}
    <section class="statistics-section"><p class="eyebrow">Session results</p><h2>Attendance statistics</h2>${renderSummaryCards(summary)}</section>`;
}

function showCurrentBuild() {
  const versionLabel = document.querySelector('.version-label');
  if (versionLabel) versionLabel.textContent = `v${TRAKK_BUILD_VERSION} · Release candidate`;
}

const baseGetAttendanceMemberMatches = getAttendanceMemberMatches;
getAttendanceMemberMatches = function getAllAttendanceMembersForClientFiltering() {
  const members = getClubMembers();
  return members.length ? members : baseGetAttendanceMemberMatches();
};

const baseRenderScheduleManager = renderScheduleManager;
renderScheduleManager = function renderRcScheduleManager(session) {
  return baseRenderScheduleManager(session)
    .replace(/<p class="template-summary">.*?<\/p>/, '<p class="template-summary">Manage regular and ad hoc sessions. Duplicate a session for next week, cancel it without deleting history, or permanently delete it.</p>')
    .replace('Generate next 4 weeks', 'Add next week')
    .replace(/<div class="form-actions">[\s\S]*?<\/div>/, `<div class="form-actions session-form-actions">
      <div class="session-save-actions">
        <button type="submit" class="save-session-button">Save session</button>
        <button type="button" class="secondary-button" id="new-session">New session</button>
      </div>
      <div class="session-management-actions" aria-label="Session management">
        <button type="button" class="secondary-button" id="duplicate-session">Duplicate +7 days</button>
        <button type="button" class="secondary-button" id="cancel-session">${session.cancelled ? 'Restore session' : 'Cancel session'}</button>
        <button type="button" class="danger-button" id="delete-session">Delete</button>
      </div>
    </div>`);
};

renderMembersTab = renderRcMembersTab;
renderAttendanceTab = renderRcAttendanceTab;

const baseRender = render;
render = function renderWithRcEnhancements() {
  try {
    baseRender();
    document.querySelector('#delete-session')?.addEventListener('click', deleteSelectedSession);
    document.querySelector('#duplicate-session')?.addEventListener('click', duplicateSelectedSession);
    document.querySelector('#cancel-session')?.addEventListener('click', cancelSelectedSession);
    bindMobileSafeAttendanceSearch();
    showCurrentBuild();
    document.querySelector('#member-editor-form')?.addEventListener('submit', saveMemberEditor);
    document.querySelector('#cancel-member-edit')?.addEventListener('click', () => { editingMemberId = null; render(); });
    document.querySelector('#members-tab-search')?.addEventListener('input', event => { membersTabSearch = event.target.value; render(); });
    document.querySelector('#members-status-filter')?.addEventListener('change', event => { membersStatusFilter = event.target.value; render(); });
    document.querySelectorAll('[data-action="edit-member"]').forEach(button => button.addEventListener('click', event => { editingMemberId = event.currentTarget.dataset.memberId; render(); }));
    document.querySelectorAll('[data-action="toggle-member-status"]').forEach(button => button.addEventListener('click', event => {
      const member = state.members.find(item => item.id === event.currentTarget.dataset.memberId);
      if (!member) return;
      member.status = member.status === 'inactive' ? 'active' : 'inactive';
      saveState();
      render();
    }));
  } catch (error) {
    console.error('Trakk render failed', error);
    const app = document.querySelector('#app');
    if (app) app.innerHTML = `<section class="fatal-error"><h1>Trakk could not load this screen</h1><p>${escapeHtml(error.message)}</p><button id="recover-export">Export backup</button><button id="recover-reload" class="secondary-button">Reload</button></section>`;
    document.querySelector('#recover-export')?.addEventListener('click', exportBackup);
    document.querySelector('#recover-reload')?.addEventListener('click', () => window.location.reload());
  }
};

simplifyDanceSessions();
render();

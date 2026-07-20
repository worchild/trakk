const TRAKK_STREAMLINE_VERSION = window.TRAKK_BOOTSTRAP?.version || '0.11.0-rc.3';
const LEARNING_PREFERENCES = ['Lead', 'Follow', 'Both'];

function normaliseLearningPreferences() {
  let changed = false;
  state.members.forEach(member => {
    if (!LEARNING_PREFERENCES.includes(member.learningPreference)) {
      member.learningPreference = 'Both';
      changed = true;
    }
    if (member.memberType === 'staff' && member.status !== 'inactive' && member.status !== 'staff') {
      member.status = 'staff';
      changed = true;
    }
  });
  if (changed) saveState();
}

function formatAttendanceSessionDate(dateTime) {
  return new Date(dateTime).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getCompactBalance(member) {
  if (member.status === 'staff') return 'Staff';
  if (member.sessionBalance === null) return 'Active';
  return `${member.sessionBalance || 0} left`;
}

renderSessionSelector = function renderStreamlinedSessionSelector() {
  return `
    <label class="visually-hidden" for="session-select">Session date</label>
    <select id="session-select" aria-label="Session date">
      ${getClubSessions()
        .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
        .map(session => `
          <option value="${session.id}" ${session.id === state.selectedSessionId ? 'selected' : ''}>
            ${formatAttendanceSessionDate(session.startDateTime)}
          </option>
        `).join('')}
    </select>
  `;
};

renderSessionStrip = function renderStreamlinedSessionStrip(session) {
  return `<section class="session-card session-strip streamlined-session-strip">
    <div class="session-picker">${renderSessionSelector()}</div>
  </section>`;
};

renderMemberCard = function renderStreamlinedMemberCard(member) {
  const record = getRecordForMember(member.id);
  const isPresent = Boolean(record);
  const preference = LEARNING_PREFERENCES.includes(member.learningPreference)
    ? member.learningPreference
    : 'Both';

  return `
    <article class="member-card compact-member-card ${isPresent ? 'is-present' : ''}" data-attendance-card data-member-id="${member.id}" role="button" tabindex="0" aria-pressed="${isPresent}">
      <div class="member-info">
        <h3>${escapeHtml(formatMemberName(member))}${member.status === 'staff' ? '<span class="new-badge">Staff</span>' : member.memberType === 'walk-in' ? '<span class="new-badge">New</span>' : ''}</h3>
        <p class="member-quick-info"><span>${escapeHtml(preference)}</span><span>${escapeHtml(getCompactBalance(member))}</span></p>
      </div>
      <button class="here-button compact-here-button ${record ? 'is-here' : ''}" data-action="here" data-member-id="${member.id}" aria-label="${record ? 'Remove' : 'Mark'} ${escapeHtml(formatMemberName(member))} ${record ? 'from' : 'as'} here">${record ? '✓' : 'Here'}</button>
    </article>
  `;
};

function renderSearchRegister(members) {
  return `<section class="attendance-member-group attendance-register-group" data-attendance-group data-search-register hidden>
    <div class="attendance-group-heading"><h3>Member register</h3><span>Active members and staff</span></div>
    <div class="member-list">${members.map(renderMemberCard).join('')}</div>
  </section>`;
}

renderRcAttendanceTab = function renderStreamlinedAttendanceTab(session, summary) {
  const members = getClubMembers().filter(member => member.status !== 'inactive');
  const present = members.filter(member => getRecordForMember(member.id));
  const presentIds = new Set(present.map(member => member.id));
  const recent = getRecentMemberIds()
    .map(id => members.find(member => member.id === id))
    .filter(member => member && !presentIds.has(member.id));
  const recentIds = new Set(recent.map(member => member.id));
  const staff = members.filter(member => member.status === 'staff' && !presentIds.has(member.id) && !recentIds.has(member.id));
  const available = members.filter(member => member.status !== 'staff' && !presentIds.has(member.id) && !recentIds.has(member.id));

  return `${renderSessionStrip(session)}
    ${session.cancelled ? '<div class="rc-alert">Session cancelled. Check-in is disabled.</div>' : ''}
    <section class="attendee-heading streamlined-attendee-heading">
      <div><h2>${summary.total} here</h2></div>
      <div class="attendance-search">
        <input id="member-search" type="search" placeholder="Search member register" value="${escapeHtml(memberSearch)}" aria-label="Search member register" />
        <span>${members.length} selectable</span>
      </div>
    </section>
    <div class="attendance-groups ${session.cancelled ? 'attendance-disabled' : ''}">
      ${renderAttendanceGroup('Here', present, 'Tap to remove')}
      ${renderAttendanceGroup('Recent', recent, 'Likely arrivals')}
      ${renderAttendanceGroup('Staff', staff, 'Tap to check in')}
      ${renderAttendanceGroup('Members', available, 'Tap to check in')}
      ${renderSearchRegister(members)}
    </div>
    <section class="statistics-section"><p class="eyebrow">Session</p><h2>Totals</h2>${renderSummaryCards(summary)}</section>`;
};
renderAttendanceTab = renderRcAttendanceTab;

applyAttendanceSearch = function applyMemberRegisterSearch(query) {
  const searchText = normaliseSearchText(query);
  const registerGroup = document.querySelector('[data-search-register]');
  const standardGroups = [...document.querySelectorAll('[data-attendance-group]:not([data-search-register])')];

  standardGroups.forEach(group => { group.hidden = Boolean(searchText); });
  if (registerGroup) registerGroup.hidden = !searchText;

  let visibleCount = 0;
  registerGroup?.querySelectorAll('[data-attendance-card]').forEach(card => {
    const member = state.members.find(item => item.id === card.dataset.memberId);
    const isMatch = memberSearchText(member).includes(searchText);
    card.hidden = !isMatch;
    if (isMatch) visibleCount += 1;
  });

  const resultLabel = document.querySelector('.attendance-search span');
  if (resultLabel) {
    resultLabel.textContent = searchText
      ? `${visibleCount} match${visibleCount === 1 ? '' : 'es'}`
      : `${getClubMembers().filter(member => member.status !== 'inactive').length} selectable`;
  }
};

bindMobileSafeAttendanceSearch = function bindStreamlinedAttendanceSearch() {
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
};

renderMemberEditor = function renderPreferenceMemberEditor(member) {
  const isEditing = Boolean(member);
  const selectedPreference = LEARNING_PREFERENCES.includes(member?.learningPreference)
    ? member.learningPreference
    : 'Both';
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
      <select name="learningPreference" aria-label="Current learning preference">
        ${LEARNING_PREFERENCES.map(option => `<option ${option === selectedPreference ? 'selected' : ''}>${option}</option>`).join('')}
      </select>
      <select name="pricingLabel">${pricingPlans.filter(plan => plan.clubId === state.selectedClubId).map(plan => `<option ${plan.name === member?.pricingLabel ? 'selected' : ''}>${escapeHtml(plan.name)}</option>`).join('')}</select>
      <input name="sessionBalance" type="number" min="0" value="${member?.sessionBalance ?? 0}" aria-label="Session balance" />
      <select name="status"><option value="active" ${member?.status === 'active' ? 'selected' : ''}>Active</option><option value="staff" ${member?.status === 'staff' ? 'selected' : ''}>Staff</option><option value="inactive" ${member?.status === 'inactive' ? 'selected' : ''}>Inactive</option></select>
      <input name="notes" placeholder="Notes" value="${escapeHtml(member?.notes || '')}" />
      <button type="submit">${isEditing ? 'Save member' : 'Add member'}</button>
    </form>
  </section>`;
};

saveMemberEditor = function savePreferenceMemberEditor(event) {
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
    learningPreference: form.elements.learningPreference.value,
    pricingLabel: form.elements.pricingLabel.value,
    sessionBalance: Number(form.elements.sessionBalance.value || 0),
    status: form.elements.status.value,
    notes: form.elements.notes.value.trim(),
    memberType: form.elements.status.value === 'staff' ? 'staff' : 'member'
  };
  if (!values.firstName || !values.lastName) return;
  if (existing) Object.assign(existing, values);
  else state.members.push({ id: `member_${Date.now()}`, ...values });
  editingMemberId = null;
  saveState();
  render();
};

const baseAddWalkInWithPreference = addWalkIn;
addWalkIn = function addWalkInWithPreference(event) {
  const beforeIds = new Set(state.members.map(member => member.id));
  baseAddWalkInWithPreference(event);
  const added = state.members.find(member => !beforeIds.has(member.id));
  if (added && !added.learningPreference) {
    added.learningPreference = 'Both';
    saveState();
  }
};

const baseShowCurrentBuild = showCurrentBuild;
showCurrentBuild = function showStreamlinedBuild() {
  baseShowCurrentBuild();
  const versionLabel = document.querySelector('.version-label');
  if (versionLabel) versionLabel.textContent = `v${TRAKK_STREAMLINE_VERSION} · ${window.TRAKK_BOOTSTRAP?.buildLabel || 'Release candidate'}`;
};

normaliseLearningPreferences();
render();

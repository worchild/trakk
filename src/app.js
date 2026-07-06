import {
  sampleClub,
  sampleMembers,
  sampleSessions
} from './data/sample-data.js';

const attendanceRecords = [];

function formatMemberName(member) {
  return `${member.firstName} ${member.lastName}`;
}

function recordAttendance(memberId, paymentStatus) {
  const session = sampleSessions[0];

  const existingRecord = attendanceRecords.find(
    record => record.memberId === memberId && record.sessionId === session.id
  );

  if (existingRecord) {
    existingRecord.paymentStatus = paymentStatus;
    existingRecord.attendanceStatus = 'present';
    existingRecord.recordedAt = new Date().toISOString();
  } else {
    attendanceRecords.push({
      id: `attendance_${attendanceRecords.length + 1}`,
      clubId: sampleClub.id,
      sessionId: session.id,
      memberId,
      attendanceStatus: 'present',
      paymentStatus,
      recordedAt: new Date().toISOString(),
      notes: ''
    });
  }

  render();
}

function getRecordForMember(memberId) {
  const session = sampleSessions[0];
  return attendanceRecords.find(
    record => record.memberId === memberId && record.sessionId === session.id
  );
}

function render() {
  const app = document.querySelector('#app');
  const session = sampleSessions[0];
  const presentCount = attendanceRecords.filter(
    record => record.attendanceStatus === 'present'
  ).length;

  app.innerHTML = `
    <header class="app-header">
      <div>
        <p class="eyebrow">${sampleClub.name}</p>
        <h1>Trakk Attendance</h1>
      </div>
      <div class="summary-card">
        <span class="summary-number">${presentCount}</span>
        <span class="summary-label">Present</span>
      </div>
    </header>

    <section class="session-card">
      <h2>${session.title}</h2>
      <p>${session.startDateTime}</p>
      <p>${session.location}</p>
    </section>

    <section class="member-list">
      ${sampleMembers.map(member => {
        const record = getRecordForMember(member.id);
        const isPresent = Boolean(record);

        return `
          <article class="member-card ${isPresent ? 'is-present' : ''}">
            <div class="member-info">
              <h3>${formatMemberName(member)}</h3>
              <p>${member.status} · ${member.sessionBalance} sessions left</p>
              ${record ? `<p class="record-status">Marked: ${record.paymentStatus}</p>` : ''}
            </div>
            <div class="actions">
              <button data-member-id="${member.id}" data-payment-status="paid_casual">Paid</button>
              <button data-member-id="${member.id}" data-payment-status="pass_used">Pass</button>
              <button data-member-id="${member.id}" data-payment-status="free_trial">Trial</button>
              <button data-member-id="${member.id}" data-payment-status="complimentary">Free</button>
            </div>
          </article>
        `;
      }).join('')}
    </section>
  `;

  document.querySelectorAll('button[data-member-id]').forEach(button => {
    button.addEventListener('click', event => {
      recordAttendance(
        event.target.dataset.memberId,
        event.target.dataset.paymentStatus
      );
    });
  });
}

render();

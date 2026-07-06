const sampleClub = {
  id: 'club_001',
  name: '4D Dance',
  clubType: 'dance_school',
  defaultCurrency: 'AUD',
  timezone: 'Australia/Adelaide'
};

const sampleMembers = [
  {
    id: 'member_001',
    clubId: 'club_001',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '0400 000 000',
    status: 'active',
    joinDate: '2026-07-06',
    pricingPlanId: 'plan_8_pass',
    sessionBalance: 7,
    notes: 'Regular Monday attendee.'
  },
  {
    id: 'member_002',
    clubId: 'club_001',
    firstName: 'Alex',
    lastName: 'Brown',
    email: 'alex@example.com',
    phone: '0400 000 001',
    status: 'trial',
    joinDate: '2026-07-06',
    pricingPlanId: 'plan_trial',
    sessionBalance: 1,
    notes: 'First night free.'
  },
  {
    id: 'member_003',
    clubId: 'club_001',
    firstName: 'Morgan',
    lastName: 'Lee',
    email: 'morgan@example.com',
    phone: '0400 000 002',
    status: 'active',
    joinDate: '2026-06-01',
    pricingPlanId: 'plan_casual',
    sessionBalance: 0,
    notes: 'Pays casually.'
  }
];

const sampleSessions = [
  {
    id: 'session_001',
    clubId: 'club_001',
    title: 'Monday Beginners Class',
    sessionType: 'group_class',
    startDateTime: '2026-07-06T19:30:00+09:30',
    endDateTime: '2026-07-06T21:30:00+09:30',
    instructor: 'John',
    location: 'Mitcham Cultural Centre',
    capacity: 40,
    notes: 'Beginners and Level 2 classes.'
  }
];

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

function formatPaymentStatus(status) {
  const labels = {
    paid_casual: 'Paid casual',
    pass_used: 'Pass used',
    free_trial: 'Free trial',
    complimentary: 'Complimentary'
  };

  return labels[status] || status;
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
              ${record ? `<p class="record-status">Marked: ${formatPaymentStatus(record.paymentStatus)}</p>` : ''}
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

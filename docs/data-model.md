# Trakk Data Model

This is the first-pass MVP data model. It is designed to work as JSON first and later migrate to a database.

## Entities

### Club

Represents the organisation using Trakk.

```json
{
  "id": "club_001",
  "name": "4D Dance",
  "clubType": "dance_school",
  "defaultCurrency": "AUD",
  "timezone": "Australia/Adelaide"
}
```

### Member

Represents a person who attends sessions.

```json
{
  "id": "member_001",
  "clubId": "club_001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "0400 000 000",
  "status": "active",
  "joinDate": "2026-07-06",
  "pricingPlanId": "plan_001",
  "sessionBalance": 7,
  "notes": "Prefers Monday class."
}
```

Member statuses:

- active
- inactive
- trial
- paused

### PricingPlan

Represents how a member pays or attends.

```json
{
  "id": "plan_001",
  "clubId": "club_001",
  "name": "8 Class Pass",
  "type": "class_pass",
  "price": 120,
  "includedSessions": 8,
  "validForDays": 120
}
```

Pricing plan types:

- casual
- class_pass
- term_pass
- monthly_membership
- free_trial
- private_lesson_package
- complimentary
- staff_volunteer

### Session

Represents a scheduled class, lesson, workshop, or event.

```json
{
  "id": "session_001",
  "clubId": "club_001",
  "title": "Monday Beginners Class",
  "sessionType": "group_class",
  "startDateTime": "2026-07-06T19:30:00+09:30",
  "endDateTime": "2026-07-06T21:30:00+09:30",
  "instructor": "John",
  "location": "Mitcham Cultural Centre",
  "capacity": 40,
  "notes": "Beginners and Level 2 classes."
}
```

Session types:

- group_class
- private_lesson
- workshop
- social_event
- open_session

### AttendanceRecord

Represents one member's attendance at one session.

```json
{
  "id": "attendance_001",
  "clubId": "club_001",
  "sessionId": "session_001",
  "memberId": "member_001",
  "attendanceStatus": "present",
  "paymentStatus": "pass_used",
  "recordedAt": "2026-07-06T19:35:00+09:30",
  "notes": "Checked in at door."
}
```

Attendance statuses:

- present
- absent
- no_show
- cancelled

Payment statuses:

- paid_casual
- pass_used
- membership_included
- free_trial
- complimentary
- private_lesson_package
- staff_volunteer

## Future entities

Later versions may add:

- Payment
- Invoice
- Instructor
- Venue
- Booking
- Waiver
- CommunicationLog
- MemberPortalAccount

# Trakk Requirements

## MVP requirements

### Member management

Trakk must allow an admin to:

- Create a member
- Edit member details
- Mark a member active or inactive
- View a member's attendance history
- View a member's current pricing plan or pass balance
- Add notes to a member profile

Suggested member fields:

- First name
- Last name
- Email
- Phone
- Status
- Join date
- Pricing model
- Session balance
- Notes

### Session scheduling

Trakk must support scheduled sessions, including:

- Group class
- Private lesson
- Workshop
- Social event
- Casual/open session

Suggested session fields:

- Date
- Start time
- End time
- Session type
- Instructor
- Location
- Capacity
- Notes

### Attendance recording

Trakk must allow quick attendance marking from a scheduled session.

Each attendance record should track:

- Member
- Session
- Attendance status
- Payment/session type
- Notes

Attendance statuses:

- Present
- Absent
- No-show
- Cancelled

Payment/session types:

- Paid casual
- Pass used
- Membership included
- Free trial
- Complimentary
- Private lesson package
- Staff/volunteer

### Pricing models

Trakk must support multiple pricing models:

- Casual pay-per-session
- Multi-session pass
- Term pass
- Monthly membership
- Free trial
- Private lesson package
- Complimentary attendance

### Reports

The MVP should include basic reports:

- Attendance by session
- Attendance by member
- Paid vs free attendance
- Pass balances
- Lapsed members
- Private lesson usage
- Session popularity

## Non-functional requirements

### Mobile-first

Attendance recording must work well on a phone or tablet.

### Simple data model

Start with a JSON-friendly model that can later move to a database.

### Low-friction UI

The attendance screen should require very few taps.

### Future-ready

The architecture should allow later support for:

- Authentication
- Multiple clubs
- Online payments
- Member self-service
- Calendar integration

# Trakk Roadmap

## Phase 0: Project foundation

Status: Complete

Goals:

- Create GitHub repository
- Add README
- Add product vision
- Add requirements
- Add data model
- Add roadmap
- Add starter app skeleton

## Phase 1: Static MVP prototype

Status: Complete in v0.2.0

Goal: Build a simple browser-based prototype using local sample data.

Deliverables:

- Member list
- Session list
- Attendance screen
- Check-in buttons
- Paid/free/pass/private lesson markers
- Basic summary counts
- Mobile-friendly layout

Success criteria:

- An admin can open a scheduled session
- An admin can mark members as present
- Each attendee can be recorded as paid, pass used, free trial, complimentary, or private lesson
- Attendance totals update immediately

## Phase 2: Data structure and persistence

Status: In progress — browser persistence, member creation, and JSON backup delivered in v0.3.0

Goal: Move from hardcoded sample data to structured local storage.

Deliverables:

- JSON data store
- Local browser persistence
- Add/edit members
- Add/edit sessions
- Save attendance records
- Import/export JSON backup

## Phase 2.5: Shared scheduling

Status: In development in v0.5.0

Deliverables:

- Edit scheduled sessions
- Create one-off sessions
- Define company-specific weekly templates
- Generate four weeks of dated sessions without duplicates

## Phase 3: Reports

Goal: Make the data useful.

Deliverables:

- Attendance by session
- Attendance by member
- Paid vs free attendance
- Pass balance view
- Lapsed member list
- Private lesson usage report

## Phase 4: Real backend

Goal: Prepare Trakk for real club usage.

Possible options:

- Supabase
- Firebase
- SQLite with a lightweight backend

Deliverables:

- Authentication
- Cloud data storage
- Multi-device support
- Backup and restore

## Phase 5: Club-ready features

Goal: Expand from tracking to club operations.

Possible features:

- Payment tracking
- Online bookings
- Member self-service portal
- Waivers
- Email/SMS reminders
- Calendar integration
- Multiple clubs
- Instructor dashboards

## Initial version target

Version `0.3.0` is the current working static release and proves the key workflow:

> Pick a session → mark attendance → record payment/session type → view simple totals.

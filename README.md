# Trakk

**Trakk** is a lightweight club membership and attendance tracking application for gyms, dance schools, and other session-based organisations.

The goal is to make member management and attendance recording fast enough to use at the door before class, while still supporting different pricing models such as casual attendance, class passes, term passes, memberships, free trials, and private lessons.

## Core goals

- Track members and their attendance history
- Record scheduled classes, private lessons, workshops, and events
- Support different pricing models for gyms and dance schools
- Track paid, free, trial, complimentary, and private lesson attendance
- Provide a fast, mobile-friendly attendance screen
- Report on attendance, revenue activity, pass usage, and lapsed members

## MVP focus

The first version should prioritise:

1. Member list
2. Session schedule
3. Fast attendance check-in
4. Paid/free/pass/private lesson attendance status
5. Basic reports
6. Mobile-friendly interface

## Suggested build approach

Start simple:

- Static web app
- Local JSON data model
- Mobile-first attendance UI
- GitHub Pages deployment

Then evolve toward:

- Persistent database
- Authentication
- Multi-club support
- Payment integration
- Member self-service portal

## Documentation

See the `/docs` folder for the product vision, requirements, data model, and roadmap.

## Current release

**v0.3.0 — Member & Data Tools**

- Persistent browser storage with automatic migration from v0.2.0
- Add permanent members and walk-ins
- Search the member check-in list
- Export and import JSON backups
- Confirmation before clearing a session
- Mobile-friendly attendance workflow

## In development

The `feature/club-profiles` branch introduces separate Gym and 4D Dance profiles with their own weekly schedules, pricing plans, member lists and attendance records.

### v0.5.0 development

The `feature/recurring-schedules` branch adds shared scheduling infrastructure:

- Editable session details
- Creation of one-off sessions
- Club-specific weekly schedule templates
- Duplicate-safe generation of the next four weeks of dated sessions

### v0.6.0 development

The `feature/attendance-first-layout` branch reorganises the screen for front-door use: session first, regular-member check-in with billing information, a self-renewing newcomer row, session editing, then attendance statistics.

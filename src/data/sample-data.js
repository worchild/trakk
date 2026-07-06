export const sampleClub = {
  id: 'club_001',
  name: '4D Dance',
  clubType: 'dance_school',
  defaultCurrency: 'AUD',
  timezone: 'Australia/Adelaide'
};

export const samplePricingPlans = [
  {
    id: 'plan_casual',
    clubId: 'club_001',
    name: 'Casual Class',
    type: 'casual',
    price: 20,
    includedSessions: 1,
    validForDays: null
  },
  {
    id: 'plan_8_pass',
    clubId: 'club_001',
    name: '8 Class Pass',
    type: 'class_pass',
    price: 120,
    includedSessions: 8,
    validForDays: 120
  },
  {
    id: 'plan_term',
    clubId: 'club_001',
    name: '8 Week Term',
    type: 'term_pass',
    price: 80,
    includedSessions: 8,
    validForDays: 56
  },
  {
    id: 'plan_trial',
    clubId: 'club_001',
    name: 'Free Trial',
    type: 'free_trial',
    price: 0,
    includedSessions: 1,
    validForDays: 14
  }
];

export const sampleMembers = [
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

export const sampleSessions = [
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

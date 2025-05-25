export const STUDENT_STATUSES = [
  'Pending',
  'Approved',
  'Rejected',
  'Interview Scheduled',
  'Documents Required',
  'Under Review',
] as const;

export const PROGRAMS = [
  'Bachelors in Computer Science',
  'Masters in Business',
  'PhD in Physics',
  'Undergraduate Arts',
  'Masters in Engineering',
  'Bachelors in Medicine',
  'Masters in Data Science',
  'PhD in Chemistry',
] as const;

export const STATUS_COLORS = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  'Interview Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
  'Documents Required': 'bg-orange-50 text-orange-700 border-orange-200',
  'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
} as const;

export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;

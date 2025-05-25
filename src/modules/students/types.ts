export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  status: StudentStatus;
  applicationDate: string;
  notes?: string;
}

export type StudentStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Interview Scheduled'
  | 'Documents Required'
  | 'Under Review';

export interface StudentFilters {
  search: string;
  status: StudentStatus | 'All';
  program: string | 'All';
  country: string | 'All';
}

export type ViewMode = 'card' | 'table';

export interface StudentUpdateData {
  id: string;
  status?: StudentStatus;
}

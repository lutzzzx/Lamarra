export type JobStatus = 
  | 'wishlist' 
  | 'applied' 
  | 'assessment' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn';

export type WorkType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';

export type WorkLocation = 'Remote' | 'Hybrid' | 'On-site';

export type JobSource = 
  | 'LinkedIn' 
  | 'JobStreet' 
  | 'Glints' 
  | 'Kalibrr' 
  | 'Website Perusahaan' 
  | 'Referral' 
  | 'Deel' 
  | 'Lainnya';

export type Priority = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RecruiterInfo {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface DocumentRef {
  resumeVersion?: string;
  coverLetter?: string;
  notes?: string;
}

export type TimelineType = 
  | 'status_change' 
  | 'interview' 
  | 'assessment' 
  | 'note' 
  | 'followup' 
  | 'created' 
  | 'applied' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn' 
  | 'wishlist';

export interface TimelineActivity {
  id: string;
  date: string;
  type: TimelineType;
  title: string;
  notes?: string;
}

export type ReminderType = 'interview' | 'assessment' | 'followup' | 'deadline';

export interface Reminder {
  id: string;
  jobId: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  type: ReminderType;
  isCompleted: boolean;
  jobTitle?: string;
  companyName?: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  companyLogo?: string;
  position: string;
  status: JobStatus;
  source: JobSource;
  workType: WorkType;
  workLocation: WorkLocation;
  locationName: string;
  salaryRange?: string;
  jobUrl?: string;
  appliedDate: string;
  deadlineDate?: string;
  priority: Priority;
  recruiter?: RecruiterInfo;
  documents?: DocumentRef;
  notes?: string;
  timeline: TimelineActivity[];
  reminders: Reminder[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  search: string;
  status: JobStatus | 'all';
  source: string;
  workType: string;
  workLocation: string;
  priority: string;
  sortBy: 'appliedDate_desc' | 'appliedDate_asc' | 'company_asc' | 'priority_desc' | 'deadline_asc';
  viewMode: 'kanban' | 'list' | 'grid';
}

export interface MetricSummary {
  total: number;
  wishlist: number;
  applied: number;
  assessment: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  activeRemindersCount: number;
}

import { JobApplication, User, Reminder, TimelineActivity, JobStatus } from '../types';
import { DEMO_USER, INITIAL_JOBS } from '../data/mockData';

const CURRENT_USER_KEY = 'lamarra_current_user_v1';
const USERS_LIST_KEY = 'lamarra_registered_users_v1';
const JOBS_STORAGE_PREFIX = 'lamarra_jobs_user_';

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse current user from localStorage:', e);
  }
  return null;
}

export function setCurrentUser(user: User | null): void {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function registerUser(name: string, email: string): User {
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email,
    createdAt: new Date().toISOString()
  };

  try {
    const usersData = localStorage.getItem(USERS_LIST_KEY);
    const users: User[] = usersData ? JSON.parse(usersData) : [DEMO_USER];
    
    // Check if user with email already exists
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return existing;
    }

    users.push(newUser);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    setCurrentUser(newUser);

    // Initialize with default sample data for new users so they get a rich experience right away
    saveUserJobs(newUser.id, INITIAL_JOBS.map(j => ({ ...j, userId: newUser.id })));
  } catch (e) {
    console.error('Error during user registration:', e);
  }

  return newUser;
}

/**
 * @deprecated Legacy localStorage authentication is disabled for security reasons.
 * Use real API authentication (apiLogin, apiRegister in src/services/api.ts) instead.
 */
export function loginUser(_email: string): User {
  throw new Error('Autentikasi localStorage telah dinonaktifkan. Gunakan API autentikasi resmi.');
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function getUserJobs(userId: string): JobApplication[] {
  if (!userId) return [];
  const key = `${JOBS_STORAGE_PREFIX}${userId}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading jobs from storage:', e);
  }

  // If no jobs exist for demo user or new user, save initial dataset
  if (userId === DEMO_USER.id) {
    saveUserJobs(userId, INITIAL_JOBS);
    return INITIAL_JOBS;
  } else {
    // For newly registered user, populate initial template
    const userInitialJobs = INITIAL_JOBS.map(j => ({ ...j, id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, userId }));
    saveUserJobs(userId, userInitialJobs);
    return userInitialJobs;
  }
}

export function saveUserJobs(userId: string, jobs: JobApplication[]): void {
  if (!userId) return;
  const key = `${JOBS_STORAGE_PREFIX}${userId}`;
  try {
    localStorage.setItem(key, JSON.stringify(jobs));
  } catch (e) {
    console.error('Error saving jobs to storage:', e);
  }
}

export function createJobApplication(userId: string, data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'timeline' | 'reminders'> & { initialReminderDate?: string }): JobApplication {
  const now = new Date().toISOString();
  const todayDate = now.split('T')[0];
  
  const jobId = `job_${Date.now()}`;
  
  const initialTimeline: TimelineActivity[] = [
    {
      id: `tl_${Date.now()}`,
      date: data.appliedDate || todayDate,
      type: data.status === 'wishlist' ? 'created' : 'applied',
      title: data.status === 'wishlist' ? 'Ditambahkan ke Wishlist' : 'Lamaran Dikirim',
      notes: data.notes || 'Catatan awal pembuatan lamaran.'
    }
  ];

  const initialReminders: Reminder[] = [];
  if (data.initialReminderDate) {
    initialReminders.push({
      id: `rem_${Date.now()}`,
      jobId,
      title: `Follow-up / Deadline ${data.companyName}`,
      dueDate: data.initialReminderDate,
      type: data.status === 'interview' ? 'interview' : data.status === 'assessment' ? 'assessment' : 'deadline',
      isCompleted: false,
      jobTitle: data.position,
      companyName: data.companyName
    });
  }

  const newJob: JobApplication = {
    ...data,
    id: jobId,
    userId,
    timeline: initialTimeline,
    reminders: initialReminders,
    createdAt: now,
    updatedAt: now
  };

  const existing = getUserJobs(userId);
  const updated = [newJob, ...existing];
  saveUserJobs(userId, updated);

  return newJob;
}

export function updateJobApplication(userId: string, updatedJob: JobApplication): void {
  const existing = getUserJobs(userId);
  const index = existing.findIndex(j => j.id === updatedJob.id);
  if (index !== -1) {
    const current = existing[index];
    const isStatusChanged = current.status !== updatedJob.status;
    
    let updatedTimeline = [...updatedJob.timeline];
    if (isStatusChanged) {
      const todayDate = new Date().toISOString().split('T')[0];
      updatedTimeline.unshift({
        id: `tl_${Date.now()}`,
        date: todayDate,
        type: 'status_change',
        title: `Status Diubah: ${current.status.toUpperCase()} -> ${updatedJob.status.toUpperCase()}`,
        notes: `Status diperbarui menjadi ${updatedJob.status}`
      });
    }

    const modified: JobApplication = {
      ...updatedJob,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    };

    existing[index] = modified;
    saveUserJobs(userId, existing);
  }
}

export function updateJobStatus(userId: string, jobId: string, newStatus: JobStatus): void {
  const existing = getUserJobs(userId);
  const index = existing.findIndex(j => j.id === jobId);
  if (index !== -1) {
    const job = existing[index];
    if (job.status === newStatus) return;

    const oldStatus = job.status;
    const todayDate = new Date().toISOString().split('T')[0];

    const newTimelineItem: TimelineActivity = {
      id: `tl_${Date.now()}`,
      date: todayDate,
      type: 'status_change',
      title: `Status Diubah ke ${newStatus.toUpperCase()}`,
      notes: `Perubahan dari status ${oldStatus} ke ${newStatus}`
    };

    const updatedJob: JobApplication = {
      ...job,
      status: newStatus,
      timeline: [newTimelineItem, ...job.timeline],
      updatedAt: new Date().toISOString()
    };

    existing[index] = updatedJob;
    saveUserJobs(userId, existing);
  }
}

export function deleteJobApplication(userId: string, jobId: string): void {
  const existing = getUserJobs(userId);
  const filtered = existing.filter(j => j.id !== jobId);
  saveUserJobs(userId, filtered);
}

export function addTimelineActivity(userId: string, jobId: string, activity: Omit<TimelineActivity, 'id'>): void {
  const existing = getUserJobs(userId);
  const index = existing.findIndex(j => j.id === jobId);
  if (index !== -1) {
    const job = existing[index];
    const newActivity: TimelineActivity = {
      ...activity,
      id: `tl_${Date.now()}`
    };
    const updatedJob: JobApplication = {
      ...job,
      timeline: [newActivity, ...job.timeline],
      updatedAt: new Date().toISOString()
    };
    existing[index] = updatedJob;
    saveUserJobs(userId, existing);
  }
}

export function addReminder(userId: string, jobId: string, reminder: Omit<Reminder, 'id' | 'jobId' | 'isCompleted'>): void {
  const existing = getUserJobs(userId);
  const index = existing.findIndex(j => j.id === jobId);
  if (index !== -1) {
    const job = existing[index];
    const newReminder: Reminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
      jobId,
      isCompleted: false,
      jobTitle: job.position,
      companyName: job.companyName
    };
    const updatedJob: JobApplication = {
      ...job,
      reminders: [newReminder, ...(job.reminders || [])],
      updatedAt: new Date().toISOString()
    };
    existing[index] = updatedJob;
    saveUserJobs(userId, existing);
  }
}

export function toggleReminderCompletion(userId: string, jobId: string, reminderId: string): void {
  const existing = getUserJobs(userId);
  const index = existing.findIndex(j => j.id === jobId);
  if (index !== -1) {
    const job = existing[index];
    const updatedReminders = (job.reminders || []).map(r => {
      if (r.id === reminderId) {
        return { ...r, isCompleted: !r.isCompleted };
      }
      return r;
    });
    const updatedJob: JobApplication = {
      ...job,
      reminders: updatedReminders,
      updatedAt: new Date().toISOString()
    };
    existing[index] = updatedJob;
    saveUserJobs(userId, existing);
  }
}

export function exportUserData(userId: string): string {
  const jobs = getUserJobs(userId);
  const payload = {
    app: 'Lamarra Job Application Tracker',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    jobsCount: jobs.length,
    data: jobs
  };
  return JSON.stringify(payload, null, 2);
}

export function importUserData(userId: string, jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    const jobsArray = Array.isArray(parsed) ? parsed : (parsed.data || []);
    if (!Array.isArray(jobsArray)) return false;
    
    // Ensure all items match user id
    const sanitizedJobs: JobApplication[] = jobsArray.map((j: any, i: number) => ({
      ...j,
      id: j.id || `imported_${Date.now()}_${i}`,
      userId,
      timeline: Array.isArray(j.timeline) ? j.timeline : [],
      reminders: Array.isArray(j.reminders) ? j.reminders : []
    }));

    saveUserJobs(userId, sanitizedJobs);
    return true;
  } catch (e) {
    console.error('Failed to import JSON data:', e);
    return false;
  }
}

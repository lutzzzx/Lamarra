import apiClient from '../lib/apiClient';
import { JobApplication, User, FilterState, JobStatus, TimelineType, ReminderType } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

// ==================== AUTH SERVICES ====================
export async function apiRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/register', { name, email, password });
  return data.data;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.data;
}

export async function apiLogout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function apiGetMe(): Promise<User> {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
}

export async function apiUpdateProfile(payload: { name: string; email: string; currentPassword?: string; newPassword?: string }): Promise<User> {
  const { data } = await apiClient.put('/auth/profile', payload);
  return data.data;
}

export async function apiDeleteAccount(password: string): Promise<void> {
  await apiClient.delete('/auth/account', { data: { password } });
}

// ==================== JOBS SERVICES ====================
export async function apiGetJobs(filter?: FilterState): Promise<JobApplication[]> {
  const params: Record<string, string> = {};
  if (filter) {
    if (filter.status && filter.status !== 'all') params.status = filter.status;
    if (filter.source) params.source = filter.source;
    if (filter.workType) params.workType = filter.workType;
    if (filter.workLocation) params.workLocation = filter.workLocation;
    if (filter.priority) params.priority = filter.priority;
    if (filter.search) params.search = filter.search;
    if (filter.sortBy) params.sortBy = filter.sortBy;
  }

  const { data } = await apiClient.get('/jobs', { params });
  return data.data || [];
}

export async function apiCreateJob(payload: any): Promise<JobApplication> {
  const { data } = await apiClient.post('/jobs', payload);
  return data.data;
}

export async function apiUpdateJob(id: string, payload: any): Promise<void> {
  await apiClient.put(`/jobs/${id}`, payload);
}

export async function apiUpdateJobStatus(id: string, status: JobStatus): Promise<void> {
  await apiClient.patch(`/jobs/${id}/status`, { status });
}

export async function apiDeleteJob(id: string): Promise<void> {
  await apiClient.delete(`/jobs/${id}`);
}

// ==================== TIMELINE SERVICES ====================
export async function apiAddTimeline(jobId: string, activity: { date: string; type: TimelineType; title: string; notes?: string }): Promise<void> {
  await apiClient.post(`/jobs/${jobId}/timeline`, activity);
}

// ==================== REMINDERS SERVICES ====================
export async function apiGetReminders(): Promise<any[]> {
  const { data } = await apiClient.get('/reminders');
  return data.data || [];
}

export async function apiAddReminder(jobId: string, reminder: { title: string; dueDate: string; dueTime?: string; type: ReminderType }): Promise<void> {
  await apiClient.post(`/jobs/${jobId}/reminders`, reminder);
}

export async function apiUpdateReminder(reminderId: string, reminder: { title: string; dueDate: string; dueTime?: string; type: ReminderType }): Promise<void> {
  await apiClient.put(`/reminders/${reminderId}`, reminder);
}

export async function apiDeleteReminder(reminderId: string): Promise<void> {
  await apiClient.delete(`/reminders/${reminderId}`);
}

export async function apiToggleReminder(reminderId: string): Promise<boolean> {
  const { data } = await apiClient.patch(`/reminders/${reminderId}/toggle`);
  return data.isCompleted;
}

// ==================== EXPORT / IMPORT SERVICES ====================
export async function apiExportData(): Promise<any> {
  const { data } = await apiClient.get('/export');
  return data;
}

export async function apiImportData(jsonString: string): Promise<number> {
  const parsed = JSON.parse(jsonString);
  const { data } = await apiClient.post('/import', parsed);
  return data.importedCount || 0;
}

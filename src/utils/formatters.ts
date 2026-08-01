import { JobStatus, Priority, JobApplication, MetricSummary } from '../types';

export interface StatusConfig {
  id: JobStatus;
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
  columnBg: string;
}

export const STATUS_CONFIG: Record<JobStatus, StatusConfig> = {
  wishlist: {
    id: 'wishlist',
    label: 'Wishlist',
    description: 'Rencana / disimpan',
    badgeBg: 'bg-zinc-100 dark:bg-zinc-800/60',
    badgeText: 'text-zinc-700 dark:text-zinc-300',
    badgeBorder: 'border-zinc-200 dark:border-zinc-700',
    dotBg: 'bg-zinc-400',
    columnBg: 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800'
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    description: 'Lamaran telah dikirim',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-800/60',
    dotBg: 'bg-blue-500',
    columnBg: 'bg-blue-50/20 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/40'
  },
  assessment: {
    id: 'assessment',
    label: 'Assessment',
    description: 'Tes / Online Assignment',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/60',
    dotBg: 'bg-amber-500',
    columnBg: 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/40'
  },
  interview: {
    id: 'interview',
    label: 'Interview',
    description: 'Tahap Wawancara',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800/60',
    dotBg: 'bg-purple-500',
    columnBg: 'bg-purple-50/20 dark:bg-purple-950/10 border-purple-100 dark:border-purple-900/40'
  },
  offer: {
    id: 'offer',
    label: 'Offer',
    description: 'Penawaran kerja diterima',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/60',
    dotBg: 'bg-emerald-500',
    columnBg: 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40'
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    description: 'Tidak lolos seleksi',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/60',
    dotBg: 'bg-rose-500',
    columnBg: 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/40'
  },
  withdrawn: {
    id: 'withdrawn',
    label: 'Withdrawn',
    description: 'Membatalkan lamaran',
    badgeBg: 'bg-slate-100 dark:bg-slate-800/60',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeBorder: 'border-slate-200 dark:border-slate-700',
    dotBg: 'bg-slate-400',
    columnBg: 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
  }
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; border: string }> = {
  Low: { label: 'Rendah', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
  Medium: { label: 'Sedang', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  High: { label: 'Tinggi', color: 'text-red-700 bg-red-50 dark:bg-red-950/50 dark:text-red-300', border: 'border-red-200 dark:border-red-800' }
};

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeDays(dateString: string): string {
  if (!dateString) return '';
  try {
    const target = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Besok';
    if (diffDays === -1) return 'Kemarin';
    if (diffDays > 0) return `${diffDays} hari lagi`;
    return `${Math.abs(diffDays)} hari lalu`;
  } catch {
    return '';
  }
}

export function isUrgent(dueDateString: string, daysThreshold = 7): boolean {
  if (!dueDateString) return false;
  try {
    const target = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= daysThreshold;
  } catch {
    return false;
  }
}

export function isOverdue(dueDateString: string): boolean {
  if (!dueDateString) return false;
  try {
    const target = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    return target.getTime() < today.getTime();
  } catch {
    return false;
  }
}

export function calculateMetrics(jobs: JobApplication[]): MetricSummary {
  const summary: MetricSummary = {
    total: jobs.length,
    wishlist: 0,
    applied: 0,
    assessment: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
    responseRate: 0,
    interviewRate: 0,
    offerRate: 0,
    activeRemindersCount: 0
  };

  let activeReminders = 0;

  jobs.forEach(job => {
    if (summary[job.status] !== undefined) {
      summary[job.status]++;
    }
    
    if (job.reminders) {
      activeReminders += job.reminders.filter(r => !r.isCompleted).length;
    }
  });

  summary.activeRemindersCount = activeReminders;

  // Conversion calculations
  // Total submitted applications = total - wishlist - withdrawn
  const activeSubmitted = summary.applied + summary.assessment + summary.interview + summary.offer + summary.rejected;
  const responded = summary.assessment + summary.interview + summary.offer + summary.rejected;

  summary.responseRate = activeSubmitted > 0 ? Math.round((responded / activeSubmitted) * 100) : 0;
  summary.interviewRate = activeSubmitted > 0 ? Math.round(((summary.interview + summary.offer) / activeSubmitted) * 100) : 0;
  summary.offerRate = activeSubmitted > 0 ? Math.round((summary.offer / activeSubmitted) * 100) : 0;

  return summary;
}

export function getCompanyInitials(name: string): string {
  if (!name) return 'CO';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

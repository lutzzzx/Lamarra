import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
  JobApplication, 
  User, 
  FilterState, 
  JobStatus 
} from './types';
import { 
  apiGetJobs, 
  apiCreateJob, 
  apiUpdateJob, 
  apiUpdateJobStatus, 
  apiDeleteJob, 
  apiAddTimeline, 
  apiAddReminder, 
  apiUpdateReminder,
  apiDeleteReminder,
  apiToggleReminder, 
  apiGetMe
} from './services/api';
import { calculateMetrics } from './utils/formatters';

// Components
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { WelcomeView } from './components/WelcomeView';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { GridView } from './components/GridView';
import { JobDetailDrawer } from './components/JobDetailDrawer';
import { JobFormModal } from './components/JobFormModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { RemindersModal } from './components/RemindersModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { DataExportImportModal } from './components/DataExportImportModal';
import { SettingsModal } from './components/SettingsModal';
import { Loader2, ServerOff, Sparkles } from 'lucide-react';

// Toast Notification Type
interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'danger';
}

export default function App() {
  const queryClient = useQueryClient();

  // Navigation View State ('dashboard' | 'welcome' | 'login' | 'register')
  const [currentView, setCurrentView] = useState<'dashboard' | 'welcome' | 'login' | 'register'>(() => {
    const token = localStorage.getItem('lamarra_jwt_token');
    return token ? 'dashboard' : 'welcome';
  });
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');

  // User Session State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lamarra_current_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return null;
  });

  const [hasToken, setHasToken] = useState<boolean>(() => !!localStorage.getItem('lamarra_jwt_token'));
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Filter & View State
  const [filter, setFilter] = useState<FilterState>(() => {
    const savedView = localStorage.getItem('lamarra_view_mode') as 'kanban' | 'list' | 'grid';
    return {
      search: '',
      status: 'all',
      source: '',
      workType: '',
      workLocation: '',
      priority: '',
      sortBy: 'appliedDate_desc',
      viewMode: (savedView === 'kanban' || savedView === 'list' || savedView === 'grid') ? savedView : 'kanban'
    };
  });

  // Save view mode preference to localStorage whenever it changes
  useEffect(() => {
    if (filter.viewMode) {
      localStorage.setItem('lamarra_view_mode', filter.viewMode);
    }
  }, [filter.viewMode]);

  // Modal & Drawer States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [defaultNewStatus, setDefaultNewStatus] = useState<JobStatus | undefined>(undefined);
  
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);

  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'danger' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Authenticate user session on mount
  useEffect(() => {
    const token = localStorage.getItem('lamarra_jwt_token');
    if (token) {
      apiGetMe()
        .then(u => {
          setUser(u);
          setHasToken(true);
          setCurrentView('dashboard');
          localStorage.setItem('lamarra_current_user_v1', JSON.stringify(u));
        })
        .catch(() => {
          // Token invalid/expired
          localStorage.removeItem('lamarra_jwt_token');
          localStorage.removeItem('lamarra_current_user_v1');
          setUser(null);
          setHasToken(false);
          setCurrentView('welcome');
        });
    } else {
      setUser(null);
      setHasToken(false);
      setCurrentView('welcome');
    }
  }, []);

  // Query: Fetch Jobs from PostgreSQL API
  const {
    data: jobs = [],
    isPending: isInitialLoading,
    isFetching,
    isError: isJobsError,
    refetch: refetchJobs
  } = useQuery({
    queryKey: ['jobs', filter, user?.id],
    queryFn: () => apiGetJobs(filter),
    enabled: !!user && hasToken,
    placeholderData: keepPreviousData
  });

  // Keep selectedJob state updated when jobs array changes
  useEffect(() => {
    if (selectedJob) {
      const found = jobs.find(j => j.id === selectedJob.id);
      if (found) setSelectedJob(found);
    }
  }, [jobs]);

  // Mutations
  const createJobMutation = useMutation({
    mutationFn: apiCreateJob,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      addToast(`Lamaran baru di ${variables.companyName} berhasil ditambahkan!`, 'success');
      setIsFormOpen(false);
      setEditingJob(null);
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Gagal menambahkan lamaran.', 'danger');
    }
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiUpdateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      addToast(`Perubahan data lamaran di ${variables.data.companyName} disimpan.`, 'success');
      setIsFormOpen(false);
      setEditingJob(null);
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Gagal memperbarui lamaran.', 'danger');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) => apiUpdateJobStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousJobs = queryClient.getQueryData(['jobs', filter, user?.id]);
      queryClient.setQueryData(['jobs', filter, user?.id], (old: JobApplication[] = []) =>
        old.map(j => j.id === id ? { ...j, status } : j)
      );
      return { previousJobs };
    },
    onError: (_, __, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs', filter, user?.id], context.previousJobs);
      }
      addToast('Gagal mengubah status lamaran.', 'danger');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: apiDeleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      if (selectedJob?.id === jobIdToDelete) {
        setSelectedJob(null);
      }
      setJobIdToDelete(null);
      setIsDeleteModalOpen(false);
      addToast(`Data lamaran berhasil dihapus dari database.`, 'danger');
    },
    onError: () => {
      addToast('Gagal menghapus data lamaran.', 'danger');
    }
  });

  const addTimelineMutation = useMutation({
    mutationFn: ({ jobId, activity }: { jobId: string; activity: any }) => apiAddTimeline(jobId, activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      addToast('Catatan riwayat baru ditambahkan.', 'success');
    }
  });

  const addReminderMutation = useMutation({
    mutationFn: ({ jobId, reminder }: { jobId: string; reminder: any }) => apiAddReminder(jobId, reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      addToast('Pengingat agenda berhasil dibuat.', 'success');
    }
  });

  const updateReminderMutation = useMutation({
    mutationFn: ({ reminderId, reminder }: { reminderId: string; reminder: any }) => apiUpdateReminder(reminderId, reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      addToast('Pengingat agenda berhasil diperbarui.', 'success');
    }
  });

  const deleteReminderMutation = useMutation({
    mutationFn: (reminderId: string) => apiDeleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      addToast('Pengingat agenda dihapus.', 'danger');
    }
  });

  const toggleReminderMutation = useMutation({
    mutationFn: apiToggleReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  // Auth Callbacks
  const handleAuthSuccess = (loggedUser: User, token: string) => {
    localStorage.setItem('lamarra_jwt_token', token);
    localStorage.setItem('lamarra_current_user_v1', JSON.stringify(loggedUser));
    setUser(loggedUser);
    setHasToken(true);
    setCurrentView('dashboard');
    setIsAuthOpen(false);
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    addToast(`Selamat datang kembali, ${loggedUser.name}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('lamarra_jwt_token');
    localStorage.removeItem('lamarra_current_user_v1');
    setUser(null);
    setHasToken(false);
    queryClient.clear();
    setCurrentView('welcome');
    addToast('Anda telah keluar dari akun.', 'info');
  };

  // Metrics & Reminders Calculation
  const metrics = useMemo(() => calculateMetrics(jobs), [jobs]);

  const allReminders = useMemo(() => {
    const list: any[] = [];
    jobs.forEach(job => {
      if (job.reminders) {
        job.reminders.forEach(r => list.push({ ...r, jobId: job.id, companyName: job.companyName }));
      }
    });
    return list;
  }, [jobs]);

  // Form Submission
  const handleSaveJobForm = (formData: any) => {
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, data: formData });
    } else {
      createJobMutation.mutate(formData);
    }
  };

  const handleOpenNewJobModal = (status?: JobStatus) => {
    if (!user || !hasToken) {
      setAuthDefaultTab('login');
      setIsAuthOpen(true);
      addToast('Silakan masuk akun terlebih dahulu untuk menambahkan lamaran kerja.', 'info');
      return;
    }
    setEditingJob(null);
    setDefaultNewStatus(status);
    setIsFormOpen(true);
  };

  if (currentView !== 'dashboard') {
    return (
      <WelcomeView
        initialTab={currentView === 'welcome' ? 'welcome' : currentView}
        onAuthSuccess={handleAuthSuccess}
        onExploreGuest={() => setCurrentView('dashboard')}
        user={user}
        hasToken={hasToken}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200 overflow-x-clip">
      
      {/* Toast Notification Floating Banner */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-xl text-xs font-bold pointer-events-auto border transition-all transform animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'danger'
                ? 'bg-rose-900 text-white border-rose-800'
                : toast.type === 'info'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-700'
                : 'bg-emerald-900 text-white border-emerald-800'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Main Navbar */}
      <Navbar
        user={user}
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onLogout={handleLogout}
        onOpenAuthModal={(tab) => {
          setAuthDefaultTab(tab);
          setIsAuthOpen(true);
        }}
        onOpenNewJobModal={() => handleOpenNewJobModal()}
        onOpenRemindersModal={() => setIsRemindersOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWelcome={() => setCurrentView('welcome')}
        allReminders={allReminders}
        onSelectJob={(jobId) => {
          const found = jobs.find(j => j.id === jobId);
          if (found) setSelectedJob(found);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8 space-y-4 sm:space-y-6 w-full overflow-x-clip">
        
        {/* Guest Mode Banner */}
        {(!user || !hasToken) && (
          <div className="p-3.5 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md border border-zinc-700 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 font-medium">
              <Sparkles className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              <span>
                Anda sedang mengakses dashboard dalam <strong>Mode Tamu (Pratinjau)</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setAuthDefaultTab('login'); setIsAuthOpen(true); }}
                className="px-3.5 py-1.5 bg-white text-zinc-900 font-bold rounded-xl hover:bg-zinc-100 transition-colors shadow-2xs text-xs"
              >
                Masuk Akun
              </button>
              <button
                onClick={() => { setAuthDefaultTab('register'); setIsAuthOpen(true); }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-2xs text-xs"
              >
                Daftar Akun
              </button>
            </div>
          </div>
        )}
        
        {/* Section 1: Dashboard Statistics Overview */}
        <StatsDashboard
          summary={metrics}
          reminders={allReminders}
          onOpenRemindersModal={() => setIsRemindersOpen(true)}
          onFilterStatus={(st) => setFilter(prev => ({ ...prev, status: st as any }))}
          onSelectJob={(jobId) => {
            const found = jobs.find(j => j.id === jobId);
            if (found) setSelectedJob(found);
          }}
        />

        {/* Section 2: Global Search, Filter Controls & View Switching */}
        <FilterBar
          filter={filter}
          onChangeFilter={(updated) => setFilter(prev => ({ ...prev, ...updated }))}
          onResetFilters={() => setFilter({
            search: '',
            status: 'all',
            source: '',
            workType: '',
            workLocation: '',
            priority: '',
            sortBy: 'appliedDate_desc',
            viewMode: filter.viewMode
          })}
          onOpenNewJobModal={() => handleOpenNewJobModal()}
          totalFilteredCount={jobs.length}
        />

        {/* Loading Indicator for Initial Load */}
        {isInitialLoading && jobs.length === 0 && user && hasToken && (
          <div className="flex items-center justify-center py-12 text-zinc-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-900 dark:text-white" />
            <span className="text-sm font-medium">Memuat data dari PostgreSQL database...</span>
          </div>
        )}

        {/* Error Fallback Banner */}
        {isJobsError && user && hasToken && !isInitialLoading && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl text-center space-y-2 text-rose-800 dark:text-rose-300">
            <div className="flex items-center justify-center gap-2 font-bold">
              <ServerOff className="w-5 h-5" />
              <span>Gagal terhubung ke Server API PostgreSQL</span>
            </div>
            <p className="text-xs">
              Pastikan service Docker container PostgreSQL (`docker-compose up -d`) & Server API (`npm run server`) sedang berjalan.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => refetchJobs()}
                className="px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Main Views (Kanban, List, Grid) */}
        {(!isJobsError || !hasToken) && (!isInitialLoading || jobs.length > 0 || !hasToken) && (
          <>
            {filter.viewMode === 'kanban' && (
              <KanbanBoard
                jobs={jobs}
                onSelectJob={(job) => setSelectedJob(job)}
                onUpdateStatus={(jobId, st) => {
                  if (!user || !hasToken) {
                    setAuthDefaultTab('login');
                    setIsAuthOpen(true);
                    addToast('Silakan masuk akun untuk mengubah status lamaran.', 'info');
                    return;
                  }
                  updateStatusMutation.mutate({ id: jobId, status: st });
                }}
                onOpenNewJobWithStatus={(status) => handleOpenNewJobModal(status)}
              />
            )}

            {filter.viewMode === 'list' && (
              <ListView
                jobs={jobs}
                onSelectJob={(job) => setSelectedJob(job)}
                onEditJob={(job) => {
                  setEditingJob(job);
                  setIsFormOpen(true);
                }}
                onDeleteJob={(jobId) => {
                  setJobIdToDelete(jobId);
                  setIsDeleteModalOpen(true);
                }}
                onUpdateStatus={(jobId, st) => updateStatusMutation.mutate({ id: jobId, status: st })}
              />
            )}

            {filter.viewMode === 'grid' && (
              <GridView
                jobs={jobs}
                onSelectJob={(job) => setSelectedJob(job)}
                onEditJob={(job) => {
                  setEditingJob(job);
                  setIsFormOpen(true);
                }}
                onDeleteJob={(jobId) => {
                  setJobIdToDelete(jobId);
                  setIsDeleteModalOpen(true);
                }}
                onUpdateStatus={(jobId, st) => updateStatusMutation.mutate({ id: jobId, status: st })}
              />
            )}
          </>
        )}

      </main>

      {/* Modals & Sliding Drawers */}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab={authDefaultTab}
      />

      {/* Job Create/Edit Form Modal */}
      <JobFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingJob(null);
          setDefaultNewStatus(undefined);
        }}
        onSubmit={handleSaveJobForm}
        initialData={editingJob}
        defaultStatus={defaultNewStatus}
      />

      {/* Job Detail Side Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onEdit={(job) => {
          setSelectedJob(null);
          setEditingJob(job);
          setIsFormOpen(true);
        }}
        onDelete={(jobId) => {
          setSelectedJob(null);
          setJobIdToDelete(jobId);
          setIsDeleteModalOpen(true);
        }}
        onUpdateStatus={(jobId, st) => updateStatusMutation.mutate({ id: jobId, status: st })}
        onAddTimeline={(jobId, act) => addTimelineMutation.mutate({ jobId, activity: act })}
        onAddReminder={(jobId, rem) => addReminderMutation.mutate({ jobId, reminder: rem })}
        onUpdateReminder={(remId, rem) => updateReminderMutation.mutate({ reminderId: remId, reminder: rem })}
        onDeleteReminder={(remId) => deleteReminderMutation.mutate(remId)}
        onToggleReminder={(_, reminderId) => toggleReminderMutation.mutate(reminderId)}
      />

      {/* Confirm Delete Safety Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setJobIdToDelete(null);
        }}
        onConfirm={() => {
          if (jobIdToDelete) deleteJobMutation.mutate(jobIdToDelete);
        }}
        title={jobs.find(j => j.id === jobIdToDelete)?.companyName}
      />

      {/* Agenda & Reminders Modal */}
      <RemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        jobs={jobs}
        onToggleReminder={(_, reminderId) => toggleReminderMutation.mutate(reminderId)}
        onAddReminder={(jobId, rem) => addReminderMutation.mutate({ jobId, reminder: rem })}
        onUpdateReminder={(remId, rem) => updateReminderMutation.mutate({ reminderId: remId, reminder: rem })}
        onDeleteReminder={(remId) => deleteReminderMutation.mutate(remId)}
        onSelectJob={(jobId) => {
          const found = jobs.find(j => j.id === jobId);
          if (found) setSelectedJob(found);
        }}
      />

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        summary={metrics}
        jobs={jobs}
      />

      {/* Backup Export / Import Modal */}
      <DataExportImportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        userId={user?.id || ''}
        onDataImported={() => refetchJobs()}
      />

      {/* Profile & Account Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onProfileUpdated={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('lamarra_current_user_v1', JSON.stringify(updatedUser));
        }}
        onLogout={handleLogout}
        addToast={addToast}
      />

    </div>
  );
}

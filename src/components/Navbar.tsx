import React, { useState } from 'react';
import { User, Reminder } from '../types';
import { 
  Briefcase, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  PieChart, 
  Calendar, 
  Download, 
  Clock, 
  CheckCircle2, 
  X, 
  ChevronRight,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { formatDate, formatRelativeDays, isUrgent, isOverdue } from '../utils/formatters';

interface NavbarProps {
  user: User | null;
  currentView?: string;
  onSelectView?: (view: any) => void;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenNewJobModal: () => void;
  onOpenRemindersModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenExportModal: () => void;
  onOpenSettings?: () => void;
  onOpenWelcome?: () => void;
  allReminders: Reminder[];
  onSelectJob: (jobId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenNewJobModal,
  onOpenRemindersModal,
  onOpenAnalyticsModal,
  onOpenExportModal,
  onOpenSettings,
  onOpenWelcome,
  allReminders,
  onSelectJob
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Filter uncompleted reminders
  const activeReminders = allReminders.filter(r => !r.isCompleted);
  const urgentReminders = activeReminders.filter(r => isUrgent(r.dueDate) || isOverdue(r.dueDate));

  return (
    <>
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={onOpenWelcome}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            title="Kembali ke Beranda & Fitur"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Lamarra
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md border border-zinc-200 dark:border-zinc-700">
                Job Tracker
              </span>
            </div>
          </div>

          {/* Desktop & Mobile Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Welcome & Features Page Toggle Button (Desktop Only) */}
            {onOpenWelcome && (
              <button
                onClick={onOpenWelcome}
                className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors hidden md:flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 min-h-[40px]"
                title="Lihat Halaman Welcome & Insight Fitur"
              >
                <ShieldCheck className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span className="hidden lg:inline">Panduan & Fitur</span>
              </button>
            )}
            
            {/* Active Agenda Live Status Indicator (Desktop Only) */}
            {activeReminders.length > 0 && (
              <div className="hidden lg:flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 gap-1.5 uppercase tracking-wider mr-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeReminders.length} agenda aktif</span>
              </div>
            )}

            {/* Analytics Modal Button (Desktop Only) */}
            <button
              onClick={onOpenAnalyticsModal}
              className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors hidden md:flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 min-h-[40px]"
              title="Lihat Analitik & Statistik"
            >
              <PieChart className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Analitik</span>
            </button>

            {/* Agenda & Reminders Notification Button (Visible on Mobile & Desktop) */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserDropdown(false);
                }}
                className="px-2.5 sm:px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors relative flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 min-h-[40px] touch-manipulation"
                title="Notifikasi & Agenda"
              >
                <Bell className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-300" />
                <span className="hidden md:inline">Agenda</span>
                {activeReminders.length > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-rose-600 text-white">
                    {activeReminders.length}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/20 md:hidden" 
                    onClick={() => setShowNotifications(false)} 
                  />
                  <div 
                    className="fixed inset-x-3 top-18 sm:inset-auto sm:absolute sm:right-0 sm:mt-2 w-auto sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-xl shadow-2xl sm:shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 z-50 text-left animate-in fade-in duration-150"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                          Agenda & Pengingat Mendatang
                        </h3>
                      </div>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
                      {urgentReminders.length === 0 ? (
                        <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                          Tidak ada pengingat mendesak saat ini.
                        </div>
                      ) : (
                        urgentReminders.map(rem => (
                          <div 
                            key={rem.id}
                            onClick={() => {
                              if (rem.jobId) onSelectJob(rem.jobId);
                              setShowNotifications(false);
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:border-zinc-400 dark:hover:border-zinc-600 ${
                              isOverdue(rem.dueDate)
                                ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                                : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold">{rem.title}</span>
                              <span className="font-medium text-[11px] whitespace-nowrap opacity-80">
                                {formatRelativeDays(rem.dueDate)}
                              </span>
                            </div>
                            {rem.companyName && (
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                                {rem.companyName} {rem.jobTitle ? `- ${rem.jobTitle}` : ''}
                              </div>
                            )}
                            <div className="text-[10px] mt-1 text-zinc-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Jatuh tempo: {formatDate(rem.dueDate)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          onOpenRemindersModal();
                        }}
                        className="text-zinc-900 dark:text-white font-semibold hover:underline flex items-center gap-1 text-xs py-1"
                      >
                        <span>Lihat Semua Agenda ({activeReminders.length})</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Export/Import Data Desktop */}
            <button
              onClick={onOpenExportModal}
              className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-xs font-medium hidden md:flex items-center gap-1.5 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 min-h-[40px]"
              title="Export / Import Data"
            >
              <Download className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Data Backup</span>
            </button>

            {/* Desktop New Job CTA Button */}
            <button
              onClick={onOpenNewJobModal}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-3.5 py-2 rounded-xl text-xs font-semibold hidden md:flex items-center gap-1 shadow-sm transition-all transform active:scale-95 min-h-[40px]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Tambah Lamaran</span>
            </button>

            {/* Desktop User Account Controls */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => {
                    setShowUserDropdown(!showUserDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700 min-h-[40px]"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 text-left animate-in fade-in duration-150">
                    <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onOpenSettings) onOpenSettings();
                      }}
                      className="w-full text-left px-3 py-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-2 mt-1 font-semibold min-h-[40px]"
                    >
                      <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span>Pengaturan Akun</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenExportModal();
                      }}
                      className="w-full text-left px-3 py-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-2 min-h-[40px]"
                    >
                      <Download className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span>Backup / Export Data</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-2 mt-1 font-semibold min-h-[40px]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-xl transition-colors min-h-[40px]"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-2 rounded-xl transition-all shadow-2xs min-h-[40px]"
                >
                  Daftar
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Mobile User Dropdown Popover */}
      {showUserDropdown && (
        <div className="md:hidden">
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" 
            onClick={() => setShowUserDropdown(false)} 
          />
          <div className="fixed inset-x-4 bottom-20 z-50 bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-left animate-in slide-in-from-bottom-4 duration-200">
            {user ? (
              <div className="space-y-3">
                <div className="px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user.email}
                  </p>
                </div>

                {onOpenSettings && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-3 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2.5 min-h-[44px] touch-manipulation"
                  >
                    <Settings className="w-4.5 h-4.5 text-zinc-500" />
                    <span>Pengaturan Akun & Keamanan</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenExportModal();
                  }}
                  className="w-full text-left px-3 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2.5 min-h-[44px] touch-manipulation"
                >
                  <Download className="w-4.5 h-4.5 text-zinc-500" />
                  <span>Backup & Export Data</span>
                </button>

                {onOpenWelcome && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenWelcome();
                    }}
                    className="w-full text-left px-3 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2.5 min-h-[44px] touch-manipulation"
                  >
                    <ShieldCheck className="w-4.5 h-4.5 text-zinc-500" />
                    <span>Panduan & Fitur Lamarra</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2.5 min-h-[44px] touch-manipulation mt-2"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-center p-2">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                  Masuk atau Daftar Akun Lamarra
                </p>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-2xl text-xs font-bold min-h-[44px] touch-manipulation"
                >
                  Masuk Akun
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-3 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white rounded-2xl text-xs font-bold min-h-[44px] touch-manipulation"
                >
                  Daftar Akun Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Mobile Navigation Bar (< 768px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 md:hidden px-6 py-2 flex items-center justify-around shadow-2xl">
        
        {/* 1. Left: Analitik */}
        <button
          onClick={() => {
            setShowUserDropdown(false);
            setShowNotifications(false);
            onOpenAnalyticsModal();
          }}
          className="flex flex-col items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 px-3 min-w-[64px] touch-manipulation transition-colors"
          title="Analitik"
        >
          <PieChart className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold">Analitik</span>
        </button>

        {/* 2. Center Raised Action Button: + Tambah Lamaran */}
        <button
          onClick={() => {
            setShowUserDropdown(false);
            setShowNotifications(false);
            onOpenNewJobModal();
          }}
          className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg transform -translate-y-2 active:scale-95 transition-all touch-manipulation"
          title="Tambah Lamaran Kerja Baru"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 3. Right: Akun / User Menu */}
        <button
          onClick={() => {
            setShowNotifications(false);
            setShowUserDropdown(!showUserDropdown);
          }}
          className="flex flex-col items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 px-3 min-w-[64px] touch-manipulation transition-colors relative"
          title="Akun & Pengaturan"
        >
          <UserIcon className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold">{user ? 'Akun' : 'Masuk'}</span>
        </button>

      </div>
    </>
  );
};

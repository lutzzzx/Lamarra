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

  // Filter urgent or uncompleted reminders
  const activeReminders = allReminders.filter(r => !r.isCompleted);
  const urgentReminders = activeReminders.filter(r => isUrgent(r.dueDate) || isOverdue(r.dueDate));

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onOpenWelcome}
          className="flex items-center gap-3 cursor-pointer group"
          title="Kembali ke Beranda & Fitur"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Lamarra
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md border border-zinc-200 dark:border-zinc-700">
              Job Tracker
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Welcome & Features Page Toggle Button */}
          {onOpenWelcome && (
            <button
              onClick={onOpenWelcome}
              className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              title="Lihat Halaman Welcome & Insight Fitur"
            >
              <ShieldCheck className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span className="hidden lg:inline">Panduan & Fitur</span>
            </button>
          )}
          
          {/* Active Agenda Live Status Indicator */}
          {activeReminders.length > 0 && (
            <div className="hidden lg:flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 gap-1.5 uppercase tracking-wider mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeReminders.length} agenda aktif</span>
            </div>
          )}

          {/* Analytics Modal Button */}
          <button
            onClick={onOpenAnalyticsModal}
            className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Lihat Analitik & Statistik"
          >
            <PieChart className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden md:inline">Analitik</span>
          </button>

          {/* Agenda & Reminders Modal Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors relative flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              title="Notifikasi & Agenda"
            >
              <Bell className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span className="hidden md:inline">Agenda</span>
              {activeReminders.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                  {activeReminders.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 z-50 text-left"
                onMouseLeave={() => setShowNotifications(false)}
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
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all hover:border-zinc-400 dark:hover:border-zinc-600 ${
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
                    className="text-zinc-900 dark:text-white font-semibold hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>Lihat Semua Agenda ({activeReminders.length})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export/Import Data */}
          <button
            onClick={onOpenExportModal}
            className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-xs font-medium hidden sm:flex items-center gap-1.5 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Export / Import Data"
          >
            <Download className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden lg:inline">Data Backup</span>
          </button>

          {/* New Job CTA Button */}
          <button
            onClick={onOpenNewJobModal}
            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lamaran</span>
          </button>

          {/* User Account / Auth Control */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
              >
                <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.slice(0, 2)}
                </div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate hidden md:inline">
                  {user.name}
                </span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 text-left">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Sesi Terisolasi Lokal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-2 mt-1 font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Pengaturan Akun</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenExportModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup / Export Lamaran</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-md transition-all shadow-2xs"
              >
                Daftar
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

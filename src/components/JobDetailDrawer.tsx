import React, { useState } from 'react';
import { JobApplication, JobStatus, TimelineType, ReminderType } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, formatRelativeDays, getCompanyInitials } from '../utils/formatters';
import { CustomSelect } from './ui/CustomSelect';
import { CustomDatePicker, CustomTimePicker } from './ui/CustomDateTimePicker';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Clock, 
  X, 
  Plus, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Linkedin, 
  FileText, 
  CheckCircle2, 
  Send,
  MessageSquare,
  AlertCircle,
  History
} from 'lucide-react';

interface JobDetailDrawerProps {
  job: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (jobId: string) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  onAddTimeline: (jobId: string, activity: { date: string; type: TimelineType; title: string; notes?: string }) => void;
  onAddReminder: (jobId: string, reminder: { title: string; dueDate: string; dueTime?: string; type: ReminderType }) => void;
  onUpdateReminder?: (reminderId: string, reminder: { title: string; dueDate: string; dueTime?: string; type: ReminderType }) => void;
  onDeleteReminder?: (reminderId: string) => void;
  onToggleReminder: (jobId: string, reminderId: string) => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddTimeline,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onToggleReminder
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'reminders' | 'recruiter'>('overview');
  
  // New Timeline Form State
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [tlTitle, setTlTitle] = useState('');
  const [tlType, setTlType] = useState<TimelineType>('note');
  const [tlDate, setTlDate] = useState(new Date().toISOString().split('T')[0]);
  const [tlNotes, setTlNotes] = useState('');

  // New Reminder Form State
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remType, setRemType] = useState<ReminderType>('followup');
  const [remDueDate, setRemDueDate] = useState('');
  const [remDueTime, setRemDueTime] = useState('');

  // Inline Edit Reminder State
  const [editingRemId, setEditingRemId] = useState<string | null>(null);
  const [editRemTitle, setEditRemTitle] = useState('');
  const [editRemDueDate, setEditRemDueDate] = useState('');
  const [editRemDueTime, setEditRemDueTime] = useState('');
  const [editRemType, setEditRemType] = useState<ReminderType>('followup');

  if (!isOpen || !job) return null;

  const statusCfg = STATUS_CONFIG[job.status];
  const priorityCfg = PRIORITY_CONFIG[job.priority];

  const activeRemindersCount = job.reminders?.filter(r => !r.isCompleted).length || 0;
  const timelineCount = job.timeline?.length || 0;

  const handleCreateTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tlTitle || !tlDate) return;
    onAddTimeline(job.id, {
      title: tlTitle,
      type: tlType,
      date: tlDate,
      notes: tlNotes
    });
    setTlTitle('');
    setTlNotes('');
    setShowAddTimeline(false);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle || !remDueDate) return;
    onAddReminder(job.id, {
      title: remTitle,
      dueDate: remDueDate,
      dueTime: remDueTime || undefined,
      type: remType
    });
    setRemTitle('');
    setRemDueDate('');
    setRemDueTime('');
    setShowAddReminder(false);
  };

  const startEditRem = (rem: any) => {
    setEditingRemId(rem.id);
    setEditRemTitle(rem.title);
    setEditRemDueDate(rem.dueDate);
    setEditRemDueTime(rem.dueTime || '');
    setEditRemType(rem.type);
  };

  const handleUpdateReminder = (e: React.FormEvent, remId: string) => {
    e.preventDefault();
    if (!editRemTitle || !editRemDueDate) return;
    if (onUpdateReminder) {
      onUpdateReminder(remId, {
        title: editRemTitle,
        dueDate: editRemDueDate,
        dueTime: editRemDueTime || undefined,
        type: editRemType
      });
    }
    setEditingRemId(null);
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-sm transition-opacity cursor-pointer animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-2xl lg:max-w-4xl bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full overflow-y-auto flex flex-col shadow-2xl text-left cursor-default transition-all"
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-start justify-between gap-3 sm:gap-4 sticky top-0 bg-white/95 dark:bg-zinc-900/95 z-20 backdrop-blur-md">
          <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm">
              {getCompanyInitials(job.companyName)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white truncate">
                  {job.position}
                </h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${priorityCfg.color} ${priorityCfg.border} shrink-0`}>
                  {priorityCfg.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
                <span className="truncate">{job.companyName}</span>
                {job.locationName && <span className="truncate">• {job.locationName}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(job)}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation"
              title="Edit Lamaran"
            >
              <Edit3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation"
              title="Hapus Lamaran"
            >
              <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation ml-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Status Bar */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-100/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0">
            Status Saat Ini:
          </span>
          <div className="w-full max-w-[200px]">
            <CustomSelect
              size="sm"
              value={job.status}
              onChange={(val) => onUpdateStatus(job.id, val as JobStatus)}
              options={Object.values(STATUS_CONFIG).map(s => ({
                value: s.id,
                label: s.label,
                badgeDot: s.dotBg
              }))}
            />
          </div>
        </div>

        {/* Modern Segmented Pill Control Navigation Tabs */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x whitespace-nowrap w-full">
            
            {/* Tab 1: Ringkasan */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-none min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Ringkasan</span>
              <span className="hidden sm:inline">Informasi Ringkas</span>
            </button>

            {/* Tab 2: Timeline */}
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-none min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Timeline</span>
              <span className="hidden sm:inline">Timeline Riwayat</span>
              {timelineCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-extrabold rounded-md shrink-0 ${
                  activeTab === 'timeline' 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                }`}>
                  {timelineCount}
                </span>
              )}
            </button>

            {/* Tab 3: Agenda & Reminders */}
            <button
              type="button"
              onClick={() => setActiveTab('reminders')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-none min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'reminders'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Agenda</span>
              <span className="hidden sm:inline">Agenda & Reminders</span>
              {activeRemindersCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-md bg-amber-500 text-white shrink-0">
                  {activeRemindersCount}
                </span>
              )}
            </button>

            {/* Tab 4: Recruiter & Dokumen */}
            <button
              type="button"
              onClick={() => setActiveTab('recruiter')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-none min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'recruiter'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Kontak</span>
              <span className="hidden sm:inline">Recruiter & Dokumen</span>
            </button>

          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 flex-1 space-y-5 sm:space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              
              {/* Key Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-zinc-400 font-medium block text-[11px]">Sumber Lowongan</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{job.source}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium block text-[11px]">Tipe Pekerjaan</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{job.workType} ({job.workLocation})</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium block text-[11px]">Rentang Gaji</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{job.salaryRange || 'Tidak dicantumkan'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium block text-[11px]">Tanggal Apply</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatDate(job.appliedDate)}</span>
                </div>
                {job.deadlineDate && (
                  <div className="col-span-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 font-medium block text-[11px]">Batas Waktu / Deadline</span>
                    <span className="font-bold text-rose-700 dark:text-rose-400">{formatDate(job.deadlineDate)} ({formatRelativeDays(job.deadlineDate)})</span>
                  </div>
                )}
              </div>

              {/* URL Link */}
              {job.jobUrl && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Tautan Lowongan Pekerjaan
                  </h4>
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 w-full"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">{job.jobUrl}</span>
                  </a>
                </div>
              )}

              {/* Notes */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Catatan Tambahan
                </h4>
                <div className="p-3.5 sm:p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {job.notes || 'Belum ada catatan khusus untuk lamaran ini.'}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TIMELINE ACTIVITES */}
          {activeTab === 'timeline' && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Riwayat Aktivitas Kronologis
                </h3>
                <button
                  onClick={() => setShowAddTimeline(!showAddTimeline)}
                  className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs shrink-0 min-h-[36px] touch-manipulation"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catatan Riwayat</span>
                </button>
              </div>

              {/* Form Add Timeline */}
              {showAddTimeline && (
                <form onSubmit={handleCreateTimeline} className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Tambah Aktivitas Riwayat Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Tanggal</label>
                      <input
                        type="date"
                        required
                        value={tlDate}
                        onChange={(e) => setTlDate(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white min-h-[40px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Jenis Aktivitas</label>
                      <CustomSelect
                        size="sm"
                        value={tlType}
                        onChange={(val) => setTlType(val as TimelineType)}
                        options={[
                          { value: 'note', label: 'Catatan Umum' },
                          { value: 'interview', label: 'Wawancara / Interview' },
                          { value: 'assessment', label: 'Tes Assessment' },
                          { value: 'followup', label: 'Follow-up Recruiter' },
                          { value: 'status_change', label: 'Perubahan Status' }
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Judul Aktivitas</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Wawancara Teknis Tahap 1"
                      value={tlTitle}
                      onChange={(e) => setTlTitle(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Deskripsi / Catatan</label>
                    <textarea
                      rows={2}
                      placeholder="Rincian atau hasil dari aktivitas..."
                      value={tlNotes}
                      onChange={(e) => setTlNotes(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddTimeline(false)}
                      className="px-3 py-2 text-zinc-500 hover:text-zinc-800 font-bold min-h-[38px] touch-manipulation"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xs min-h-[38px] touch-manipulation"
                    >
                      Simpan Aktivitas
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline List */}
              <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-5">
                {(!job.timeline || job.timeline.length === 0) ? (
                  <p className="text-xs text-zinc-400 py-4">Belum ada riwayat aktivitas yang dicatat.</p>
                ) : (
                  job.timeline.map(item => (
                    <div key={item.id} className="relative">
                      <span className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-white absolute -left-[31px] top-1 border-2 border-white dark:border-zinc-900" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                            {formatDate(item.date)}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REMINDERS & AGENDA */}
          {activeTab === 'reminders' && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Pengingat & Jadwal Penting
                </h3>
                <button
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs shrink-0 min-h-[36px] touch-manipulation"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengingat</span>
                </button>
              </div>

              {/* Form Add Reminder */}
              {showAddReminder && (
                <form onSubmit={handleCreateReminder} className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Tambah Pengingat Agenda Baru</h4>
                  <div>
                    <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Judul Pengingat</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Follow-up HR via Email"
                      value={remTitle}
                      onChange={(e) => setRemTitle(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white min-h-[40px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Tanggal</label>
                      <CustomDatePicker
                        size="sm"
                        required
                        value={remDueDate}
                        onChange={(val) => setRemDueDate(val)}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Jam <span className="text-[10px] text-zinc-400 font-normal">(Opsional)</span></label>
                      <CustomTimePicker
                        size="sm"
                        value={remDueTime}
                        onChange={(val) => setRemDueTime(val)}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Jenis Agenda</label>
                      <CustomSelect
                        size="sm"
                        value={remType}
                        onChange={(val) => setRemType(val as ReminderType)}
                        options={[
                          { value: 'followup', label: 'Follow-up Recruiter' },
                          { value: 'interview', label: 'Jadwal Interview' },
                          { value: 'assessment', label: 'Tes Assessment' },
                          { value: 'deadline', label: 'Batas Akhir / Deadline' }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddReminder(false)}
                      className="px-3 py-2 text-zinc-500 hover:text-zinc-800 font-bold min-h-[38px] touch-manipulation"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xs min-h-[38px] touch-manipulation"
                    >
                      Simpan Agenda
                    </button>
                  </div>
                </form>
              )}

              {/* Reminders List */}
              <div className="space-y-3">
                {(!job.reminders || job.reminders.length === 0) ? (
                  <p className="text-xs text-zinc-400 py-6 text-center">
                    Belum ada pengingat agenda untuk lamaran ini.
                  </p>
                ) : (
                  job.reminders.map(rem => {
                    if (editingRemId === rem.id) {
                      return (
                        <form
                          key={rem.id}
                          onSubmit={(e) => handleUpdateReminder(e, rem.id)}
                          className="p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-2 text-xs"
                        >
                          <div className="font-bold text-zinc-800 dark:text-zinc-200">Edit Pengingat Agenda</div>
                          <input
                            type="text"
                            required
                            value={editRemTitle}
                            onChange={(e) => setEditRemTitle(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <CustomDatePicker
                              size="sm"
                              required
                              value={editRemDueDate}
                              onChange={(val) => setEditRemDueDate(val)}
                            />
                            <CustomTimePicker
                              size="sm"
                              value={editRemDueTime}
                              onChange={(val) => setEditRemDueTime(val)}
                            />
                            <CustomSelect
                              size="sm"
                              value={editRemType}
                              onChange={(val) => setEditRemType(val as ReminderType)}
                              options={[
                                { value: 'followup', label: 'Follow-up' },
                                { value: 'interview', label: 'Interview' },
                                { value: 'assessment', label: 'Assessment' },
                                { value: 'deadline', label: 'Deadline' }
                              ]}
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingRemId(null)}
                              className="px-2.5 py-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-white font-bold"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg shadow-2xs"
                            >
                      Simpan
                            </button>
                          </div>
                        </form>
                      );
                    }
                    return (
                      <div
                        key={rem.id}
                        className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 text-xs transition-all ${
                          rem.isCompleted
                            ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 text-zinc-400 line-through'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs'
                        }`}
                      >
                        {/* Top Row: Checkbox, Title, and Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={rem.isCompleted}
                              onChange={() => onToggleReminder(job.id, rem.id)}
                              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer shrink-0 mt-0.5"
                            />
                            <span className="font-bold text-xs text-zinc-900 dark:text-white leading-snug break-words">
                              {rem.title}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                            {rem.type}
                          </span>
                        </div>

                        {/* Bottom Row: Date/Time & Action Buttons */}
                        <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <div className="flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-300">
                              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="whitespace-nowrap">{formatDate(rem.dueDate)}{rem.dueTime ? ` pk ${rem.dueTime}` : ''}</span>
                            </div>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                              {formatRelativeDays(rem.dueDate)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {onUpdateReminder && (
                              <button
                                type="button"
                                onClick={() => startEditRem(rem)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center touch-manipulation"
                                title="Edit Pengingat"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onDeleteReminder && (
                              <button
                                type="button"
                                onClick={() => onDeleteReminder(rem.id)}
                                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center touch-manipulation"
                                title="Hapus Pengingat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RECRUITER & DOCUMENTS */}
          {activeTab === 'recruiter' && (
            <div className="space-y-5 sm:space-y-6 text-xs">
              
              {/* Recruiter Section */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Informasi Recruiter / Kontak
                </h3>
                {job.recruiter && (job.recruiter.name || job.recruiter.email) ? (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                    {job.recruiter.name && (
                      <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
                        <UserIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>{job.recruiter.name}</span>
                        {job.recruiter.title && (
                          <span className="text-xs font-normal text-zinc-500">({job.recruiter.title})</span>
                        )}
                      </div>
                    )}
                    {job.recruiter.email && (
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                        <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                        <a href={`mailto:${job.recruiter.email}`} className="hover:underline truncate">{job.recruiter.email}</a>
                      </div>
                    )}
                    {job.recruiter.phone && (
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                        <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>{job.recruiter.phone}</span>
                      </div>
                    )}
                    {job.recruiter.linkedin && (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                        <Linkedin className="w-4 h-4 shrink-0" />
                        <a href={job.recruiter.linkedin} target="_blank" rel="noreferrer" className="hover:underline truncate">Profil LinkedIn Recruiter</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-zinc-400 py-2">Belum ada informasi recruiter yang dicatat.</p>
                )}
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Dokumen & Surat Lamaran
                </h3>
                {job.documents?.coverLetter ? (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                    <span className="text-zinc-400 font-medium block">Cover Letter / Surat Lamaran</span>
                    <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {job.documents.coverLetter}
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-400 py-2">Belum ada surat lamaran / dokumen terlampir.</p>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Reminder, JobApplication, ReminderType } from '../types';
import { formatDate, formatRelativeDays, isUrgent, isOverdue } from '../utils/formatters';
import { CustomSelect } from './ui/CustomSelect';
import { CustomDatePicker, CustomTimePicker } from './ui/CustomDateTimePicker';
import { Calendar, Clock, CheckCircle2, X, Building2, ChevronRight, Plus, PlusCircle, AlertCircle, Edit3, Trash2, Check, RotateCcw } from 'lucide-react';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobApplication[];
  onToggleReminder: (jobId: string, reminderId: string) => void;
  onAddReminder?: (jobId: string, reminder: { title: string; dueDate: string; dueTime?: string; type: ReminderType }) => void;
  onUpdateReminder?: (reminderId: string, reminder: { title: string; dueDate: string; dueTime?: string; type: ReminderType }) => void;
  onDeleteReminder?: (reminderId: string) => void;
  onSelectJob: (jobId: string) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onToggleReminder,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onSelectJob
}) => {
  const [filterType, setFilterType] = useState<'all' | 'active' | 'completed'>('active');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Reminder Form State
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [remTitle, setRemTitle] = useState('');
  const [remDueDate, setRemDueDate] = useState('');
  const [remDueTime, setRemDueTime] = useState('');
  const [remType, setRemType] = useState<ReminderType>('followup');
  const [formError, setFormError] = useState('');

  // Inline Editing Reminder State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');
  const [editType, setEditType] = useState<ReminderType>('followup');

  useEffect(() => {
    if (isOpen) {
      setShowAddForm(false);
      setEditingId(null);
      setFormError('');
      if (jobs.length > 0) {
        setSelectedJobId(jobs[0].id);
      }
      setRemTitle('');
      setRemDueDate(new Date().toISOString().split('T')[0]);
      setRemDueTime('');
      setRemType('followup');
    }
  }, [isOpen, jobs]);

  if (!isOpen) return null;

  // Flatten all reminders from all jobs
  const allReminders: (Reminder & { jobId: string; companyName: string; position: string })[] = [];
  jobs.forEach(job => {
    if (job.reminders) {
      job.reminders.forEach(r => {
        allReminders.push({
          ...r,
          jobId: job.id,
          companyName: job.companyName,
          position: job.position
        });
      });
    }
  });

  // Sort by due date
  allReminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const filteredReminders = allReminders.filter(r => {
    if (filterType === 'active') return !r.isCompleted;
    if (filterType === 'completed') return r.isCompleted;
    return true;
  });

  const handleCreateReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setFormError('Mohon pilih lamaran kerja tujuan.');
      return;
    }
    if (!remTitle.trim()) {
      setFormError('Mohon isi judul pengingat agenda.');
      return;
    }
    if (!remDueDate) {
      setFormError('Mohon tentukan tanggal jatuh tempo.');
      return;
    }

    if (onAddReminder) {
      onAddReminder(selectedJobId, {
        title: remTitle.trim(),
        dueDate: remDueDate,
        dueTime: remDueTime || undefined,
        type: remType
      });
    }

    setRemTitle('');
    setRemDueTime('');
    setFormError('');
    setShowAddForm(false);
  };

  const startEdit = (rem: Reminder) => {
    setEditingId(rem.id);
    setEditTitle(rem.title);
    setEditDueDate(rem.dueDate);
    setEditDueTime(rem.dueTime || '');
    setEditType(rem.type);
  };

  const handleUpdateReminderSubmit = (e: React.FormEvent, remId: string) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDueDate) return;
    if (onUpdateReminder) {
      onUpdateReminder(remId, {
        title: editTitle.trim(),
        dueDate: editDueDate,
        dueTime: editDueTime || undefined,
        type: editType
      });
    }
    setEditingId(null);
  };

  const jobOptions = jobs.map(j => ({
    value: j.id,
    label: `${j.companyName} - ${j.position}`
  }));

  const reminderTypeOptions = [
    { value: 'followup', label: 'Follow-up Recruiter' },
    { value: 'interview', label: 'Jadwal Interview' },
    { value: 'assessment', label: 'Tes Assessment' },
    { value: 'deadline', label: 'Batas Akhir / Deadline' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col p-6 shadow-2xl relative text-left my-auto">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  Modul Agenda & Pengingat Jadwal
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Kelola jadwal interview, assessment, deadline & pengingat
                </p>
              </div>
            </div>

            {onAddReminder && (
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingId(null);
                  setFormError('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
                  showAddForm
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                    : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900'
                }`}
              >
                {showAddForm ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Tutup</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* FORM INLINE TAMBAH AGENDA BARU */}
        {showAddForm && (
          <form onSubmit={handleCreateReminderSubmit} className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl space-y-3.5 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 text-xs">
                <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Buat Pengingat Agenda Baru</span>
              </h3>
              <span className="text-[10px] text-zinc-400">Database PostgreSQL</span>
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-xl text-[11px] font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Target Job Selector */}
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Pilih Lamaran Kerja Tujuan <span className="text-rose-500">*</span>
              </label>
              {jobs.length === 0 ? (
                <p className="text-rose-500 font-medium py-1 text-[11px]">
                  Belum ada data lamaran kerja. Tambahkan lamaran kerja terlebih dahulu.
                </p>
              ) : (
                <CustomSelect
                  size="sm"
                  value={selectedJobId}
                  onChange={(val) => setSelectedJobId(val)}
                  options={jobOptions}
                  placeholder="Pilih lamaran kerja..."
                />
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Judul Agenda / Pengingat <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Interview User Tahap 2, Online Test..."
                value={remTitle}
                onChange={(e) => setRemTitle(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/20 focus:outline-none text-zinc-900 dark:text-white"
              />
            </div>

            {/* Due Date, Optional Time & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tanggal <span className="text-rose-500">*</span>
                </label>
                <CustomDatePicker
                  size="sm"
                  required
                  value={remDueDate}
                  onChange={(val) => setRemDueDate(val)}
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Jam / Waktu <span className="text-[10px] text-zinc-400 font-normal">(Opsional)</span>
                </label>
                <CustomTimePicker
                  size="sm"
                  value={remDueTime}
                  onChange={(val) => setRemDueTime(val)}
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Jenis Agenda
                </label>
                <CustomSelect
                  size="sm"
                  value={remType}
                  onChange={(val) => setRemType(val as ReminderType)}
                  options={reminderTypeOptions}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={jobs.length === 0}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl shadow-xs disabled:opacity-50"
              >
                Simpan Agenda
              </button>
            </div>
          </form>
        )}

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'active'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Aktif / Mendatang ({allReminders.filter(r => !r.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'completed'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Selesai ({allReminders.filter(r => r.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Semua ({allReminders.length})
          </button>
        </div>

        {/* Reminders List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-4 pr-1">
          {filteredReminders.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              Tidak ada agenda dalam kategori ini.
            </div>
          ) : (
            filteredReminders.map(rem => {
              const overdue = !rem.isCompleted && isOverdue(rem.dueDate);
              const urgent = !rem.isCompleted && isUrgent(rem.dueDate);
              const isEditing = editingId === rem.id;

              if (isEditing) {
                return (
                  <form
                    key={rem.id}
                    onSubmit={(e) => handleUpdateReminderSubmit(e, rem.id)}
                    className="p-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 space-y-3 text-xs animate-in fade-in duration-150"
                  >
                    <div className="flex items-center justify-between font-bold text-zinc-800 dark:text-zinc-200">
                      <span>Edit Pengingat Agenda</span>
                      <span className="text-[10px] text-zinc-400">{rem.companyName}</span>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Judul Agenda</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Tanggal</label>
                        <CustomDatePicker
                          size="sm"
                          required
                          value={editDueDate}
                          onChange={(val) => setEditDueDate(val)}
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Jam (Opsional)</label>
                        <CustomTimePicker
                          size="sm"
                          value={editDueTime}
                          onChange={(val) => setEditDueTime(val)}
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Jenis</label>
                        <CustomSelect
                          size="sm"
                          value={editType}
                          onChange={(val) => setEditType(val as ReminderType)}
                          options={reminderTypeOptions}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-white font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div
                  key={rem.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    rem.isCompleted
                      ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 text-zinc-400 line-through'
                      : overdue
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                      : urgent
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={rem.isCompleted}
                      onChange={() => onToggleReminder(rem.jobId, rem.id)}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{rem.title}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="font-medium truncate">{rem.companyName} - {rem.position}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Jatuh Tempo: {formatDate(rem.dueDate)}{rem.dueTime ? ` pukul ${rem.dueTime}` : ''} ({formatRelativeDays(rem.dueDate)})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mr-1">
                      {rem.type}
                    </span>

                    {/* Edit Button */}
                    {onUpdateReminder && (
                      <button
                        onClick={() => startEdit(rem)}
                        className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit Pengingat Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete Button */}
                    {onDeleteReminder && (
                      <button
                        onClick={() => onDeleteReminder(rem.id)}
                        className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Hapus Pengingat Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectJob(rem.jobId);
                        onClose();
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                      title="Lihat Lamaran Ini"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { JobApplication, JobStatus, JobSource, WorkType, WorkLocation, Priority } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../utils/formatters';
import { CustomSelect } from './ui/CustomSelect';
import { CustomDatePicker } from './ui/CustomDateTimePicker';
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Globe, 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Linkedin, 
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Layers,
  Send,
  UserCheck,
  Award,
  XCircle,
  HelpCircle,
  FileCode2,
  ChevronRight
} from 'lucide-react';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: JobApplication | null;
  defaultStatus?: JobStatus;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStatus
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'details' | 'recruiter'>('general');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobStatus>(defaultStatus || 'applied');
  const [source, setSource] = useState<JobSource>('LinkedIn');
  const [workType, setWorkType] = useState<WorkType>('Full-time');
  const [workLocation, setWorkLocation] = useState<WorkLocation>('Hybrid');
  const [locationName, setLocationName] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  
  // Recruiter info
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterTitle, setRecruiterTitle] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [recruiterLinkedin, setRecruiterLinkedin] = useState('');

  // Documents & Notes
  const [resumeVersion, setResumeVersion] = useState('Resume_Standard_2026.pdf');
  const [coverLetter, setCoverLetter] = useState('');
  const [notes, setNotes] = useState('');

  // Initial reminder
  const [initialReminderDate, setInitialReminderDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setPosition(initialData.position || '');
      setStatus(initialData.status || 'applied');
      setSource(initialData.source || 'LinkedIn');
      setWorkType(initialData.workType || 'Full-time');
      setWorkLocation(initialData.workLocation || 'Hybrid');
      setLocationName(initialData.locationName || '');
      setSalaryRange(initialData.salaryRange || '');
      setJobUrl(initialData.jobUrl || '');
      setAppliedDate(initialData.appliedDate || new Date().toISOString().split('T')[0]);
      setDeadlineDate(initialData.deadlineDate || '');
      setPriority(initialData.priority || 'Medium');
      
      setRecruiterName(initialData.recruiter?.name || '');
      setRecruiterTitle(initialData.recruiter?.title || '');
      setRecruiterEmail(initialData.recruiter?.email || '');
      setRecruiterPhone(initialData.recruiter?.phone || '');
      setRecruiterLinkedin(initialData.recruiter?.linkedin || '');

      setResumeVersion(initialData.documents?.resumeVersion || 'Resume_Standard_2026.pdf');
      setCoverLetter(initialData.documents?.coverLetter || '');
      setNotes(initialData.notes || '');
    } else {
      // Reset form
      setCompanyName('');
      setPosition('');
      setStatus(defaultStatus || 'applied');
      setSource('LinkedIn');
      setWorkType('Full-time');
      setWorkLocation('Hybrid');
      setLocationName('');
      setSalaryRange('');
      setJobUrl('');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setDeadlineDate('');
      setPriority('Medium');
      setRecruiterName('');
      setRecruiterTitle('');
      setRecruiterEmail('');
      setRecruiterPhone('');
      setRecruiterLinkedin('');
      setResumeVersion('Resume_Standard_2026.pdf');
      setCoverLetter('');
      setNotes('');
      setInitialReminderDate('');
      setActiveTab('general');
    }
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim()) {
      setActiveTab('general');
      return;
    }

    const payload = {
      companyName: companyName.trim(),
      position: position.trim(),
      status,
      source,
      workType,
      workLocation,
      locationName: locationName.trim() || workLocation,
      salaryRange: salaryRange.trim(),
      jobUrl: jobUrl.trim(),
      appliedDate,
      deadlineDate: deadlineDate || undefined,
      priority,
      recruiter: {
        name: recruiterName.trim(),
        title: recruiterTitle.trim(),
        email: recruiterEmail.trim(),
        phone: recruiterPhone.trim(),
        linkedin: recruiterLinkedin.trim()
      },
      documents: {
        resumeVersion: resumeVersion.trim(),
        coverLetter: coverLetter.trim()
      },
      notes: notes.trim(),
      initialReminderDate: initialReminderDate || undefined
    };

    onSubmit(payload);
    onClose();
  };

  const statusIcons: Record<JobStatus, React.ReactNode> = {
    wishlist: <Bookmark className="w-3.5 h-3.5" />,
    applied: <Send className="w-3.5 h-3.5" />,
    assessment: <FileCode2 className="w-3.5 h-3.5" />,
    interview: <UserCheck className="w-3.5 h-3.5" />,
    offer: <Award className="w-3.5 h-3.5" />,
    rejected: <XCircle className="w-3.5 h-3.5" />,
    withdrawn: <HelpCircle className="w-3.5 h-3.5" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl relative text-left overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-md font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
                {initialData ? 'Edit Data Lamaran' : 'Tambah Lamaran Kerja Baru'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Kelola informasi perusahaan, posisi, status seleksi & pengingat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Navigation */}
        <div className="px-6 pt-3 bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Perusahaan & Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Detail & Tenggat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recruiter')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'recruiter'
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>3. Recruiter & Catatan</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: PERUSAHAAN & POSISI */}
          {activeTab === 'general' && (
            <div className="space-y-5 text-xs animate-in fade-in duration-200">
              
              {/* Company & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Nama Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Misal: Tokopedia, Traveloka, GoTo"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Posisi / Jabatan Pekerjaan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Misal: Senior Frontend Engineer"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Status Selector Grid Pills */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Status Tahapan Seleksi Saat Ini
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['wishlist', 'applied', 'assessment', 'interview', 'offer', 'rejected', 'withdrawn'] as JobStatus[]).map((stKey) => {
                    const cfg = STATUS_CONFIG[stKey];
                    const isSelected = status === stKey;
                    return (
                      <button
                        key={stKey}
                        type="button"
                        onClick={() => setStatus(stKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? `${cfg.badgeBg} ${cfg.badgeBorder} ring-2 ring-zinc-900 dark:ring-white font-bold shadow-xs`
                            : 'bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dotBg}`} />
                        <div className="truncate">
                          <div className="font-bold text-[11px] leading-tight truncate">{cfg.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority & Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tingkat Prioritas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Medium', 'High'] as Priority[]).map((p) => {
                      const cfg = PRIORITY_CONFIG[p];
                      const isSelected = priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                            isSelected
                              ? `${cfg.color} ${cfg.border} ring-2 ring-zinc-900 dark:ring-white`
                              : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Sumber Lowongan Kerja
                  </label>
                  <CustomSelect
                    value={source}
                    onChange={(val) => setSource(val as JobSource)}
                    options={[
                      { value: 'LinkedIn', label: 'LinkedIn' },
                      { value: 'JobStreet', label: 'JobStreet' },
                      { value: 'Glints', label: 'Glints' },
                      { value: 'Kalibrr', label: 'Kalibrr' },
                      { value: 'Website Perusahaan', label: 'Website Perusahaan' },
                      { value: 'Referral', label: 'Referral' },
                      { value: 'Deel', label: 'Deel' },
                      { value: 'Lainnya', label: 'Lainnya' }
                    ]}
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DETAIL PEKERJAAN & TENGGAT */}
          {activeTab === 'details' && (
            <div className="space-y-5 text-xs animate-in fade-in duration-200">
              
              {/* Work Type & Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tipe Pekerjaan
                  </label>
                  <CustomSelect
                    value={workType}
                    onChange={(val) => setWorkType(val as WorkType)}
                    options={[
                      { value: 'Full-time', label: 'Full-time' },
                      { value: 'Contract', label: 'Contract' },
                      { value: 'Part-time', label: 'Part-time' },
                      { value: 'Internship', label: 'Internship' },
                      { value: 'Freelance', label: 'Freelance' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Sistem Kerja
                  </label>
                  <CustomSelect
                    value={workLocation}
                    onChange={(val) => setWorkLocation(val as WorkLocation)}
                    options={[
                      { value: 'Hybrid', label: 'Hybrid' },
                      { value: 'Remote', label: 'Remote' },
                      { value: 'On-site', label: 'On-site' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Lokasi (Kota / Negara)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Misal: Jakarta Selatan"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Salary & Job Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Estimasi Rentang Gaji
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Misal: Rp 15.000.000 - Rp 20.000.000 / bulan"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tautan / URL Lowongan Kerja
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dates & Reminders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tanggal Kirim Lamaran
                  </label>
                  <CustomDatePicker
                    value={appliedDate}
                    onChange={(val) => setAppliedDate(val)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tenggat / Deadline Seleksi
                  </label>
                  <CustomDatePicker
                    value={deadlineDate}
                    onChange={(val) => setDeadlineDate(val)}
                    placeholder="Opsional..."
                  />
                </div>

                {!initialData && (
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Pengingat Follow-up Awal
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={initialReminderDate}
                        onChange={(e) => setInitialReminderDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: RECRUITER & CATATAN */}
          {activeTab === 'recruiter' && (
            <div className="space-y-5 text-xs animate-in fade-in duration-200">
              
              {/* Recruiter Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Nama Recruiter / Talent Acquisition
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Misal: Rina Wijaya"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Jabatan Recruiter
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Tech Talent Acquisition Lead"
                    value={recruiterTitle}
                    onChange={(e) => setRecruiterTitle(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Email Recruiter
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="recruiter@company.com"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Telepon / WhatsApp Recruiter
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+62 812-3456-7890"
                      value={recruiterPhone}
                      onChange={(e) => setRecruiterPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Profil LinkedIn Recruiter
                  </label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={recruiterLinkedin}
                      onChange={(e) => setRecruiterLinkedin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-2">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Catatan Persiapan & Keterangan Lain
                </label>
                <textarea
                  rows={3}
                  placeholder="Misal: Pelajari Next.js SSR & persiapan portfolio..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white"
                />
              </div>

            </div>
          )}

          {/* Footer Bar & Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`w-2.5 h-2.5 rounded-full transition-all ${activeTab === 'general' ? 'bg-zinc-900 dark:bg-white w-6' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              />
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`w-2.5 h-2.5 rounded-full transition-all ${activeTab === 'details' ? 'bg-zinc-900 dark:bg-white w-6' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              />
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className={`w-2.5 h-2.5 rounded-full transition-all ${activeTab === 'recruiter' ? 'bg-zinc-900 dark:bg-white w-6' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-xs"
              >
                Batal
              </button>

              {activeTab !== 'recruiter' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'general' ? 'details' : 'recruiter')}
                  className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                type="submit"
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{initialData ? 'Simpan Perubahan' : 'Simpan Lamaran Kerja'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

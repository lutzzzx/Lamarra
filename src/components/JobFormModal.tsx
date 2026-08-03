import React, { useState, useEffect } from 'react';
import { JobApplication, JobStatus, Priority, WorkLocation, WorkType, JobSource } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../utils/formatters';
import { CustomSelect } from './ui/CustomSelect';
import { 
  X, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Globe, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  Phone, 
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Partial<JobApplication>) => void;
  initialData?: JobApplication | null;
  defaultStatus?: JobStatus;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStatus = 'applied'
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'details' | 'recruiter'>('general');

  // Form Field States
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [source, setSource] = useState<JobSource>('LinkedIn');
  
  const [workType, setWorkType] = useState<WorkType>('Full-time');
  const [workLocation, setWorkLocation] = useState<WorkLocation>('Hybrid');
  const [locationName, setLocationName] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setPosition(initialData.position || '');
      setStatus(initialData.status || defaultStatus);
      setPriority(initialData.priority || 'Medium');
      setSource(initialData.source || 'LinkedIn');
      setWorkType(initialData.workType || 'Full-time');
      setWorkLocation(initialData.workLocation || 'Hybrid');
      setLocationName(initialData.locationName || '');
      setSalaryRange(initialData.salaryRange || '');
      setJobUrl(initialData.jobUrl || '');
      setAppliedDate(initialData.appliedDate ? initialData.appliedDate.split('T')[0] : '');
      setDeadline(initialData.deadline ? initialData.deadline.split('T')[0] : '');
      setRecruiterName(initialData.recruiterName || '');
      setRecruiterContact(initialData.recruiterContact || '');
      setNotes(initialData.notes || '');
    } else {
      setCompanyName('');
      setPosition('');
      setStatus(defaultStatus);
      setPriority('Medium');
      setSource('LinkedIn');
      setWorkType('Full-time');
      setWorkLocation('Hybrid');
      setLocationName('');
      setSalaryRange('');
      setJobUrl('');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setDeadline('');
      setRecruiterName('');
      setRecruiterContact('');
      setNotes('');
    }
    setActiveTab('general');
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim()) return;

    onSubmit({
      companyName: companyName.trim(),
      position: position.trim(),
      status,
      priority,
      source,
      workType,
      workLocation,
      locationName: locationName.trim(),
      salaryRange: salaryRange.trim(),
      jobUrl: jobUrl.trim(),
      appliedDate: appliedDate ? new Date(appliedDate).toISOString() : new Date().toISOString(),
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      recruiterName: recruiterName.trim(),
      recruiterContact: recruiterContact.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-zinc-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl relative text-left overflow-hidden my-auto max-h-[94vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-3.5 py-3 sm:px-6 sm:py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-md font-bold shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-white tracking-tight truncate">
                {initialData ? 'Edit Data Lamaran' : 'Tambah Lamaran Kerja'}
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate hidden sm:block">
                Kelola informasi perusahaan, posisi, status seleksi & pengingat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 sm:p-2 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
          >
            <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Compact Segmented Pill Control Navigation Tabs */}
        <div className="px-3 sm:px-6 py-2 sm:py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 shrink-0">
          <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl grid grid-cols-3 gap-1 sm:gap-1.5 w-full">
            
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`w-full py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 min-h-[34px] sm:min-h-[38px] touch-manipulation ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">1. Perusahaan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`w-full py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 min-h-[34px] sm:min-h-[38px] touch-manipulation ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">2. Detail</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recruiter')}
              className={`w-full py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 min-h-[34px] sm:min-h-[38px] touch-manipulation ${
                activeTab === 'recruiter'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">3. Catatan</span>
            </button>

          </div>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 text-left">
          
          {/* TAB 1: PERUSAHAAN & POSISI */}
          {activeTab === 'general' && (
            <div className="space-y-3.5 sm:space-y-5 text-xs animate-in fade-in duration-200">
              
              {/* Company & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
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
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white transition-all min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
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
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white transition-all min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Ultra-Compact Status Selector Pills */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 text-xs">
                  Status Tahapan Seleksi Saat Ini
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['wishlist', 'applied', 'assessment', 'interview', 'offer', 'rejected', 'withdrawn'] as JobStatus[]).map((stKey) => {
                    const cfg = STATUS_CONFIG[stKey];
                    const isSelected = status === stKey;
                    return (
                      <button
                        key={stKey}
                        type="button"
                        onClick={() => setStatus(stKey)}
                        className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border text-xs transition-all flex items-center gap-1.5 min-h-[32px] sm:min-h-[36px] touch-manipulation whitespace-nowrap ${
                          isSelected
                            ? `${cfg.badgeBg} ${cfg.badgeBorder} ring-2 ring-zinc-900 dark:ring-white font-bold text-zinc-900 dark:text-white shadow-2xs`
                            : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotBg}`} />
                        <span className="text-[11px] leading-tight">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority & Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-0.5">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tingkat Prioritas
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {(['Low', 'Medium', 'High'] as Priority[]).map((p) => {
                      const cfg = PRIORITY_CONFIG[p];
                      const isSelected = priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg sm:rounded-xl border text-center font-bold text-xs transition-all min-h-[32px] sm:min-h-[36px] touch-manipulation ${
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
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
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
            <div className="space-y-3.5 sm:space-y-5 text-xs animate-in fade-in duration-200">
              
              {/* Work Type & Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
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
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
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
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Lokasi (Kota / Negara)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Misal: Jakarta Selatan"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Salary & Job Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Estimasi Rentang Gaji
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Misal: Rp 15.000.000 - Rp 20.000.000 / bulan"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tautan / URL Lowongan Kerja
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tanggal Melamar
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={appliedDate}
                      onChange={(e) => setAppliedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tenggat / Deadline Lowongan
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: RECRUITER & CATATAN */}
          {activeTab === 'recruiter' && (
            <div className="space-y-3.5 sm:space-y-5 text-xs animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Nama Recruiter / Kontak Perusahaan
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Misal: Sarah (HR Recruiter)"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email / No. HP Recruiter
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="sarah@company.com / 0812..."
                      value={recruiterContact}
                      onChange={(e) => setRecruiterContact(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white min-h-[38px] sm:min-h-[42px] touch-manipulation text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Catatan Penting / Pengalaman Seleksi
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan tambahan mengenai ekspektasi gaji, pertanyaan teknis, atau catatan wawancara..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none text-zinc-900 dark:text-white text-xs leading-relaxed"
                />
              </div>

            </div>
          )}

          {/* Sticky Form Footer Bar */}
          <div className="pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 shrink-0">
            
            {/* Step Indicators */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${activeTab === 'general' ? 'bg-zinc-900 dark:bg-white w-5 sm:w-6' : 'bg-zinc-300 dark:bg-zinc-700 w-1.5 sm:w-2'}`}
                title="Tahap 1: Perusahaan"
              />
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${activeTab === 'details' ? 'bg-zinc-900 dark:bg-white w-5 sm:w-6' : 'bg-zinc-300 dark:bg-zinc-700 w-1.5 sm:w-2'}`}
                title="Tahap 2: Detail"
              />
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${activeTab === 'recruiter' ? 'bg-zinc-900 dark:bg-white w-5 sm:w-6' : 'bg-zinc-300 dark:bg-zinc-700 w-1.5 sm:w-2'}`}
                title="Tahap 3: Recruiter"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-xs min-h-[38px] sm:min-h-[44px] touch-manipulation shrink-0"
              >
                Batal
              </button>

              {activeTab !== 'recruiter' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'general' ? 'details' : 'recruiter')}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1 min-h-[38px] sm:min-h-[44px] touch-manipulation shrink-0"
                >
                  <span>Lanjut</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] min-h-[38px] sm:min-h-[44px] touch-manipulation shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="sm:hidden">{initialData ? 'Simpan' : 'Simpan'}</span>
                <span className="hidden sm:inline">{initialData ? 'Simpan Perubahan' : 'Simpan Lamaran Kerja'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

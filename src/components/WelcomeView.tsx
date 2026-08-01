import React, { useState } from 'react';
import { User } from '../types';
import { apiLogin, apiRegister } from '../services/api';
import { 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  Kanban, 
  UserCheck, 
  Sparkles, 
  Mail, 
  User as UserIcon, 
  Lock,
  Download,
  Clock,
  Eye,
  BarChart3,
  Loader2
} from 'lucide-react';

interface WelcomeViewProps {
  onAuthSuccess: (user: User, token: string) => void;
  onExploreGuest: () => void;
  initialTab?: 'welcome' | 'login' | 'register';
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ 
  onAuthSuccess, 
  onExploreGuest,
  initialTab = 'welcome'
}) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'login' | 'register'>(initialTab);
  
  // Form state for auth
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setAuthError('Mohon masukkan email dan kata sandi.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      const res = await apiLogin(loginEmail.trim(), loginPassword);
      onAuthSuccess(res.user, res.token);
    } catch (err: any) {
      setAuthError(err.response?.data?.error || 'Gagal masuk. Periksa email dan kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword) {
      setAuthError('Mohon lengkapi nama, email, dan kata sandi.');
      return;
    }
    if (registerPassword.length < 6) {
      setAuthError('Kata sandi minimal 6 karakter.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      const res = await apiRegister(registerName.trim(), registerEmail.trim(), registerPassword);
      onAuthSuccess(res.user, res.token);
    } catch (err: any) {
      setAuthError(err.response?.data?.error || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* Header Navigation */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('welcome')}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Lamarra
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded border border-zinc-200 dark:border-zinc-700 hidden sm:inline-block">
              Job Application Tracker
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('welcome'); setAuthError(''); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'welcome' 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Beranda & Fitur
            </button>
            
            <button
              onClick={() => { setActiveTab('login'); setAuthError(''); }}
              className={`px-3 py-1.5 rounded-md border transition-all ${
                activeTab === 'login'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-bold'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Masuk Akun
            </button>

            <button
              onClick={() => { setActiveTab('register'); setAuthError(''); }}
              className={`px-3.5 py-1.5 rounded-md transition-all shadow-xs hidden sm:inline-flex items-center gap-1 ${
                activeTab === 'register'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold'
              }`}
            >
              <span>Daftar Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-center">
        
        {/* VIEW 1: WELCOME / LANDING PAGE & INSIGHTS */}
        {activeTab === 'welcome' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Solusi Cerdas & Terorganisir Cari Kerja</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                Kelola Seluruh Lamaran Kerja & Pantau Progres Karir Anda
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
                Lamarra membantu pencari kerja mengorganisasi riwayat lamaran, menjadwalkan agenda interview, dan menganalisis tingkat keberhasilan seleksi dalam satu dashboard intuitif.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span>Mulai Sekarang (Gratis)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('login')}
                  className="px-5 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-lg text-sm transition-colors border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 shadow-2xs"
                >
                  <span>Masuk Akun</span>
                </button>

                <button
                  onClick={onExploreGuest}
                  className="px-4 py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Eksplorasi Dashboard</span>
                </button>
              </div>

            </div>

            {/* Key Job Search Insights Banner */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
              <div className="text-center mb-8">
                <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  Mengapa Anda Membutuhkan Lamarra?
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  Insight Penting dalam Proses Pencarian Kerja
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white pt-1">
                    Mencegah Lupa Follow-up & Deadline
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Lebih dari 60% pelamar melewatkan jadwal interview atau deadline online test akibat tidak memiliki pengingat terstruktur.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white pt-1">
                    Pantau Rasio Response Rate
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Ketahui efektivitas CV Anda dengan memantau berapa persen lamaran yang menghasilkan panggilan interview secara nyata.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white pt-1">
                    PostgreSQL Database Aman & Terisolasi
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Data disimpan secara aman di PostgreSQL database dengan enkripsi kata sandi bcrypt & autentikasi JWT token.
                  </p>
                </div>

              </div>
            </div>

            {/* Application Features Showcase */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  Fitur Unggulan
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  Fitur Utama Pendukung Karir Anda
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Feature 1 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 hover:border-zinc-400 transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
                    <Kanban className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Papan Kanban & Multi Tampilan
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pindahkan status lamaran (Applied, Assessment, Interview, Offer) dengan drag and drop intuitif atau ganti ke mode tabel & grid.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 hover:border-zinc-400 transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Modul Agenda & Pengingat
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Jadwalkan interview, follow-up recruiter, dan tes psikotes. Dapatkan indikator visual saat tenggat mendekat.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 hover:border-zinc-400 transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Analitik Rasio Konversi
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Dapatkan grafik breakdown saluran pekerjaan (LinkedIn, JobStreet, Referral) dan rasio panggilan interview secara real-time.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 hover:border-zinc-400 transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Backup Data & Restore JSON
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Export seluruh data riwayat lamaran dan catatan recruiter Anda dari PostgreSQL ke dalam file cadangan JSON kapan saja.
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-2xl p-8 text-center space-y-4 shadow-xl">
              <h2 className="text-2xl font-bold">Siap Mengatur Strategi Karir Anda?</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-lg mx-auto">
                Mulai kelola seluruh lamaran pekerjaan Anda sekarang tanpa biaya dan tanpa kerumitan.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-6 py-2.5 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white font-bold rounded-lg text-xs hover:opacity-90 transition-opacity"
                >
                  Buat Akun Baru
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-5 py-2.5 border border-zinc-700 dark:border-zinc-300 font-bold rounded-lg text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  Masuk Akun
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: LOGIN PAGE */}
        {activeTab === 'login' && (
          <div className="max-w-md w-full mx-auto animate-in fade-in duration-300">
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
              
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold mb-3">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Masuk ke Akun Lamarra
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Masukkan alamat email dan kata sandi Anda untuk mengakses dashboard.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-md text-xs transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Belum punya akun?</span>
                <button
                  onClick={() => { setActiveTab('register'); setAuthError(''); }}
                  className="font-bold text-zinc-900 dark:text-white hover:underline"
                >
                  Daftar Akun Baru
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: REGISTER PAGE */}
        {activeTab === 'register' && (
          <div className="max-w-md w-full mx-auto animate-in fade-in duration-300">
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
              
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold mb-3">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Buat Akun Lamarra Baru
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Daftarkan akun gratis untuk menyimpan riwayat lamaran kerja di PostgreSQL.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Misal: Rizky Pratama"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-md text-xs transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Daftar Akun Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Sudah punya akun?</span>
                <button
                  onClick={() => { setActiveTab('login'); setAuthError(''); }}
                  className="font-bold text-zinc-900 dark:text-white hover:underline"
                >
                  Masuk di Sini
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800 py-6 bg-white dark:bg-zinc-950 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} Lamarra Job Tracker. Dibuat untuk produktivitas pencarian kerja Anda.</p>
      </footer>

    </div>
  );
};

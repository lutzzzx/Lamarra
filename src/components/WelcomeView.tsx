import React, { useState } from 'react';
import { User } from '../types';
import { AuthForm } from './AuthForm';
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
  Loader2,
  LayoutDashboard,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  Shield,
  Layers,
  FileSpreadsheet,
  MousePointerClick,
  Check,
  Star
} from 'lucide-react';

interface WelcomeViewProps {
  onAuthSuccess: (user: User, token: string) => void;
  onExploreGuest: () => void;
  initialTab?: 'welcome' | 'login' | 'register';
  user?: User | null;
  hasToken?: boolean;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ 
  onAuthSuccess, 
  onExploreGuest,
  initialTab = 'welcome',
  user,
  hasToken
}) => {
  const isLoggedIn = !!(user || hasToken);
  const [activeTab, setActiveTab] = useState<'welcome' | 'login' | 'register'>(initialTab);
  
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah Lamarra dapat digunakan secara gratis?",
      a: "Ya! Lamarra 100% gratis digunakan untuk mengorganisasi seluruh lamaran kerja Anda. Tidak ada biaya tersembunyi atau batasan jumlah lamaran yang disimpan."
    },
    {
      q: "Bagaimana cara data lamaran saya disimpan?",
      a: "Seluruh data Anda disimpan secara aman di PostgreSQL database server dengan enkripsi otentikasi JWT. Data Anda terisolasi secara pribadi dan hanya dapat diakses oleh akun Anda."
    },
    {
      q: "Apakah saya bisa memindahkan status lamaran dengan mudah?",
      a: "Sangat mudah! Lamarra menyediakan papan Kanban interaktif dengan fitur drag-and-drop mulus, auto-scroll cerdas, serta menu navigasi pindah status satu klik."
    },
    {
      q: "Apakah saya bisa mengatur jam pengingat untuk agenda interview?",
      a: "Tentu saja. Saat membuat agenda atau pengingat jadwal, Anda dapat menentukan tanggal beserta jam opsional (misal: `09:00`, `14:00`) menggunakan Custom Interactive Date & Time Picker bawaan."
    },
    {
      q: "Apakah data lamaran saya dapat diekspor atau dicadangkan?",
      a: "Bisa! Lamarra menyediakan fitur backup dan export data ke format JSON / CSV sehingga Anda dapat mengunduh salinan cadangan data kapan saja dari menu navigasi."
    },
    {
      q: "Bagaimana jika saya ingin menghapus akun saya?",
      a: "Anda dapat mengakses menu Pengaturan Akun di profil pengguna. Di sana terdapat tab Zona Bahaya dengan fitur konfirmasi berlapis keamanan tinggi untuk menghapus akun dan seluruh data secara permanen."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div 
            onClick={() => setActiveTab('welcome')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Lamarra
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md border border-zinc-200 dark:border-zinc-700 hidden sm:inline-block">
                Job Tracker
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('welcome')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'welcome' 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Beranda & Fitur
            </button>
            
            {isLoggedIn ? (
              <button
                onClick={onExploreGuest}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold flex items-center gap-1.5 shadow-sm text-xs transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                    activeTab === 'login'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-bold'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Masuk Akun
                </button>

                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all shadow-xs hidden sm:inline-flex items-center gap-1 ${
                    activeTab === 'register'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold'
                      : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold'
                  }`}
                >
                  <span>Daftar Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* VIEW 1: LANDING PAGE & FEATURE INSIGHTS */}
        {activeTab === 'welcome' && (
          <div className="space-y-20 pb-16 animate-in fade-in duration-300">
            
            {/* HERO SECTION */}
            <section className="pt-12 md:pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Platform Pelacak Lamaran Kerja Terlengkap & Modern</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
                Kelola Seluruh Lamaran Kerja & Pantau Progres Karir Anda
              </h1>

              <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-3xl mx-auto">
                Lamarra membantu pencari kerja mengorganisasi riwayat lamaran, menjadwalkan agenda interview, dan menganalisis tingkat keberhasilan seleksi dalam satu papan dashboard intuitif.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={onExploreGuest}
                    className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl text-base transition-all shadow-xl flex items-center gap-2.5 hover:scale-[1.02] cursor-pointer"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('register')}
                      className="px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                    >
                      <span>Mulai Sekarang (Gratis)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('login')}
                      className="px-6 py-3.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl text-sm transition-colors border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 shadow-2xs"
                    >
                      <span>Masuk Akun</span>
                    </button>

                    <button
                      onClick={onExploreGuest}
                      className="px-5 py-3.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Eksplorasi Mode Tamu</span>
                    </button>
                  </>
                )}
              </div>

              {/* MOCKUP APP PREVIEW CARD */}
              <div className="pt-8 max-w-5xl mx-auto">
                <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden group">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="ml-2 font-mono text-zinc-400 text-[11px]">lamarra-tracker.app/kanban</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      LIVE PREVIEW
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-700/60">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Applied</span>
                        <span className="px-2 py-0.5 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-300">3</span>
                      </div>
                      <div className="mt-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-100 text-rose-800 border border-rose-200">High</span>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Senior Frontend Engineer</h4>
                        <p className="text-[11px] text-zinc-500">Tokopedia • Full-time</p>
                      </div>
                    </div>

                    <div className="bg-amber-50/40 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-800/60">
                        <span className="font-bold text-xs text-amber-900 dark:text-amber-200 uppercase tracking-wider">Interview</span>
                        <span className="px-2 py-0.5 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-amber-800 dark:text-amber-300">2</span>
                      </div>
                      <div className="mt-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">Medium</span>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Full Stack Developer</h4>
                        <p className="text-[11px] text-zinc-500">Gojek • Remote</p>
                        <div className="pt-1 text-[10px] text-amber-700 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Besok 09:00 - User Interview</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 hidden sm:block">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-800/60">
                        <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Offering</span>
                        <span className="px-2 py-0.5 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-emerald-800 dark:text-emerald-300">1</span>
                      </div>
                      <div className="mt-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Offering</span>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Lead Software Architect</h4>
                        <p className="text-[11px] text-zinc-500">Traveloka • Remote</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            {/* KEY METRICS BANNER */}
            <section className="bg-zinc-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-y border-zinc-800">
              <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">100%</div>
                  <div className="text-xs text-zinc-400 font-medium">Bebas Gratis Tanpa Biaya</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">7 Status</div>
                  <div className="text-xs text-zinc-400 font-medium">Siklus Papan Kanban</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">Jam & Tanggal</div>
                  <div className="text-xs text-zinc-400 font-medium">Interactive Custom Picker</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">PostgreSQL</div>
                  <div className="text-xs text-zinc-400 font-medium">Data Keamanan Terenkripsi</div>
                </div>
              </div>
            </section>

            {/* WHY LAMARRA? (PAIN POINTS & SOLUTIONS) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Mengapa Anda Membutuhkan Lamarra?
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  Solusi Cerdas untuk Tantangan Cari Kerja
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    Mencegah Lupa Follow-up & Interview
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Lebih dari 60% pelamar melewatkan jadwal interview atau deadline online test akibat tidak memiliki pengingat jadwal yang terstruktur.
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Kanban className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    Visualisasi Kanban & 3 Tampilan
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pantau posisi lamaran mulai dari Wishlist, Applied, Assessment, Interview, hingga Offer dengan tampilan Kanban, List, dan Grid.
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    Analitik & Statistik Peluang Karir
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Ketahui persentase respon interview, rata-rata gaji, serta efektivitas platform lowongan (LinkedIn, JobStreet, Glints) secara objektif.
                  </p>
                </div>

              </div>
            </section>

            {/* HOW IT WORKS (STEP-BY-STEP WORKFLOW) */}
            <section className="bg-zinc-100 dark:bg-zinc-900/50 py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-200 dark:border-zinc-800">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    Alur Kerja Sederhana
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                    4 Langkah Mudah Menguasai Progres Karir Anda
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Tambah Lamaran Kerja</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Catat nama perusahaan, posisi, lokasi, sumber (LinkedIn/Glints), gaji, dan catatan khusus.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Geser Status di Kanban</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Pindahkan kartu antar-kolom dengan drag-and-drop mulus berkecepatan dinamis.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Atur Agenda & Jam</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Jadwalkan interview dan tes online menggunakan picker tanggal & jam interaktif.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center">
                      4
                    </div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Analisis & Backup Data</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Pantau rasio diterima dan ekspor data lamaran Anda ke file JSON atau CSV kapan saja.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* FEATURE MATRIX HIGHLIGHTS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Fitur Unggulan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  Dirancang Khusus untuk Produktivitas Pencari Kerja
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                    <Kanban className="w-4.5 h-4.5 text-indigo-500" />
                    <span>Board Kanban Auto-Scroll</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pengalaman drag-and-drop lincah dengan animasi 60 FPS dan tombol panah navigasi cepat.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                    <Calendar className="w-4.5 h-4.5 text-amber-500" />
                    <span>Interactive Date & Time Picker</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pop-up kalender kustom dengan preset cepat (+7 hari, besok) dan pilihan jam/menit mudah.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                    <Clock className="w-4.5 h-4.5 text-rose-500" />
                    <span>Update & Delete Agenda</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Edit judul, tanggal, tipe, dan hapus pengingat jadwal langsung dari modal agenda atau detail drawer.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                    <Layers className="w-4.5 h-4.5 text-emerald-500" />
                    <span>3 Mode Tampilan (Kanban, List, Grid)</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Beralih mode tampilan dengan mudah dan simpan preferensi mode tampilan secara otomatis di local storage.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                    <Download className="w-4.5 h-4.5 text-blue-500" />
                    <span>Backup & Import JSON/CSV</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Cadangkan seluruh data lamaran Anda atau impor data eksternal dengan satu klik aman.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                    <Shield className="w-4.5 h-4.5 text-purple-500" />
                    <span>Pengaturan Akun & Hapus Berlapis</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Kelola profil, ubah kata sandi, dan perlindungan hapus akun 3 langkah konfirmasi keamanan.
                  </p>
                </div>

              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  FAQ & Pertanyaan Umum
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  Hal yang Sering Ditanyakan
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div 
                      key={idx}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-bold text-sm text-zinc-900 dark:text-white flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                          <span>{faq.q}</span>
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* FINAL CALL TO ACTION (CTA BANNER) */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-zinc-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Siap Menata Karir Anda?</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Mulai Kelola Lamaran Kerja Anda Hari Ini
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                  Bergabunglah dan rasakan kemudahan mengorganisasi seluruh tahapan seleksi pekerjaan secara terstruktur, rapi, dan efisien.
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  {isLoggedIn ? (
                    <button
                      onClick={onExploreGuest}
                      className="px-8 py-3.5 bg-white text-zinc-900 hover:bg-zinc-100 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab('register')}
                        className="px-7 py-3.5 bg-white text-zinc-900 hover:bg-zinc-100 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2"
                      >
                        <span>Daftar Akun Gratis</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={onExploreGuest}
                        className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-colors border border-zinc-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Eksplorasi Mode Tamu</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="pt-8 text-center text-xs text-zinc-400 space-y-2 border-t border-zinc-200 dark:border-zinc-800 max-w-7xl mx-auto">
              <p className="font-semibold text-zinc-500 dark:text-zinc-400">
                Lamarra Job Tracker &copy; 2026. Seluruh hak cipta dilindungi.
              </p>
              <p className="text-[11px] text-zinc-400">
                Dikembangkan dengan PostgreSQL Database, TypeScript, React & Tailwind CSS.
              </p>
            </footer>

          </div>
        )}

        {/* VIEW 2 & 3: LOGIN / REGISTER AUTHENTICATION */}
        {activeTab !== 'welcome' && (
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: SaaS Feature Highlights & Branding */}
              <div className="hidden md:block md:col-span-5 space-y-6 text-left border-r border-zinc-100 dark:border-zinc-800/80 pr-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-md">
                    <Briefcase className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                    Lamarra Job Tracker
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Organisasi seluruh lamaran kerja Anda dalam satu platform terpadu.
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Kanban & 3 Tampilan</h4>
                      <p className="text-[11px] text-zinc-500">Pantau status lamaran dengan Kanban, List, dan Grid view.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Pengingat Jadwal & Jam</h4>
                      <p className="text-[11px] text-zinc-500">Atur tanggal dan jam opsional untuk agenda interview Anda.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">PostgreSQL Security</h4>
                      <p className="text-[11px] text-zinc-500">Data Anda tersimpan terisolasi per akun di database server.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Bebas Gratis Tanpa Biaya</span>
                </div>
              </div>

              {/* Right Column: Interactive AuthForm Component */}
              <div className="md:col-span-7">
                <AuthForm
                  initialMode={activeTab === 'register' ? 'register' : 'login'}
                  onModeChange={(mode) => setActiveTab(mode)}
                  onSuccess={onAuthSuccess}
                />
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

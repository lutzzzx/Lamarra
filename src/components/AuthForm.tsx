import React, { useState } from 'react';
import { User } from '../types';
import { apiLogin, apiRegister } from '../services/api';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AuthFormProps {
  initialMode?: 'login' | 'register';
  onSuccess: (user: User, token: string) => void;
  onModeChange?: (mode: 'login' | 'register') => void;
  isModal?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  initialMode = 'login',
  onSuccess,
  onModeChange,
  isModal = false
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync internal state when initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode]);

  const handleTabSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  // Password strength logic for registration
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-200 dark:bg-zinc-700' };
    if (pass.length < 6) return { score: 1, label: 'Lemah (Min 6 Karakter)', color: 'bg-rose-500' };
    
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) return { score: 2, label: 'Cukup', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Bagus', color: 'bg-blue-500' };
    return { score: 4, label: 'Sangat Kuat', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !password || (mode === 'register' && !cleanName)) {
      setError('Mohon lengkapi seluruh kolom yang diperlukan.');
      return;
    }

    if (mode === 'register' && password.length < 6) {
      setError('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const res = await apiRegister(cleanName, cleanEmail, password);
        onSuccess(res.user, res.token);
      } else {
        const res = await apiLogin(cleanEmail, password);
        onSuccess(res.user, res.token);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Gagal melakukan otentikasi. Periksa kembali email dan kata sandi Anda.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header & Mode Switcher Tab */}
      <div className="space-y-4 text-center">
        
        {/* Toggle Pills */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-bold w-full max-w-[260px] mx-auto shadow-2xs">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>Masuk</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>Daftar</span>
          </button>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Lamarra'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
            {mode === 'login'
              ? 'Masuk ke akun Anda untuk mengelola seluruh data lamaran kerja dan agenda interview'
              : 'Daftar gratis sekarang dan mulai kelola progres pencarian karir Anda secara terorganisir'}
          </p>
        </div>
      </div>

      {/* Error Alert Notification Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-bold block">Gagal Otentikasi</span>
            <span className="text-[11px] leading-tight opacity-90">{error}</span>
          </div>
        </div>
      )}

      {/* Auth Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Name Input (Register Mode Only) */}
        {mode === 'register' && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Nama Lengkap <span className="text-rose-500">*</span></span>
            </label>
            <div className="relative group">
              <UserIcon className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/80 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/15 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span>Alamat Email <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative group">
            <Mail className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/80 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/15 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Password Input with Visibility Toggle */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span>Kata Sandi <span className="text-rose-500">*</span></span>
            {mode === 'register' && (
              <span className="text-[10px] text-zinc-400 font-normal">Minimal 6 karakter</span>
            )}
          </label>
          <div className="relative group">
            <Lock className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/80 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/15 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-md"
              title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Real-time Password Strength Indicator (Register Mode) */}
          {mode === 'register' && password.length > 0 && (
            <div className="pt-1 space-y-1 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <span className="text-zinc-500 dark:text-zinc-400">Kekuatan Kata Sandi:</span>
                <span className={`font-bold ${
                  strength.score <= 1 ? 'text-rose-500' : strength.score === 2 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-1 p-0.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-full rounded-full transition-all duration-300 ${
                      step <= strength.score ? strength.color : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[46px] touch-manipulation active:scale-[0.99] hover:shadow-lg cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-zinc-900" />
              <span>Memproses {mode === 'login' ? 'Masuk' : 'Pendaftaran'}...</span>
            </>
          ) : (
            <>
              <span>{mode === 'login' ? 'Masuk Akun Sekarang' : 'Daftar Akun Baru'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch Mode Footer Link */}
      <div className="pt-2 text-center text-xs">
        <button
          type="button"
          onClick={() => handleTabSwitch(mode === 'login' ? 'register' : 'login')}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors hover:underline inline-flex items-center gap-1"
        >
          <span>{mode === 'login' ? 'Belum memiliki akun?' : 'Sudah memiliki akun?'}</span>
          <span className="font-bold text-zinc-900 dark:text-white underline">
            {mode === 'login' ? 'Daftar Akun Gratis' : 'Masuk Akun'}
          </span>
        </button>
      </div>

      {/* Security & Data Integrity Trust Footer Badge */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>Otentikasi PostgreSQL Encrypted JWT</span>
      </div>

    </div>
  );
};

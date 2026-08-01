import React, { useState } from 'react';
import { User } from '../types';
import { apiUpdateProfile, apiDeleteAccount } from '../services/api';
import { 
  X, 
  User as UserIcon, 
  Key, 
  ShieldAlert, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  Calendar,
  Loader2,
  Trash2
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onProfileUpdated: (user: User) => void;
  onLogout: () => void;
  addToast: (message: string, type?: 'info' | 'success' | 'danger') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
  onLogout,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'session' | 'danger'>('profile');

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Delete Account States (Multi-layer confirmation)
  const [isAgreed, setIsAgreed] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!isOpen) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setProfileError('Nama dan email tidak boleh kosong.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setProfileError('Kata sandi baru minimal 6 karakter.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setProfileError('Konfirmasi kata sandi baru tidak cocok.');
        return;
      }
      if (!currentPassword) {
        setProfileError('Masukkan kata sandi lama untuk mengonfirmasi perubahan kata sandi.');
        return;
      }
    }

    setProfileLoading(true);
    setProfileError('');

    try {
      const updatedUser = await apiUpdateProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });

      onProfileUpdated(updatedUser);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      addToast('Profil akun berhasil diperbarui!', 'success');
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Gagal memperbarui profil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const isDeleteReady = 
    isAgreed && 
    confirmPhrase.trim() === 'HAPUS AKUN SAYA' && 
    deletePassword.length > 0;

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeleteReady) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await apiDeleteAccount(deletePassword);
      addToast('Akun Anda telah berhasil dihapus secara permanen.', 'info');
      onLogout();
      onClose();
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || 'Gagal menghapus akun. Periksa kata sandi Anda.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] text-left my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-md font-bold shrink-0">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tracking-tight truncate">
                Pengaturan Akun & Keamanan
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate hidden sm:block">
                Kelola informasi profil, kata sandi, dan sesi akun Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modern Segmented Pill Control Navigation Tabs */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 shrink-0">
          <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x whitespace-nowrap w-full text-xs">
            
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-[90px] px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Profil</span>
              <span className="hidden sm:inline">Profil Saya</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('session')}
              className={`flex-1 min-w-[90px] px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'session'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Sesi</span>
              <span className="hidden sm:inline">Sesi & Keluar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('danger')}
              className={`flex-1 min-w-[90px] px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] touch-manipulation whitespace-nowrap ${
                activeTab === 'danger'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-500/80 hover:text-rose-600'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Bahaya</span>
              <span className="hidden sm:inline">Zona Bahaya</span>
            </button>

          </div>
        </div>

        {/* Tab Contents Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-xs text-left">
          
          {/* TAB 1: Edit Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 animate-in fade-in duration-200">
              {profileError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {profileError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 min-h-[42px] touch-manipulation"
                    placeholder="Nama Lengkap"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 min-h-[42px] touch-manipulation"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Password Change Sub-section */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Key className="w-4 h-4 text-zinc-400" />
                  <span>Ubah Kata Sandi (Opsional)</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Kosongkan bagian ini jika Anda tidak ingin mengubah kata sandi Anda.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-medium text-zinc-600 dark:text-zinc-400">
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none min-h-[42px] touch-manipulation"
                      placeholder="Masukkan kata sandi lama Anda"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-medium text-zinc-600 dark:text-zinc-400">
                        Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none min-h-[42px] touch-manipulation"
                        placeholder="Minimal 6 karakter"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-zinc-600 dark:text-zinc-400">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none min-h-[42px] touch-manipulation"
                        placeholder="Ulangi kata sandi baru"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] touch-manipulation"
                >
                  {profileLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Session & Logout */}
          {activeTab === 'session' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                      Sesi Login Aktif
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                      Anda terotentikasi aman melalui PostgreSQL JWT Session
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>Email: <strong>{user?.email}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>Bergabung: <strong>{formatDate(user?.createdAt)}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-900 dark:text-amber-200 space-y-3">
                <h4 className="font-bold text-xs flex items-center gap-1.5">
                  <LogOut className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Keluar dari Akun</span>
                </h4>
                <p className="text-[11px] leading-relaxed">
                  Mengeluarkan sesi aktif Anda dari perangkat ini. Anda perlu masuk kembali dengan email dan kata sandi untuk mengelola lamaran Anda.
                </p>
                <div>
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm text-xs min-h-[44px] touch-manipulation"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>Keluar Sekarang (Logout)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Danger Zone */}
          {activeTab === 'danger' && (
            <form onSubmit={handleDeleteAccountSubmit} className="space-y-5 animate-in fade-in duration-200">
              
              {/* Alert Warning Box */}
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>PERINGATAN: Tindakan Ini Bersifat Permanen!</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Menghapus akun akan menghapus seluruh data lamaran kerja, riwayat timeline, dan pengingat agenda Anda secara permanen dari PostgreSQL database server. Data yang sudah dihapus <strong>TIDAK DAPAT DIKEMBALIKAN LAGI</strong>.
                </p>
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-900 text-white text-xs font-bold">
                  {deleteError}
                </div>
              )}

              {/* Multi-step Safety Checklist */}
              <div className="space-y-4 pt-1">
                <div className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Konfirmasi Berlapis Keamanan Penghapusan Akun:
                </div>

                {/* Layer 1: Checkbox agreement */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-rose-600 rounded focus:ring-rose-500 shrink-0"
                  />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    Langkah 1: Saya memahami bahwa menghapus akun ini akan menghapus seluruh data lamaran saya secara permanen.
                  </span>
                </label>

                {/* Layer 2: Confirmation phrase input */}
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Langkah 2: Ketik kalimat konfirmasi persis di bawah ini:
                  </label>
                  <div className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 select-all">
                    HAPUS AKUN SAYA
                  </div>
                  <input
                    type="text"
                    value={confirmPhrase}
                    onChange={(e) => setConfirmPhrase(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 min-h-[42px] touch-manipulation"
                    placeholder="Ketik HAPUS AKUN SAYA di sini"
                  />
                </div>

                {/* Layer 3: Password verification */}
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Langkah 3: Masukkan kata sandi akun Anda untuk verifikasi akhir:
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 min-h-[42px] touch-manipulation"
                    placeholder="Masukkan kata sandi saat ini"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!isDeleteReady || deleteLoading}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] touch-manipulation ${
                    isDeleteReady && !deleteLoading
                      ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer'
                      : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <Trash2 className="w-4 h-4 shrink-0" />}
                  <span>Hapus Akun Permanen</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
};

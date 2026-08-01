import React, { useState } from 'react';
import { apiExportData, apiImportData } from '../services/api';
import { Download, Upload, CheckCircle2, X, AlertCircle, Loader2 } from 'lucide-react';

interface DataExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onDataImported: () => void;
}

export const DataExportImportModal: React.FC<DataExportImportModalProps> = ({
  isOpen,
  onClose,
  userId,
  onDataImported
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadJson = async () => {
    setExporting(true);
    try {
      const exportedData = await apiExportData();
      const jsonStr = JSON.stringify(exportedData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lamarra_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Gagal mengekspor data dari server.');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyExport = async () => {
    setExporting(true);
    try {
      const exportedData = await apiExportData();
      const jsonStr = JSON.stringify(exportedData, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('Gagal menyalin data dari server.');
    } finally {
      setExporting(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    setImportStatus('loading');
    setErrorMessage('');

    try {
      await apiImportData(jsonInput);
      setImportStatus('success');
      onDataImported();
      setTimeout(() => {
        onClose();
        setImportStatus('idle');
        setJsonInput('');
      }, 1200);
    } catch (err: any) {
      setImportStatus('error');
      setErrorMessage(err.response?.data?.error || 'Format JSON tidak valid atau gagal mengimpor.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative text-left">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-zinc-900 dark:text-white" />
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">
              Export & Import Backup Data (PostgreSQL)
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Simpan data lamaran Anda secara aman dalam file JSON lokal atau import data dari cadangan lain.
          </p>
        </div>

        {/* Section 1: Export Data */}
        <div className="space-y-3 pb-6 border-b border-zinc-100 dark:border-zinc-800 text-xs">
          <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
            1. Export Backup Data
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Unduh seluruh riwayat lamaran, agenda pengingat, dan kontak recruiter Anda dari database.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadJson}
              disabled={exporting}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm disabled:opacity-50"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Unduh File Backup (.json)</span>
            </button>

            <button
              onClick={handleCopyExport}
              disabled={exporting}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {copied ? 'Tercopy!' : 'Copy JSON'}
            </button>
          </div>
        </div>

        {/* Section 2: Import Data */}
        <form onSubmit={handleImportSubmit} className="pt-6 space-y-3 text-xs">
          <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
            2. Import Restore Data
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Tempelkan isi file JSON cadangan Anda untuk mengembalikan data lamaran ke PostgreSQL:
          </p>

          <textarea
            rows={4}
            placeholder="Tempelkan teks JSON cadangan di sini..."
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setImportStatus('idle');
            }}
            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 dark:text-white"
          />

          {importStatus === 'error' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage || 'Format JSON tidak valid.'}</span>
            </div>
          )}

          {importStatus === 'success' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Data berhasil di-import ke PostgreSQL! Memperbarui...</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 rounded-xl"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={!jsonInput.trim() || importStatus === 'loading'}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl disabled:opacity-50 flex items-center gap-1.5"
            >
              {importStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Restore Data</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

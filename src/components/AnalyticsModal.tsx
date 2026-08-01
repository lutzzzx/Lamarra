import React from 'react';
import { JobApplication, MetricSummary } from '../types';
import { STATUS_CONFIG } from '../utils/formatters';
import { PieChart, BarChart3, TrendingUp, Briefcase, Building2, X, Award } from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: MetricSummary;
  jobs: JobApplication[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  summary,
  jobs
}) => {
  if (!isOpen) return null;

  // Calculate Source Distribution
  const sourcesMap: Record<string, number> = {};
  const locationMap: Record<string, number> = {};
  const workTypeMap: Record<string, number> = {};

  jobs.forEach(job => {
    sourcesMap[job.source] = (sourcesMap[job.source] || 0) + 1;
    locationMap[job.workLocation] = (locationMap[job.workLocation] || 0) + 1;
    workTypeMap[job.workType] = (workTypeMap[job.workType] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative text-left">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-zinc-900 dark:text-white" />
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">
              Analitik & Laporan Performa Lamaran
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Analisis efektivitas saluran pencarian kerja dan rasio keberhasilan seleksi Anda.
          </p>
        </div>

        {/* Primary Conversion Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400 font-semibold block">Response Rate</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-white">{summary.responseRate}%</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Mendapat tanggapan</span>
          </div>

          <div className="bg-purple-50/50 dark:bg-purple-950/20 p-3.5 rounded-xl border border-purple-200/60 dark:border-purple-900/40">
            <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold block">Interview Rate</span>
            <span className="text-2xl font-black text-purple-900 dark:text-purple-100">{summary.interviewRate}%</span>
            <span className="text-[10px] text-purple-600/80 block mt-0.5">Lolos ke wawancara</span>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">Offer Rate</span>
            <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100">{summary.offerRate}%</span>
            <span className="text-[10px] text-emerald-700/80 block mt-0.5">Menerima penawaran</span>
          </div>
        </div>

        {/* Breakdown Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Status Breakdown Bar */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
              <span>Distribusi Status Lamaran</span>
            </h3>
            <div className="space-y-2">
              {Object.values(STATUS_CONFIG).map(s => {
                const count = summary[s.id] || 0;
                const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">{s.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${pct}%` }} 
                        className={`h-full ${s.dotBg}`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sources Breakdown Bar */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-zinc-400" />
              <span>Sumber Saluran Lowongan</span>
            </h3>
            <div className="space-y-2">
              {Object.entries(sourcesMap).map(([src, count]) => {
                const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                return (
                  <div key={src}>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">{src}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${pct}%` }} 
                        className="h-full bg-zinc-800 dark:bg-zinc-200" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work Location Breakdown */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200">
              Sistem Lokasi Kerja
            </h3>
            {Object.entries(locationMap).map(([loc, count]) => (
              <div key={loc} className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>{loc}</span>
                <span className="font-bold">{count} lamaran</span>
              </div>
            ))}
          </div>

          {/* Work Type Breakdown */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200">
              Tipe Pekerjaan
            </h3>
            {Object.entries(workTypeMap).map(([wt, count]) => (
              <div key={wt} className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>{wt}</span>
                <span className="font-bold">{count} lamaran</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { MetricSummary, Reminder } from '../types';
import { STATUS_CONFIG, isUrgent, isOverdue, formatRelativeDays } from '../utils/formatters';
import { 
  Briefcase, 
  Send, 
  FileText, 
  Users, 
  Award, 
  XCircle, 
  TrendingUp, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface StatsDashboardProps {
  summary: MetricSummary;
  reminders: Reminder[];
  onOpenRemindersModal: () => void;
  onFilterStatus?: (status: string) => void;
  onSelectJob: (jobId: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  summary,
  reminders,
  onOpenRemindersModal,
  onFilterStatus,
  onSelectJob
}) => {
  const urgentAgenda = reminders.filter(r => !r.isCompleted && (isUrgent(r.dueDate) || isOverdue(r.dueDate)));

  return (
    <div className="space-y-4">
      
      {/* Urgent Agenda Banner if exists */}
      {urgentAgenda.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 uppercase tracking-wider">
                <span>{urgentAgenda.length} Agenda Penting Mendekat</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                  Perhatian
                </span>
              </h3>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                {urgentAgenda[0].title} ({urgentAgenda[0].companyName}) -{' '}
                <span className="font-bold">{formatRelativeDays(urgentAgenda[0].dueDate)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenRemindersModal}
            className="text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-200/60 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Kelola Agenda ({urgentAgenda.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Metrics Grid matching Sleek Interface design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Applications */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('all')}
          className="bg-zinc-100/60 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 p-3.5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs group"
        >
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">Total Lamaran</span>
          <span className="text-2xl font-black mt-1 text-zinc-900 dark:text-white group-hover:scale-105 transition-transform">{summary.total}</span>
        </div>

        {/* Wishlist */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('wishlist')}
          className="bg-zinc-100/60 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 p-3.5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs group"
        >
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">Wishlist</span>
          <span className="text-2xl font-black mt-1 text-zinc-900 dark:text-white group-hover:scale-105 transition-transform">{summary.wishlist}</span>
        </div>

        {/* Applied */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('applied')}
          className="bg-zinc-100/60 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 p-3.5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-2xs group"
        >
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">Applied</span>
          <span className="text-2xl font-black mt-1 text-zinc-900 dark:text-white group-hover:scale-105 transition-transform">{summary.applied}</span>
        </div>

        {/* Assessment */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('assessment')}
          className="bg-zinc-100/60 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 p-3.5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-300 dark:hover:border-amber-800 transition-all shadow-2xs group"
        >
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest text-center">Assessment</span>
          <span className="text-2xl font-black mt-1 text-zinc-900 dark:text-white group-hover:scale-105 transition-transform">{summary.assessment}</span>
        </div>

        {/* Interview */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('interview')}
          className="bg-zinc-100/60 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 p-3.5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-2xs group"
        >
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest text-center">Interview</span>
          <span className="text-2xl font-black mt-1 text-zinc-900 dark:text-white group-hover:scale-105 transition-transform">{summary.interview}</span>
        </div>

        {/* Offer */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('offer')}
          className="bg-zinc-100/60 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 p-3.5 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-800 transition-all shadow-2xs group"
        >
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-center">Offer</span>
          <span className="text-2xl font-black mt-1 text-zinc-900 dark:text-white group-hover:scale-105 transition-transform">{summary.offer}</span>
        </div>

      </div>

      {/* Conversion Funnel Progress Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
              <span>Rasio Konversi Tahapan Lamaran</span>
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div>
              <span className="text-zinc-400 text-[11px]">Response Rate:</span>{' '}
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{summary.responseRate}%</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[11px]">Interview Rate:</span>{' '}
              <span className="font-bold text-purple-700 dark:text-purple-300">{summary.interviewRate}%</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[11px]">Offer Rate:</span>{' '}
              <span className="font-bold text-emerald-700 dark:text-emerald-300">{summary.offerRate}%</span>
            </div>
          </div>
        </div>

        {/* Visual Multi-segment Progress Bar */}
        {summary.total > 0 ? (
          <div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
              {summary.applied > 0 && (
                <div 
                  style={{ width: `${(summary.applied / summary.total) * 100}%` }}
                  className="bg-blue-500 h-full transition-all"
                  title={`Applied: ${summary.applied}`}
                />
              )}
              {summary.assessment > 0 && (
                <div 
                  style={{ width: `${(summary.assessment / summary.total) * 100}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Assessment: ${summary.assessment}`}
                />
              )}
              {summary.interview > 0 && (
                <div 
                  style={{ width: `${(summary.interview / summary.total) * 100}%` }}
                  className="bg-purple-500 h-full transition-all"
                  title={`Interview: ${summary.interview}`}
                />
              )}
              {summary.offer > 0 && (
                <div 
                  style={{ width: `${(summary.offer / summary.total) * 100}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Offer: ${summary.offer}`}
                />
              )}
              {summary.rejected > 0 && (
                <div 
                  style={{ width: `${(summary.rejected / summary.total) * 100}%` }}
                  className="bg-rose-400 h-full transition-all"
                  title={`Rejected: ${summary.rejected}`}
                />
              )}
              {summary.wishlist > 0 && (
                <div 
                  style={{ width: `${(summary.wishlist / summary.total) * 100}%` }}
                  className="bg-zinc-300 dark:bg-zinc-700 h-full transition-all"
                  title={`Wishlist: ${summary.wishlist}`}
                />
              )}
            </div>

            {/* Legend Indicators */}
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Applied ({summary.applied})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Assessment ({summary.assessment})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                Interview ({summary.interview})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Offer ({summary.offer})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                Rejected ({summary.rejected})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                Wishlist ({summary.wishlist})
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-zinc-500 text-center">
            Belum ada data lamaran untuk dihitung.
          </div>
        )}
      </div>

    </div>
  );
};

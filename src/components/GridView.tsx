import React from 'react';
import { JobApplication, JobStatus } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, getCompanyInitials } from '../utils/formatters';
import { CustomSelect } from './ui/CustomSelect';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Clock, 
  Eye,
  FileText
} from 'lucide-react';

interface GridViewProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  jobs,
  onSelectJob,
  onEditJob,
  onDeleteJob,
  onUpdateStatus
}) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center my-4">
        <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
        <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
          Tidak Ada Data Lamaran
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Tidak ada data lamaran yang sesuai dengan kriteria pencarian atau filter Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 my-2">
      {jobs.map(job => {
        const statusCfg = STATUS_CONFIG[job.status];
        const priorityCfg = PRIORITY_CONFIG[job.priority];

        return (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99] touch-manipulation"
          >
            <div>
              {/* Header: Company Initials, Priority, Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                    {getCompanyInitials(job.companyName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:underline">
                      {job.position}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{job.companyName}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${priorityCfg.color} ${priorityCfg.border} shrink-0`}>
                  {priorityCfg.label}
                </span>
              </div>

              {/* Status Select Badge */}
              <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                <CustomSelect
                  size="sm"
                  value={job.status}
                  onChange={(val) => onUpdateStatus(job.id, val as JobStatus)}
                  options={Object.values(STATUS_CONFIG).map(s => ({
                    value: s.id,
                    label: s.label,
                    badgeDot: s.dotBg
                  }))}
                />
              </div>

              {/* Work Location, Type, & Salary */}
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-2 text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{job.locationName || job.workLocation} ({job.workType})</span>
                </div>

                {job.salaryRange && (
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-xs">
                    {job.salaryRange}
                  </div>
                )}

                {job.notes && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 italic pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    "{job.notes}"
                  </p>
                )}

                {/* Active Reminders Indicator */}
                {job.reminders && job.reminders.filter(r => !r.isCompleted).length > 0 && (
                  <div className="mt-2.5 p-2 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-200 text-[11px] flex items-center justify-between gap-1.5 font-medium">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="font-bold shrink-0">{job.reminders.filter(r => !r.isCompleted).length} Agenda:</span>
                      <span className="truncate">{job.reminders.filter(r => !r.isCompleted)[0].title}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Date, Source & Actions */}
            <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(job.appliedDate)}</span>
                <span className="mx-1">•</span>
                <span className="text-[11px]">via {job.source}</span>
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEditJob(job)}
                  className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                  title="Edit Data"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteJob(job.id)}
                  className="p-2 text-rose-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                  title="Hapus Data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

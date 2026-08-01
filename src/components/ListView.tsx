import React from 'react';
import { JobApplication, JobStatus } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, getCompanyInitials } from '../utils/formatters';
import { CustomSelect } from './ui/CustomSelect';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Clock, 
  Eye,
  ChevronRight
} from 'lucide-react';

interface ListViewProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  jobs,
  onSelectJob,
  onEditJob,
  onDeleteJob,
  onUpdateStatus
}) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center my-4">
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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm my-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          
          {/* Table Header */}
          <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Perusahaan & Posisi</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Prioritas</th>
              <th className="py-3 px-3">Lokasi / Tipe</th>
              <th className="py-3 px-3">Gaji & Sumber</th>
              <th className="py-3 px-3">Tanggal Apply</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {jobs.map(job => {
              const statusCfg = STATUS_CONFIG[job.status];
              const priorityCfg = PRIORITY_CONFIG[job.priority];

              return (
                <tr 
                  key={job.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectJob(job)}
                >
                  
                  {/* Company & Position */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                        {getCompanyInitials(job.companyName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-zinc-900 dark:text-white text-sm hover:underline truncate">
                            {job.position}
                          </span>
                          {job.reminders && job.reminders.filter(r => !r.isCompleted).length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold text-[10px] shrink-0 border border-amber-200 dark:border-amber-900/60">
                              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span>{job.reminders.filter(r => !r.isCompleted).length} Agenda</span>
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-zinc-400" />
                          <span>{job.companyName}</span>
                          {job.locationName && (
                            <>
                              <span>•</span>
                              <span>{job.locationName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown Badge */}
                  <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="w-36">
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
                  </td>

                  {/* Priority Badge */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${priorityCfg.color} ${priorityCfg.border}`}>
                      {priorityCfg.label}
                    </span>
                  </td>

                  {/* Location & Work Type */}
                  <td className="py-3.5 px-3 text-zinc-600 dark:text-zinc-300">
                    <div className="font-medium">{job.workLocation}</div>
                    <div className="text-[10px] text-zinc-400">{job.workType}</div>
                  </td>

                  {/* Salary & Source */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                      {job.salaryRange || '-'}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium">
                      via {job.source}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3.5 px-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>{formatDate(job.appliedDate)}</span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectJob(job)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Lihat Detail Rinci"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditJob(job)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit Data Lamaran"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteJob(job.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Hapus Data Lamaran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

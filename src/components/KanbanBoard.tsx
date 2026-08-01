import React, { useState, useRef, useEffect } from 'react';
import { JobApplication, JobStatus } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, getCompanyInitials } from '../utils/formatters';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  MoreVertical, 
  ExternalLink, 
  FileText, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
  onOpenNewJobWithStatus: (status: JobStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onSelectJob,
  onUpdateStatus,
  onOpenNewJobWithStatus
}) => {
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JobStatus | null>(null);
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(0);

  const columns: JobStatus[] = [
    'wishlist',
    'applied',
    'assessment',
    'interview',
    'offer',
    'rejected',
    'withdrawn'
  ];

  // Continuous animation loop for buttery smooth auto-scrolling
  const startAutoScrollLoop = () => {
    if (animFrameRef.current !== null) return;
    const loop = () => {
      if (containerRef.current && scrollSpeedRef.current !== 0) {
        containerRef.current.scrollLeft += scrollSpeedRef.current;
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(loop);
  };

  const stopAutoScrollLoop = () => {
    scrollSpeedRef.current = 0;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAutoScrollLoop();
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedJobId(jobId);
  };

  const handleDragEnd = () => {
    stopAutoScrollLoop();
    setDraggedJobId(null);
    setDragOverColumn(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: JobStatus) => {
    e.preventDefault();
    stopAutoScrollLoop();
    setDragOverColumn(null);
    const jobId = e.dataTransfer.getData('text/plain') || draggedJobId;
    if (jobId) {
      onUpdateStatus(jobId, targetStatus);
    }
    setDraggedJobId(null);
  };

  // Calculate proportional velocity based on distance to container edges
  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const threshold = 160; // 160px edge threshold
    const x = e.clientX;

    if (x < rect.left + threshold) {
      // Faster, responsive speed: -6px to -20px per frame
      const ratio = (rect.left + threshold - x) / threshold;
      scrollSpeedRef.current = -Math.max(6, Math.min(20, 6 + ratio * 14));
      startAutoScrollLoop();
    } else if (x > rect.right - threshold) {
      const ratio = (x - (rect.right - threshold)) / threshold;
      scrollSpeedRef.current = Math.max(6, Math.min(20, 6 + ratio * 14));
      startAutoScrollLoop();
    } else {
      stopAutoScrollLoop();
    }
  };

  const scrollBoard = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative group/board">
      
      {/* Scroll Navigation Header & Quick Controls */}
      <div className="flex items-center justify-between pb-3 px-1 text-xs">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
          <span>Board Kanban (7 Status)</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-[11px] text-zinc-400">Gunakan tombol panah / drag kartu ke tepi untuk geser</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollBoard('left')}
            className="p-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-2xs transition-all flex items-center gap-1 font-bold text-[11px]"
            title="Scroll Kiri"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kiri</span>
          </button>
          <button
            type="button"
            onClick={() => scrollBoard('right')}
            className="p-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-2xs transition-all flex items-center gap-1 font-bold text-[11px]"
            title="Scroll Kanan"
          >
            <span>Kanan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Kanban Horizontal Container */}
      <div 
        ref={containerRef}
        onDragOver={handleContainerDragOver}
        onDragLeave={stopAutoScrollLoop}
        className="w-full overflow-x-auto pb-6 pt-1 touch-pan-x scroll-smooth scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        <div className="flex gap-4 min-w-[1400px]">
          
          {columns.map(colStatus => {
            const config = STATUS_CONFIG[colStatus];
            const colJobs = jobs.filter(j => j.status === colStatus);
            const isTargeting = dragOverColumn === colStatus;

            return (
              <div
                key={colStatus}
                onDragOver={(e) => handleDragOverColumn(e, colStatus)}
                onDragLeave={(e) => handleDragLeaveColumn(e, colStatus)}
                onDrop={(e) => handleDrop(e, colStatus)}
                className={`flex-1 min-w-[260px] max-w-[320px] rounded-2xl p-3 flex flex-col transition-all duration-200 border ${
                  config.columnBg
                } ${
                  isTargeting 
                    ? 'ring-2 ring-zinc-900 dark:ring-white scale-[1.01] bg-zinc-100/80 dark:bg-zinc-800/80' 
                    : ''
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.dotBg}`} />
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      {config.label}
                    </h3>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                      {colJobs.length}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenNewJobWithStatus(colStatus)}
                    className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white text-xs font-bold p-1 rounded-md hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    title={`Tambah lamaran di kolom ${config.label}`}
                  >
                    + Tambah
                  </button>
                </div>

                {/* Column Cards Drop Area */}
                <div className="flex-1 space-y-3 min-h-[300px]">
                  {colJobs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        Kosong
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                        Tarik kartu ke sini
                      </p>
                    </div>
                  ) : (
                    colJobs.map(job => {
                      const priorityCfg = PRIORITY_CONFIG[job.priority];
                      const isBeingDragged = draggedJobId === job.id;

                      return (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, job.id)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group ${
                            isBeingDragged ? 'opacity-40 scale-95 border-dashed border-zinc-500' : ''
                          }`}
                        >
                          {/* Drag Handle & Priority Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 transition-colors">
                              <GripVertical className="w-3.5 h-3.5" />
                              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                                {job.source}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${priorityCfg.color} ${priorityCfg.border}`}>
                                {priorityCfg.label}
                              </span>

                              {/* Quick Action Dropdown */}
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuJobId(activeMenuJobId === job.id ? null : job.id);
                                  }}
                                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>

                                {activeMenuJobId === job.id && (
                                  <div 
                                    className="absolute right-0 mt-1 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 z-30 text-left"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="text-[10px] font-bold uppercase text-zinc-400 px-2 py-1">
                                      Pindah Status:
                                    </div>
                                    {columns.map(st => (
                                      <button
                                        key={st}
                                        onClick={() => {
                                          onUpdateStatus(job.id, st);
                                          setActiveMenuJobId(null);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                                          job.status === st ? 'font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800/50' : 'text-zinc-600 dark:text-zinc-400'
                                        }`}
                                      >
                                        <span>{STATUS_CONFIG[st].label}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Company Logo/Initials & Position */}
                          <div 
                            onClick={() => onSelectJob(job)}
                            className="cursor-pointer space-y-1"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                                {getCompanyInitials(job.companyName)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate hover:underline">
                                  {job.position}
                                </h4>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-zinc-400 shrink-0" />
                                  <span>{job.companyName}</span>
                                </p>
                              </div>
                            </div>

                            {/* Location & Work Type Tags */}
                            <div className="pt-2 flex flex-wrap gap-1 text-[10px] text-zinc-600 dark:text-zinc-400">
                              <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 font-medium">
                                {job.workLocation}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 font-medium">
                                {job.workType}
                              </span>
                              {job.salaryRange && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium truncate max-w-[140px]">
                                  {job.salaryRange}
                                </span>
                              )}
                            </div>

                            {/* Applied Date & Reminders Indicator */}
                            <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(job.appliedDate)}</span>
                              </span>

                              {job.reminders && job.reminders.filter(r => !r.isCompleted).length > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{job.reminders.filter(r => !r.isCompleted).length} Agenda</span>
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

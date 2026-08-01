import React, { useState } from 'react';
import { FilterState, JobStatus } from '../types';
import { STATUS_CONFIG } from '../utils/formatters';
import { CustomSelect, SelectOption } from './ui/CustomSelect';
import { 
  Search, 
  Kanban, 
  List, 
  LayoutGrid, 
  X, 
  ArrowUpDown, 
  Plus,
  Filter,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  onChangeFilter: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onOpenNewJobModal: () => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  onResetFilters,
  onOpenNewJobModal,
  totalFilteredCount
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters = 
    filter.search !== '' ||
    filter.status !== 'all' ||
    filter.source !== '' ||
    filter.workType !== '' ||
    filter.workLocation !== '' ||
    filter.priority !== '';

  const activeFilterCount = [
    filter.status !== 'all',
    filter.source !== '',
    filter.workType !== '',
    filter.workLocation !== '',
    filter.priority !== ''
  ].filter(Boolean).length;

  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'Semua Status' },
    ...Object.values(STATUS_CONFIG).map(s => ({
      value: s.id,
      label: s.label,
      badgeDot: s.dotBg
    }))
  ];

  const sourceOptions: SelectOption[] = [
    { value: '', label: 'Semua Sumber' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'JobStreet', label: 'JobStreet' },
    { value: 'Glints', label: 'Glints' },
    { value: 'Kalibrr', label: 'Kalibrr' },
    { value: 'Website Perusahaan', label: 'Website Perusahaan' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Deel', label: 'Deel' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const workLocationOptions: SelectOption[] = [
    { value: '', label: 'Semua Lokasi' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'On-site', label: 'On-site' }
  ];

  const workTypeOptions: SelectOption[] = [
    { value: '', label: 'Semua Tipe' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  const priorityOptions: SelectOption[] = [
    { value: '', label: 'Semua Prioritas' },
    { value: 'High', label: 'Tinggi (High)', badgeDot: 'bg-rose-500' },
    { value: 'Medium', label: 'Sedang (Medium)', badgeDot: 'bg-amber-500' },
    { value: 'Low', label: 'Rendah (Low)', badgeDot: 'bg-emerald-500' }
  ];

  const sortOptions: SelectOption[] = [
    { value: 'appliedDate_desc', label: 'Terbaru Didaftarkan' },
    { value: 'appliedDate_asc', label: 'Terlama Didaftarkan' },
    { value: 'company_asc', label: 'Abjad Perusahaan (A-Z)' },
    { value: 'priority_desc', label: 'Prioritas Tertinggi' },
    { value: 'deadline_asc', label: 'Deadline Terdekat' }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 space-y-3 shadow-2xs w-full overflow-x-clip">
      
      {/* Top Row: Search Input & Controls */}
      <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between">
        
        {/* Global Search Input */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari perusahaan, posisi, atau kata kunci..."
            value={filter.search}
            onChange={(e) => onChangeFilter({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 dark:focus:border-zinc-500 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all font-medium min-h-[42px] touch-manipulation"
          />
          {filter.search && (
            <button
              onClick={() => onChangeFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher (Kanban, List, Grid) & Mobile Filter Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          
          {/* View Mode Switcher Pills */}
          <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl flex items-center gap-0.5 sm:gap-1 border border-zinc-200/60 dark:border-zinc-700/80 flex-1 md:flex-initial min-w-0">
            <button
              onClick={() => onChangeFilter({ viewMode: 'kanban' })}
              className={`flex-1 md:flex-initial px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition-all min-h-[36px] touch-manipulation ${
                filter.viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Tampilan Papan Kanban"
            >
              <Kanban className="w-3.5 h-3.5 shrink-0" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => onChangeFilter({ viewMode: 'list' })}
              className={`flex-1 md:flex-initial px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition-all min-h-[36px] touch-manipulation ${
                filter.viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Tampilan Tabel List Data"
            >
              <List className="w-3.5 h-3.5 shrink-0" />
              <span>List</span>
            </button>

            <button
              onClick={() => onChangeFilter({ viewMode: 'grid' })}
              className={`flex-1 md:flex-initial px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition-all min-h-[36px] touch-manipulation ${
                filter.viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>Grid</span>
            </button>
          </div>

          {/* Mobile Filter Toggle Trigger Button (< 768px) */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 md:hidden min-h-[42px] touch-manipulation shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>

        </div>

      </div>

      {/* Filter Selectors - Responsive Grid for Mobile & Row for Desktop */}
      <div className={`pt-2.5 border-t border-zinc-100 dark:border-zinc-800 transition-all ${
        showMobileFilters ? 'block' : 'hidden md:block'
      }`}>
        <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2 text-xs">
          
          <div className="hidden md:flex items-center gap-1 text-zinc-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="w-full md:w-36">
              <CustomSelect
                size="sm"
                value={filter.status}
                onChange={(val) => onChangeFilter({ status: val as JobStatus | 'all' })}
                options={statusOptions}
              />
            </div>

            {/* Source Filter */}
            <div className="w-full md:w-36">
              <CustomSelect
                size="sm"
                value={filter.source}
                onChange={(val) => onChangeFilter({ source: val })}
                options={sourceOptions}
              />
            </div>

            {/* Work Location Filter */}
            <div className="w-full md:w-32">
              <CustomSelect
                size="sm"
                value={filter.workLocation}
                onChange={(val) => onChangeFilter({ workLocation: val })}
                options={workLocationOptions}
              />
            </div>

            {/* Work Type Filter */}
            <div className="w-full md:w-32">
              <CustomSelect
                size="sm"
                value={filter.workType}
                onChange={(val) => onChangeFilter({ workType: val })}
                options={workTypeOptions}
              />
            </div>

            {/* Priority Filter */}
            <div className="w-full md:w-36 col-span-2 sm:col-span-1">
              <CustomSelect
                size="sm"
                value={filter.priority}
                onChange={(val) => onChangeFilter({ priority: val })}
                options={priorityOptions}
              />
            </div>
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-44 md:ml-auto flex items-center gap-1.5 mt-1 md:mt-0">
            <CustomSelect
              size="sm"
              icon={<ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />}
              value={filter.sortBy}
              onChange={(val) => onChangeFilter({ sortBy: val as any })}
              options={sortOptions}
            />
          </div>

          {/* Clear Filters Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="w-full md:w-auto justify-center px-3 py-2 md:py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl font-bold flex items-center gap-1 transition-colors text-xs min-h-[38px] md:min-h-0 touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}

        </div>
      </div>

      <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center justify-between pt-1">
        <span>Menampilkan {totalFilteredCount} lamaran kerja</span>
        {hasActiveFilters && <span className="text-amber-600 dark:text-amber-400 font-semibold">* Filter aktif</span>}
      </div>

    </div>
  );
};

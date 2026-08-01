import React from 'react';
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
  Filter
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
  const hasActiveFilters = 
    filter.search !== '' ||
    filter.status !== 'all' ||
    filter.source !== '' ||
    filter.workType !== '' ||
    filter.workLocation !== '' ||
    filter.priority !== '';

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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-2xs">
      
      {/* Top Row: Search Input, View Mode Toggle, Add Button */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Global Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari perusahaan, posisi, atau kata kunci..."
            value={filter.search}
            onChange={(e) => onChangeFilter({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 dark:focus:border-zinc-500 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all font-medium"
          />
          {filter.search && (
            <button
              onClick={() => onChangeFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher (Kanban, List, Grid) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl flex items-center gap-1 border border-zinc-200/60 dark:border-zinc-700/80">
            <button
              onClick={() => onChangeFilter({ viewMode: 'kanban' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                filter.viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Tampilan Papan Kanban"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => onChangeFilter({ viewMode: 'list' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                filter.viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Tampilan Tabel List Data"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              onClick={() => onChangeFilter({ viewMode: 'grid' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                filter.viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={onOpenNewJobModal}
            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all md:hidden"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>

      </div>

      {/* Multi-criteria Filter Selectors */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2 text-xs">
        
        <div className="flex items-center gap-1 text-zinc-400 font-bold uppercase tracking-wider text-[10px] mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <CustomSelect
            size="sm"
            value={filter.status}
            onChange={(val) => onChangeFilter({ status: val as JobStatus | 'all' })}
            options={statusOptions}
          />
        </div>

        {/* Source Filter */}
        <div className="w-36">
          <CustomSelect
            size="sm"
            value={filter.source}
            onChange={(val) => onChangeFilter({ source: val })}
            options={sourceOptions}
          />
        </div>

        {/* Work Location Filter */}
        <div className="w-32">
          <CustomSelect
            size="sm"
            value={filter.workLocation}
            onChange={(val) => onChangeFilter({ workLocation: val })}
            options={workLocationOptions}
          />
        </div>

        {/* Work Type Filter */}
        <div className="w-32">
          <CustomSelect
            size="sm"
            value={filter.workType}
            onChange={(val) => onChangeFilter({ workType: val })}
            options={workTypeOptions}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-36">
          <CustomSelect
            size="sm"
            value={filter.priority}
            onChange={(val) => onChangeFilter({ priority: val })}
            options={priorityOptions}
          />
        </div>

        {/* Sort Selector */}
        <div className="w-44 ml-auto flex items-center gap-1.5">
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
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl font-bold flex items-center gap-1 transition-colors text-xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

      </div>

      <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center justify-between pt-1">
        <span>Menampilkan {totalFilteredCount} lamaran kerja</span>
        {hasActiveFilters && <span className="text-amber-600 dark:text-amber-400 font-semibold">* Filter aktif</span>}
      </div>

    </div>
  );
};

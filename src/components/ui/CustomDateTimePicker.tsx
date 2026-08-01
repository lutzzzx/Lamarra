import React, { useState, useRef, useLayoutEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, ChevronDown, X, Check } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

// ==========================================
// 1. CUSTOM INTERACTIVE DATE PICKER POPOVER
// ==========================================
interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pilih Tanggal',
  size = 'md',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  // View state for calendar (Year and Month)
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState<number>(isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth());

  const computePosition = (): React.CSSProperties => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropUp = spaceBelow < 320 && rect.top > 320;

      return {
        position: 'fixed',
        left: Math.min(rect.left, window.innerWidth - 300),
        width: 290,
        top: dropUp ? undefined : rect.bottom + 6,
        bottom: dropUp ? window.innerHeight - rect.top + 6 : undefined,
        zIndex: 9999
      };
    }
    return {};
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      const pos = computePosition();
      setPopoverStyle(pos);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      const handleScrollOrResize = (e: Event) => {
        if (popoverRef.current && popoverRef.current.contains(e.target as Node)) return;
        setIsOpen(false);
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current && !containerRef.current.contains(e.target as Node) &&
          popoverRef.current && !popoverRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Calendar logic
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const formatted = `${viewYear}-${mm}-${dd}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const setPreset = (daysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    onChange(formatted);
    setViewYear(yyyy);
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs rounded-xl'
    : 'px-3.5 py-2.5 text-xs rounded-xl';

  return (
    <div ref={containerRef} className={`relative inline-block text-left w-full ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`w-full bg-zinc-50 hover:bg-zinc-100/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium flex items-center justify-between gap-2 transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/20 ${sizeClasses} ${
          isOpen ? 'ring-2 ring-zinc-900/10 dark:ring-white/20 border-zinc-400 dark:border-zinc-600' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          <CalendarIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate font-semibold">
            {value ? formatDate(value) : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : ''}`} />
      </button>

      {/* CUSTOM POPOVER CALENDAR */}
      {isOpen && (
        <div
          ref={popoverRef}
          style={popoverStyle}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-3.5 text-xs animate-in fade-in duration-100 select-none"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-zinc-900 dark:text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1 py-2 overflow-x-auto border-b border-zinc-100 dark:border-zinc-800 text-[10px]">
            <button
              type="button"
              onClick={() => setPreset(0)}
              className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg font-semibold shrink-0"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setPreset(1)}
              className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg font-semibold shrink-0"
            >
              Besok
            </button>
            <button
              type="button"
              onClick={() => setPreset(7)}
              className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg font-semibold shrink-0"
            >
              +7 Hari
            </button>
          </div>

          {/* Days Grid Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-zinc-400 text-[10px] my-2">
            {DAY_NAMES.map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid Body */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for first week */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const mm = String(viewMonth + 1).padStart(2, '0');
              const dd = String(dayNum).padStart(2, '0');
              const dateStr = `${viewYear}-${mm}-${dd}`;
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => selectDay(dayNum)}
                  className={`w-7 h-7 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow-xs'
                      : isToday
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-400 dark:border-zinc-600 font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. CUSTOM INTERACTIVE TIME PICKER POPOVER
// ==========================================
interface CustomTimePickerProps {
  value: string; // e.g. "14:00"
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const PRESET_TIMES = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '19:00'
];

const HOURS = Array.from({ length: 24 }).map((_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  placeholder = '--:--',
  size = 'md',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  const [selectedHour, setSelectedHour] = useState<string>(value ? value.split(':')[0] || '09' : '09');
  const [selectedMinute, setSelectedMinute] = useState<string>(value ? value.split(':')[1] || '00' : '00');

  const computePosition = (): React.CSSProperties => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropUp = spaceBelow < 280 && rect.top > 280;

      return {
        position: 'fixed',
        left: Math.min(rect.left, window.innerWidth - 260),
        width: 250,
        top: dropUp ? undefined : rect.bottom + 6,
        bottom: dropUp ? window.innerHeight - rect.top + 6 : undefined,
        zIndex: 9999
      };
    }
    return {};
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      const pos = computePosition();
      setPopoverStyle(pos);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      const handleScrollOrResize = (e: Event) => {
        if (popoverRef.current && popoverRef.current.contains(e.target as Node)) return;
        setIsOpen(false);
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current && !containerRef.current.contains(e.target as Node) &&
          popoverRef.current && !popoverRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectTime = (h: string, m: string) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    onChange(`${h}:${m}`);
    setIsOpen(false);
  };

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs rounded-xl'
    : 'px-3.5 py-2.5 text-xs rounded-xl';

  return (
    <div ref={containerRef} className={`relative inline-block text-left w-full ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`w-full bg-zinc-50 hover:bg-zinc-100/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium flex items-center justify-between gap-2 transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/20 ${sizeClasses} ${
          isOpen ? 'ring-2 ring-zinc-900/10 dark:ring-white/20 border-zinc-400 dark:border-zinc-600' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate font-bold tracking-wide">
            {value ? `${value} WIB` : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              title="Hapus jam"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : ''}`} />
        </div>
      </button>

      {/* CUSTOM POPOVER TIME SELECTOR */}
      {isOpen && (
        <div
          ref={popoverRef}
          style={popoverStyle}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-3.5 text-xs animate-in fade-in duration-100 select-none space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 font-bold text-zinc-900 dark:text-white text-xs">
            <span>Pilih Jam & Menit</span>
            <span className="text-zinc-400 text-[11px] font-mono">{selectedHour}:{selectedMinute} WIB</span>
          </div>

          {/* Presets */}
          <div>
            <div className="text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Jam Favorit</div>
            <div className="flex flex-wrap gap-1">
              {PRESET_TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    const [h, m] = t.split(':');
                    selectTime(h, m);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    value === t
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Hour & Minute Scroll Lists */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 mb-1 text-center">Jam</div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-zinc-100 dark:border-zinc-800 rounded-xl p-1">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => selectTime(h, selectedMinute)}
                    className={`w-full py-1 text-center rounded-lg font-bold text-xs transition-colors ${
                      selectedHour === h && value
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-zinc-400 mb-1 text-center">Menit</div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-zinc-100 dark:border-zinc-800 rounded-xl p-1">
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectTime(selectedHour, m)}
                    className={`w-full py-1 text-center rounded-lg font-bold text-xs transition-colors ${
                      selectedMinute === m && value
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

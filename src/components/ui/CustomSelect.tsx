import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badgeDot?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  icon,
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  const selectedOption = options.find(o => o.value === value);

  // Synchronously compute position coordinates before state commit to prevent initial frame glitch
  const computePosition = (): React.CSSProperties => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropUp = spaceBelow < 220 && rect.top > 220;

      return {
        position: 'fixed',
        left: rect.left,
        width: Math.max(rect.width, 140),
        top: dropUp ? undefined : rect.bottom + 6,
        bottom: dropUp ? window.innerHeight - rect.top + 6 : undefined,
        maxHeight: 220,
        zIndex: 9999
      };
    }
    return {};
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      // Calculate position before setting isOpen so React batches them in 1 frame
      const pos = computePosition();
      setPopoverStyle(pos);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Keep position accurate on scroll or resize
  useLayoutEffect(() => {
    if (isOpen) {
      const handleScrollOrResize = (e: Event) => {
        // Do NOT close popover when scrolling INSIDE the popover options list!
        if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
          return;
        }
        setIsOpen(false);
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current && 
          !containerRef.current.contains(e.target as Node) &&
          popoverRef.current &&
          !popoverRef.current.contains(e.target as Node)
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
          {icon && <span className="text-zinc-400 shrink-0">{icon}</span>}
          {selectedOption?.badgeDot && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.badgeDot}`} />
          )}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : ''}`} />
      </button>

      {/* Fixed Position Viewport-relative Dropdown Menu (No Glitch, No Clipping, Scrollable!) */}
      {isOpen && (
        <div 
          ref={popoverRef}
          style={popoverStyle}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-1 overflow-y-auto text-xs animate-in fade-in duration-100"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center justify-between gap-2 transition-colors ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  {opt.badgeDot && (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${opt.badgeDot}`} />
                  )}
                  {opt.icon && (
                    <span className="shrink-0">{opt.icon}</span>
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};

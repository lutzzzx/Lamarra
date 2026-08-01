export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Get stored theme mode preference from localStorage
 */
export function getStoredTheme(): ThemeMode {
  const saved = localStorage.getItem('lamarra_theme') as ThemeMode;
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

/**
 * Apply theme to document root element (<html class="dark">) and persist preference
 */
export function applyTheme(mode: ThemeMode) {
  localStorage.setItem('lamarra_theme', mode);
  const root = document.documentElement;

  let isDark = false;
  if (mode === 'dark') {
    isDark = true;
  } else if (mode === 'light') {
    isDark = false;
  } else {
    // System preference fallback
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Initialize theme listener for OS system preference changes
 */
export function initThemeListener(onThemeChanged?: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = () => {
    const currentMode = getStoredTheme();
    if (currentMode === 'system') {
      applyTheme('system');
      if (onThemeChanged) onThemeChanged();
    }
  };

  mediaQuery.addEventListener('change', listener);
  return () => mediaQuery.removeEventListener('change', listener);
}

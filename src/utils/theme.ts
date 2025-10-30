export type Theme = 'light' | 'dark';

export const getThemeColors = (theme: Theme) => {
  const isDark = theme === 'dark';
  return {
    isDark,
    background: isDark ? '#0f172a' : '#f8fafc',
    foreground: isDark ? '#e2e8f0' : '#0f172a',
    card: isDark ? '#111827' : '#ffffff',
    border: isDark ? '#1f2937' : '#e5e7eb',
    buttonBg: isDark ? '#334155' : '#0ea5e9',
    buttonFg: isDark ? '#e2e8f0' : '#ffffff',
    buttonBorder: isDark ? '#475569' : '#0284c7',
    flowBackground: isDark ? '#475569' : '#0f172a',
    flowEdge: isDark ? '#94a3b8' : '#374151',
  } as const;
};

export const applyDocumentTheme = (theme: Theme) => {
  const isDark = theme === 'dark';
  const background = isDark ? '#0f172a' : '#f8fafc';
  const foreground = isDark ? '#e2e8f0' : '#0f172a';
  document.body.style.backgroundColor = background;
  document.body.style.color = foreground;
};



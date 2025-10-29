import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../utils/theme';

export function Header({ theme, onToggle, colors }: { theme: Theme; onToggle: () => void; colors: { buttonBg: string; buttonFg: string; buttonBorder: string; card: string; border: string; foreground: string; } }) {
  const isDark = theme === 'dark';
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', color: colors.foreground }}>
        <div style={{ fontWeight: 600 }}>APIWiz</div>
        <button
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 32,
            borderRadius: 9999,
            border: `1px solid ${colors.buttonBorder}`,
            backgroundColor: colors.buttonBg,
            color: colors.buttonFg,
            cursor: 'pointer',
          }}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
}



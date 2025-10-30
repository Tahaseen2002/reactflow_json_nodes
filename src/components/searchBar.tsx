import { RotateCw } from 'lucide-react';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, onSearch, onReset, result, colors }: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
   onReset: () => void;
  result: string;
  colors: { background: string; foreground: string; border: string; buttonBg: string; buttonFg: string; buttonBorder: string; card: string; };
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    //style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 , marginBottom: "10px"}}
    <div >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by JSON path (e.g., $.user.address.city or items[0].name)"
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              backgroundColor: colors.background,
              color: colors.foreground,
              border: `1px solid ${colors.border}`,
              borderRadius: 4,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.foreground, opacity: 0.5 }}>
            <Search size={18} />
          </div>
        </div>
        <button
          onClick={onSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: colors.buttonBg,
            color: colors.buttonFg,
            border: `1px solid ${colors.buttonBorder}`,
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </button>
         <button
          onClick={onReset}
          aria-label="Reset Search"
          title="Reset Search"
          style={{
            padding: '10px 8px',
            backgroundColor: colors.buttonBg, 
            color: colors.buttonFg,
            border: `1px solid ${colors.buttonBorder}`,
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RotateCw size={23} />
        </button>

      </div>
      {result && (
        <div style={{ 
          marginTop: 8, 
          fontSize: 13, 
          color: result === 'Match found' ? '#10b981' : '#ef4444',
          fontWeight: 500
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
export function JsonInput({ value, error, onChange, onVisualize, colors }: {
  value: string;
  error: string;
  onChange: (v: string) => void;
  onVisualize: () => void;
  colors: { background: string; foreground: string; border: string; buttonBg: string; buttonFg: string; buttonBorder: string; card: string; };
}) {
  return (
    <div style={{ flex: '1 1 320px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2 style={{ marginTop: 0, marginBottom: 4 }}>JSON Input</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'{"name":"API","items":[{"id":1,"label":"Node A"},{"id":2,"label":"Node B"}],"config":{"retry":3,"enabled":true}}'}
        style={{
          width: '100%',
          minHeight: 140,
          resize: 'vertical',
          backgroundColor: colors.background,
          color: colors.foreground,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: 10,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 13,
        }}
      />
      {error ? (
        <div style={{ color: '#ef4444', fontSize: 12 }}>Invalid JSON: {error}</div>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onVisualize}
          style={{
            padding: '8px 12px',
            backgroundColor: colors.buttonBg,
            color: colors.buttonFg,
            border: `1px solid ${colors.buttonBorder}`,
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Visualize
        </button>
      </div>
    </div>
  );
}



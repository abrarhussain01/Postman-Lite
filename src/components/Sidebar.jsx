const BADGE = {
  GET:    { bg: '#1a3a2a', color: '#4ade80' },
  POST:   { bg: '#3a2a0a', color: '#fbbf24' },
  PUT:    { bg: '#0a1f3a', color: '#60a5fa' },
  DELETE: { bg: '#3a0a0a', color: '#f87171' },
  PATCH:  { bg: '#2a1a3a', color: '#c084fc' },
  ERR:    { bg: '#3a0a0a', color: '#f87171' },
}

export default function Sidebar({ history, onSelect }) {
  return (
    <div style={{
      width: 220, minWidth: 220,
      background: '#252526',
      borderRight: '1px solid #333',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '12px 14px 8px',
        fontSize: 10, fontWeight: 600,
        color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em',
        borderBottom: '1px solid #333'
      }}>
        History
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!history.length && (
          <div style={{ padding: '14px', color: '#555', fontSize: 12 }}>
            No requests yet
          </div>
        )}
        {history.map((h, i) => {
          const b = BADGE[h.method] || BADGE.GET
          return (
            <div key={i} onClick={() => onSelect(h)}
              style={{
                padding: '8px 12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                borderBottom: '1px solid #2a2a2a',
                transition: 'background 0.1s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2d2d2d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 5px',
                borderRadius: 3, background: b.bg, color: b.color,
                minWidth: 38, textAlign: 'center', flexShrink: 0
              }}>
                {h.method}
              </span>
              <span style={{
                fontSize: 11, color: '#888',
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', fontFamily: 'monospace'
              }}>
                {h.url.replace(/^https?:\/\//, '')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

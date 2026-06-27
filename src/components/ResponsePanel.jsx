import { useState } from 'react'

function syntaxHighlight(json) {
  const str = typeof json === 'string' ? json : JSON.stringify(json, null, 2)
  return str.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      let color = '#b5cea8'
      if (/^"/.test(match)) color = /:$/.test(match) ? '#9cdcfe' : '#ce9178'
      else if (/true|false/.test(match)) color = '#569cd6'
      else if (/null/.test(match)) color = '#f87171'
      return `<span style="color:${color}">${match}</span>`
    }
  )
}

function statusStyle(s) {
  if (!s || s === 'ERR') return { bg: '#3a0a0a', color: '#f87171' }
  if (s < 300) return { bg: '#1a3a2a', color: '#4ade80' }
  if (s < 400) return { bg: '#3a2a0a', color: '#fbbf24' }
  return { bg: '#3a0a0a', color: '#f87171' }
}

function sizeOf(data) {
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  const bytes = new Blob([str]).size
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
}

export default function ResponsePanel({ response, loading }) {
  const [tab, setTab] = useState('pretty')

  const tabBtn = (t) => ({
    padding: '6px 12px', background: 'none', border: 'none',
    borderBottom: tab === t ? '2px solid #60a5fa' : '2px solid transparent',
    color: tab === t ? '#60a5fa' : '#888',
    cursor: 'pointer', fontSize: 12,
    fontWeight: tab === t ? 500 : 400,
    textTransform: 'capitalize'
  })

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: 24, color: '#666' }}>
      <div style={{
        width: 16, height: 16, border: '2px solid #333',
        borderTopColor: '#60a5fa', borderRadius: '50%',
        animation: 'spin 0.6s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Sending request…
    </div>
  )

  if (!response) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: 10, color: '#555'
    }}>
      <div style={{ fontSize: 40 }}>⬆</div>
      <div style={{ fontSize: 13 }}>Send a request to see the response</div>
      <div style={{ fontSize: 11, color: '#444' }}>Try: https://jsonplaceholder.typicode.com/posts/1</div>
    </div>
  )

  if (response.error) return (
    <div style={{ flex: 1, padding: 20 }}>
      <div style={{ color: '#f87171', fontFamily: 'monospace', fontSize: 13, marginBottom: 8 }}>
        Error: {response.error}
      </div>
      <div style={{ color: '#555', fontSize: 11 }}>
        CORS may block requests from the browser. Use a public CORS-enabled API like jsonplaceholder.typicode.com or httpbin.org
      </div>
    </div>
  )

  const sc = statusStyle(response.status)
  const prettyHtml = syntaxHighlight(response.data)
  const rawStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#1e1e1e' }}>
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', background: '#252526', borderBottom: '1px solid #333'
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['pretty', 'raw', 'headers'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabBtn(t)}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{
            padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
            background: sc.bg, color: sc.color
          }}>
            {response.status} {response.statusText}
          </span>
          <span style={{ fontSize: 11, color: '#666' }}>{response.time}ms</span>
          <span style={{ fontSize: 11, color: '#666' }}>{sizeOf(response.data)}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
        {tab === 'pretty' && (
          <pre style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#d4d4d4' }}
            dangerouslySetInnerHTML={{ __html: prettyHtml }} />
        )}
        {tab === 'raw' && (
          <pre style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#d4d4d4' }}>
            {rawStr}
          </pre>
        )}
        {tab === 'headers' && (
          <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 2 }}>
            {Object.entries(response.headers || {}).map(([k, v]) => (
              <div key={k}>
                <span style={{ color: '#9cdcfe' }}>{k}</span>
                <span style={{ color: '#666' }}>: </span>
                <span style={{ color: '#ce9178' }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

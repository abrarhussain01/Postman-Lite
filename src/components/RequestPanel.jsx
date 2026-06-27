import { useState, useEffect } from 'react'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

const METHOD_COLORS = {
  GET: '#4ade80', POST: '#fbbf24', PUT: '#60a5fa',
  DELETE: '#f87171', PATCH: '#c084fc', HEAD: '#67e8f9', OPTIONS: '#f9a8d4'
}

function KVTable({ rows, onChange }) {
  const add = () => onChange([...rows, { key: '', value: '', enabled: true }])
  const update = (i, field, val) => {
    const r = [...rows]
    r[i] = { ...r[i], [field]: val }
    onChange(r)
  }
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i))

  const inputStyle = {
    width: '100%', padding: '5px 8px',
    background: '#3c3c3c', border: '1px solid #444',
    borderRadius: 4, color: '#d4d4d4',
    fontFamily: 'monospace', fontSize: 12
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['', 'Key', 'Value', ''].map((h, i) => (
              <th key={i} style={{ textAlign: 'left', fontSize: 10, color: '#666', padding: '4px 6px', borderBottom: '1px solid #333', fontWeight: 500 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ width: 20, padding: '4px 6px' }}>
                <input type="checkbox" checked={row.enabled}
                  onChange={e => update(i, 'enabled', e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: '#60a5fa' }} />
              </td>
              <td style={{ padding: '3px 4px' }}>
                <input value={row.key} onChange={e => update(i, 'key', e.target.value)}
                  placeholder="Key" style={inputStyle} />
              </td>
              <td style={{ padding: '3px 4px' }}>
                <input value={row.value} onChange={e => update(i, 'value', e.target.value)}
                  placeholder="Value" style={inputStyle} />
              </td>
              <td style={{ padding: '3px 4px', width: 28 }}>
                <button onClick={() => remove(i)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#666', fontSize: 16, lineHeight: 1,
                  width: 24, height: 24, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} style={{
        marginTop: 8, background: 'none', border: 'none',
        cursor: 'pointer', color: '#60a5fa', fontSize: 12, padding: '4px 0'
      }}>
        + Add row
      </button>
    </div>
  )
}

export default function RequestPanel({ onSend, loadRequest }) {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [tab, setTab] = useState('params')
  const [params, setParams] = useState([{ key: '', value: '', enabled: true }])
  const [headers, setHeaders] = useState([{ key: 'Accept', value: 'application/json', enabled: true }])
  const [body, setBody] = useState('')

  useEffect(() => {
    if (loadRequest) {
      setMethod(loadRequest.method)
      setUrl(loadRequest.url)
    }
  }, [loadRequest])

  const toObj = (rows) =>
    rows.filter(r => r.enabled && r.key.trim())
      .reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {})

  const handleSend = () => onSend({ method, url, params: toObj(params), headers: toObj(headers), body })

  const tabs = ['params', 'headers', 'body']

  const tabBtn = (t) => ({
    padding: '8px 14px', background: 'none', border: 'none',
    borderBottom: tab === t ? '2px solid #60a5fa' : '2px solid transparent',
    color: tab === t ? '#60a5fa' : '#888',
    cursor: 'pointer', fontSize: 13,
    fontWeight: tab === t ? 500 : 400,
    textTransform: 'capitalize',
    transition: 'color 0.1s'
  })

  return (
    <div style={{ background: '#252526', borderBottom: '1px solid #333', flexShrink: 0 }}>
      {/* URL bar */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 12px', alignItems: 'center' }}>
        <select value={method} onChange={e => setMethod(e.target.value)} style={{
          height: 34, padding: '0 8px',
          background: '#2d2d2d', border: '1px solid #444',
          borderRadius: 4, color: METHOD_COLORS[method],
          fontWeight: 600, fontSize: 13, cursor: 'pointer', minWidth: 100
        }}>
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <input value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Enter request URL"
          style={{
            flex: 1, height: 34, padding: '0 10px',
            background: '#3c3c3c', border: '1px solid #444',
            borderRadius: 4, color: '#d4d4d4',
            fontFamily: 'monospace', fontSize: 13
          }} />

        <button onClick={handleSend} style={{
          height: 34, padding: '0 20px',
          background: '#0e639c', color: '#fff',
          border: 'none', borderRadius: 4,
          fontWeight: 500, cursor: 'pointer', fontSize: 13,
          transition: 'background 0.1s', whiteSpace: 'nowrap'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1177bb'}
          onMouseLeave={e => e.currentTarget.style.background = '#0e639c'}
        >
          Send
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', paddingLeft: 12, borderBottom: '1px solid #333' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabBtn(t)}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: 12, maxHeight: 130, overflowY: 'auto', background: '#1e1e1e' }}>
        {tab === 'params' && <KVTable rows={params} onChange={setParams} />}
        {tab === 'headers' && <KVTable rows={headers} onChange={setHeaders} />}
        {tab === 'body' && (
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
            style={{
              width: '100%', height: 140, padding: 10,
              background: '#3c3c3c', border: '1px solid #444',
              borderRadius: 4, color: '#d4d4d4',
              fontFamily: 'monospace', fontSize: 12,
              resize: 'vertical', lineHeight: 1.6
            }} />
        )}
      </div>
    </div>
  )
}

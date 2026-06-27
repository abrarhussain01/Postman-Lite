import { useState } from 'react'
import Sidebar from './components/Sidebar'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'

export default function App() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [loadRequest, setLoadRequest] = useState(null)

  const sendRequest = async ({ method, url, params, headers, body }) => {
    if (!url.trim()) return

    let finalUrl = url
    if (Object.keys(params).length) {
      const q = new URLSearchParams(params).toString()
      finalUrl = url.includes('?') ? url + '&' + q : url + '?' + q
    }

    setLoading(true)
    setResponse(null)
    const t0 = Date.now()

    try {
      const opts = { method, headers }
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        opts.body = body
        if (!headers['Content-Type']) opts.headers['Content-Type'] = 'application/json'
      }

      const res = await fetch(finalUrl, opts)
      const elapsed = Date.now() - t0
      const ct = res.headers.get('content-type') || ''
      const resHeaders = {}
      res.headers.forEach((v, k) => { resHeaders[k] = v })
      const data = ct.includes('json') ? await res.json() : await res.text()

      setResponse({ data, status: res.status, statusText: res.statusText, time: elapsed, headers: resHeaders })
      setHistory(h => [{ method, url, status: res.status }, ...h].slice(0, 30))
    } catch (err) {
      setResponse({ error: err.message, time: Date.now() - t0 })
      setHistory(h => [{ method, url, status: 'ERR' }, ...h].slice(0, 30))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar history={history} onSelect={setLoadRequest} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
  <div style={{ flexShrink: 0 }}>
    <RequestPanel onSend={sendRequest} loadRequest={loadRequest} />
  </div>
  <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
    <ResponsePanel response={response} loading={loading} />
  </div>
</div>
    </div>
  )
}

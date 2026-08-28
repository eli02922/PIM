import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Archive, Bell, ChevronDown, CircleHelp, Filter, LayoutGrid, ListFilter,
  MoreHorizontal, PackageOpen, Plus, Search, Settings2, SlidersHorizontal,
  Sparkles, Upload, UserRound, X
} from 'lucide-react'
import './styles.css'
import { productApi } from './api/client.js'

const fallbackProducts = [
  { name: 'Aero Runner Mesh', sku: 'NR-2084', category: 'Footwear', status: 'Published', updated: 'Today, 09:42', channels: ['Web', 'App', 'Retail'], tone: 'blue' },
  { name: 'Field Utility Overshirt', sku: 'NR-1940', category: 'Apparel', status: 'In review', updated: 'Today, 08:16', channels: ['Web', 'App'], tone: 'olive' },
  { name: 'Transit Pack 24L', sku: 'NR-1837', category: 'Accessories', status: 'Published', updated: 'Yesterday', channels: ['Web', 'Retail'], tone: 'orange' },
  { name: 'Cloudweight Hoodie', sku: 'NR-2211', category: 'Apparel', status: 'Draft', updated: 'Yesterday', channels: ['Web'], tone: 'plum' },
  { name: 'Meridian Trail Shell', sku: 'NR-1762', category: 'Outerwear', status: 'Published', updated: 'Aug 24, 2026', channels: ['Web', 'App', 'Retail'], tone: 'teal' },
  { name: 'Daily Carry Sling', sku: 'NR-2048', category: 'Accessories', status: 'Needs attention', updated: 'Aug 23, 2026', channels: ['Web'], tone: 'yellow' },
]

const navItems = [
  { label: 'Catalog', icon: PackageOpen, active: true },
  { label: 'Collections', icon: LayoutGrid },
  { label: 'Channels', icon: Upload },
  { label: 'Archive', icon: Archive },
]

function StatusPill({ status }) {
  return <span className={`status status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
}

function App() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All products')
  const [selected, setSelected] = useState([])
  const [view, setView] = useState('table')
  const [showFilters, setShowFilters] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    productApi.list({ pageSize: 100 })
      .then((result) => setProducts(result.items))
      .catch(() => notify('API unavailable - showing local catalog'))
      .finally(() => setLoading(false))
  }, [])

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'All products' || product.status === statusFilter
    return matchesQuery && matchesStatus
  }), [query, statusFilter])

  const toggleProduct = (sku) => setSelected((current) => current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku])
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const publishSelected = async () => {
    try {
      const result = await productApi.publish(selected)
      setProducts((current) => current.map((product) => result.published.find((item) => item.sku === product.sku) || product))
      notify(`${result.published.length} products published`)
      setSelected([])
    } catch { notify('Unable to publish selected products') }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>northstar</span></div>
        <div className="workspace-switcher"><div><span className="eyebrow">Workspace</span><strong>Northstar Goods</strong></div><ChevronDown size={16} /></div>
        <nav className="primary-nav">
          <span className="nav-label">Manage</span>
          {navItems.map(({ label, icon: Icon, active }) => <button className={`nav-item ${active ? 'active' : ''}`} key={label}><Icon size={18} /><span>{label}</span>{label === 'Catalog' && <span className="nav-count">2,481</span>}</button>)}
          <span className="nav-label nav-label-spaced">Configure</span>
          <button className="nav-item"><Settings2 size={18} /><span>Attributes</span></button>
          <button className="nav-item"><SlidersHorizontal size={18} /><span>Workflows</span></button>
        </nav>
        <div className="sidebar-bottom"><button className="help-link"><CircleHelp size={17} /> Help center</button><div className="user-card"><div className="avatar">JS</div><div><strong>Jordan Smith</strong><span>Admin</span></div><MoreHorizontal size={17} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Catalog</strong></div><div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><button className="avatar avatar-small">JS</button></div></header>
        <section className="content-wrap">
          <div className="page-heading"><div><div className="kicker"><Sparkles size={14} /> Catalog operations</div><h1>Product catalog</h1><p>Keep every product accurate, complete, and ready to publish.</p></div><button className="primary-button" onClick={() => notify('New product draft created')}><Plus size={17} /> Add product</button></div>
          <div className="metric-row"><div className="metric-card"><span>Total products</span><strong>2,481</strong><small className="positive">+8.2% <em>vs last month</em></small></div><div className="metric-card"><span>Published</span><strong>1,936</strong><small className="positive">+4.6% <em>vs last month</em></small></div><div className="metric-card"><span>Needs attention</span><strong>42</strong><small className="warning">12 <em>updated today</em></small></div><div className="metric-card coverage-card"><span>Channel coverage</span><div className="coverage"><strong>78%</strong><div className="progress"><i /></div></div><small>Across 3 channels</small></div></div>
          <div className="section-header"><div><h2>All products <span>2,481</span></h2><p>Manage product data and publishing status</p></div><div className="view-toggle"><button className={view === 'table' ? 'selected' : ''} onClick={() => setView('table')} aria-label="Table view"><ListFilter size={17} /></button><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view"><LayoutGrid size={17} /></button></div></div>
          <div className="toolbar"><div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name or SKU" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</div><div className="toolbar-right"><button className={`filter-button ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter size={16} /> Filters {showFilters && <span className="filter-count">1</span>}</button><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All products</option><option>Published</option><option>In review</option><option>Draft</option><option>Needs attention</option></select></div></div>
          {showFilters && <div className="filter-panel"><span>Filter by status</span>{['Published', 'In review', 'Draft', 'Needs attention'].map((filter) => <button key={filter} className={statusFilter === filter ? 'chosen' : ''} onClick={() => setStatusFilter(statusFilter === filter ? 'All products' : filter)}><span className="filter-dot" />{filter}</button>)}</div>}
          {selected.length > 0 && <div className="bulk-bar"><span>{selected.length} selected</span><button onClick={publishSelected}><Upload size={15} /> Publish</button><button onClick={() => setSelected([])}>Clear</button></div>}
          {loading ? <div className="empty-state"><strong>Loading catalog...</strong></div> : view === 'table' ? <div className="table-wrap"><table><thead><tr><th className="check-col"><input type="checkbox" checked={selected.length === visibleProducts.length && visibleProducts.length > 0} onChange={() => setSelected(selected.length === visibleProducts.length ? [] : visibleProducts.map((item) => item.sku))} /></th><th>Product</th><th>Category</th><th>Status</th><th>Channels</th><th>Last updated</th><th /></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.sku}><td><input type="checkbox" checked={selected.includes(product.sku)} onChange={() => toggleProduct(product.sku)} /></td><td><div className="product-cell"><div className={`product-thumb thumb-${product.tone}`}><PackageOpen size={20} /></div><div><strong>{product.name}</strong><span>{product.sku}</span></div></div></td><td>{product.category}</td><td><StatusPill status={product.status} /></td><td><div className="channel-list">{product.channels.map((channel) => <span key={channel}>{channel}</span>)}</div></td><td className="updated">{product.updated}</td><td><button className="more-button" aria-label={`More actions for ${product.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{visibleProducts.length === 0 && <div className="empty-state"><Search size={23} /><strong>No products found</strong><span>Try another name, SKU, or status.</span></div>}</div> : <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.sku}><div className={`product-hero thumb-${product.tone}`}><PackageOpen size={34} /></div><div className="product-card-body"><div className="card-title"><strong>{product.name}</strong><MoreHorizontal size={18} /></div><span className="sku">{product.sku} · {product.category}</span><StatusPill status={product.status} /><div className="card-footer"><span>{product.updated}</span><span>{product.channels.length} channels</span></div></div></article>)}</div>}
          <footer className="table-footer"><span>Showing {visibleProducts.length} of 2,481 products</span><div><button disabled>Previous</button><button className="page-active">1</button><button>2</button><button>3</button><span>...</span><button>207</button><button>Next</button></div></footer>
        </section>
      </main>
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)

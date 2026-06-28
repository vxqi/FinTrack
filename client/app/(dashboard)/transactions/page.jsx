'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Download, Plus, ArrowUpDown } from 'lucide-react'
import { transactionsApi } from '@/lib/api'
import { useLocale } from '@/context/LocaleContext'
import { exportTransactionsToCSV } from '@/lib/exportCsv'
import TransactionListRow from '@/components/transactions/TransactionListRow'
import LogExpenseModal from '@/components/transactions/LogExpenseModal'
import styles from './transactions.module.css'

const CATEGORY_EMOJI = {
  'Food & Dining': '🍴', 'Transport': '🚗', 'Bills & Utilities': '⚡',
  'Entertainment': '🎉', 'Education': '📚', 'Health': '🏥',
  'Shopping': '🛍', 'Salary': '💼', 'Other': '💰',
}

const PERIODS = ['All', 'This month', 'Last month']
const TYPES = ['All', 'Income', 'Expense']

function formatDateHeader(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a, b) => a.toDateString() === b.toDateString()

  if (isSameDay(date, today)) return `Today — ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
  if (isSameDay(date, yesterday)) return `Yesterday — ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function TransactionsPage() {
  const { date } = useLocale()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('All')
  const [type, setType] = useState('All')
  const [sortDesc, setSortDesc] = useState(true)
  const [visibleCount, setVisibleCount] = useState(15)

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const params = {}
      if (period === 'This month') {
        const now = new Date()
        params.month = now.getMonth() + 1
        params.year = now.getFullYear()
      } else if (period === 'Last month') {
        const d = new Date(); d.setMonth(d.getMonth() - 1)
        params.month = d.getMonth() + 1
        params.year = d.getFullYear()
      }
      if (type !== 'All') params.type = type.toLowerCase()

      const { data } = await transactionsApi.list(params)
      setTransactions(data)
    } catch {
      setError('Could not load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTransactions() }, [period, type])

  useEffect(() => {
    window.addEventListener('fintrack:transaction-logged', loadTransactions)
    return () => window.removeEventListener('fintrack:transaction-logged', loadTransactions)
  }, [period, type])

  const handleDelete = async (id) => {
    try {
      await transactionsApi.remove(id)
      setTransactions(prev => prev.filter(t => t._id !== id))
    } catch {
      setError('Could not delete transaction.')
    }
  }

  const handleCreate = async (payload) => {
    const { data } = await transactionsApi.create(payload)
    setTransactions(prev => [data, ...prev])
  }

  // Filter by search, then sort
  const filtered = useMemo(() => {
    let list = transactions
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        (t.merchant || '').toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) =>
      sortDesc ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
    )
  }, [transactions, search, sortDesc])

  const handleExport = () => {
    setExporting(true)
    try {
      exportTransactionsToCSV(filtered, date, 'fintrack-transactions.csv')
    } finally {
      setExporting(false)
    }
  }

  const visible = filtered.slice(0, visibleCount)

  // Group by date
  const grouped = useMemo(() => {
    const groups = {}
    visible.forEach(t => {
      const key = new Date(t.date).toDateString()
      if (!groups[key]) groups[key] = []
      groups[key].push(t)
    })
    return Object.entries(groups)
  }, [visible])

  return (
    <div className="fade-up">
      {/* Top bar */}
      <div className={styles.topRow}>
        <h1 className={styles.pageTitle}>All Transactions</h1>
        <div className={styles.actions}>
          <button className={styles.ghostBtn} onClick={handleExport} disabled={exporting || filtered.length === 0}>
            <Download size={14} /> {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
            <Plus size={14} /> Log expense
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button className={styles.sortBtn} onClick={() => setSortDesc(v => !v)}>
          <ArrowUpDown size={13} /> Sort
        </button>

        <div className={styles.pillGroup}>
          {PERIODS.map(p => (
            <button key={p} className={`${styles.pill} ${period === p ? styles.pillActive : ''}`} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>

        <div className={styles.pillGroup}>
          {TYPES.map(t => (
            <button key={t} className={`${styles.pill} ${type === t ? styles.pillActive : ''}`} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className={styles.card}>
        {loading ? (
          <p className={styles.loadingText}>Loading transactions…</p>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : grouped.length === 0 ? (
          <p className={styles.emptyText}>No transactions found.</p>
        ) : (
          grouped.map(([dateKey, txns]) => (
            <div key={dateKey}>
              <div className={styles.dateHeader}>{formatDateHeader(dateKey)}</div>
              {txns.map(t => (
                <TransactionListRow
                  key={t._id}
                  transaction={t}
                  emoji={CATEGORY_EMOJI[t.category] || '💰'}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {visibleCount < filtered.length && (
        <div className={styles.loadMoreRow}>
          <button className={styles.loadMoreBtn} onClick={() => setVisibleCount(c => c + 15)}>
            Load more transactions ↓
          </button>
        </div>
      )}

      {showModal && (
        <LogExpenseModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}
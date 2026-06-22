'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import styles from './LogExpenseModal.module.css'

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Bills & Utilities', 'Entertainment',
  'Education', 'Health', 'Shopping', 'Salary', 'Other',
]

export default function LogExpenseModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    type: 'expense', amount: '', category: 'Food & Dining', merchant: '', note: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    setLoading(true)
    try {
      await onCreate({
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        merchant: form.merchant.trim(),
        note: form.note.trim(),
      })
      onClose()
    } catch {
      setError('Could not log this transaction. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Log a transaction</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          {/* Type toggle */}
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={`${styles.typeBtn} ${form.type === 'expense' ? styles.typeActive : ''}`}
              onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
            >
              Expense
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${form.type === 'income' ? styles.typeActiveIncome : ''}`}
              onClick={() => setForm(f => ({ ...f, type: 'income' }))}
            >
              Income
            </button>
          </div>

          <label className={styles.label} htmlFor="amount">Amount (NPR)</label>
          <input
            id="amount" type="number" min="1" placeholder="e.g. 500"
            value={form.amount} onChange={handleChange('amount')}
            className={styles.input} autoFocus
          />

          <label className={styles.label} htmlFor="category">Category</label>
          <select
            id="category" value={form.category} onChange={handleChange('category')}
            className={styles.select}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className={styles.label} htmlFor="merchant">Merchant / source (optional)</label>
          <input
            id="merchant" type="text" placeholder="e.g. Himalayan Java"
            value={form.merchant} onChange={handleChange('merchant')}
            className={styles.input}
          />

          <div className={styles.buttonRow}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Log transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
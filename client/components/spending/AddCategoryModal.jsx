'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import styles from './AddCategoryModal.module.css'

// Visually matches the goal modals (overlay, card, form rows) — same
// pattern, just a local copy of the stylesheet so this component doesn't
// reach across folders into components/goals/.

const SUGGESTED_CATEGORIES = [
  'Food & Dining', 'Transport', 'Bills & Utilities', 'Entertainment',
  'Education', 'Health', 'Shopping', 'Other',
]

export default function AddCategoryModal({ existingCategories = [], onClose, onCreate }) {
  const [form, setForm] = useState({ category: '', limit: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const availableSuggestions = SUGGESTED_CATEGORIES.filter(
    c => !existingCategories.includes(c)
  )

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category.trim()) {
      setError('Category name is required.')
      return
    }
    if (existingCategories.includes(form.category.trim())) {
      setError('You already have a budget for this category.')
      return
    }
    if (!form.limit || Number(form.limit) <= 0) {
      setError('Monthly limit must be greater than zero.')
      return
    }

    setLoading(true)
    try {
      const now = new Date()
      await onCreate({
        category: form.category.trim(),
        limit: Number(form.limit),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not add this category. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add a budget category</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <label className={styles.label} htmlFor="category">Category name</label>
          <input
            id="category"
            type="text"
            placeholder="e.g. Subscriptions"
            value={form.category}
            onChange={handleChange('category')}
            className={styles.input}
            autoFocus
            list="category-suggestions"
          />
          <datalist id="category-suggestions">
            {availableSuggestions.map(c => <option key={c} value={c} />)}
          </datalist>

          <label className={styles.label} htmlFor="limit">Monthly limit (NPR)</label>
          <input
            id="limit"
            type="number"
            min="1"
            placeholder="e.g. 5000"
            value={form.limit}
            onChange={handleChange('limit')}
            className={styles.input}
          />

          <div className={styles.buttonRow}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Add category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import styles from './GoalModal.module.css'

export default function AddFundsModal({ goal, onClose, onConfirm }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    setLoading(true)
    try {
      await onConfirm(goal._id, num)
      onClose()
    } catch {
      setError('Could not add funds. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add funds to &quot;{goal.name}&quot;</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <label className={styles.label} htmlFor="amount">Amount (NPR)</label>
          <input
            id="amount"
            type="number"
            min="1"
            placeholder="e.g. 1000"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError('') }}
            className={styles.input}
            autoFocus
          />

          <div className={styles.buttonRow}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Add funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
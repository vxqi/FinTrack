'use client'

import { X } from 'lucide-react'
import styles from './BudgetAlertModal.module.css'

export default function BudgetAlertModal({
  category, amount, currentSpend, limit, onCancel, onConfirm, loading,
}) {
  const resultingSpend = currentSpend + amount
  const resultingPct = Math.round((resultingSpend / limit) * 100)
  const isOverLimit = resultingPct >= 100

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚠️ Budget Alert</h2>
          <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className={styles.body}>
          This transaction of <strong>NPR {amount.toLocaleString('en-US')}</strong> will push your{' '}
          <strong>{category}</strong> category to <strong>{resultingPct}%</strong> of its limit.
        </p>

        {/* Summary card */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Current spend</span>
            <span className={styles.summaryValue}>NPR {currentSpend.toLocaleString('en-US')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Category limit</span>
            <span className={styles.summaryValue}>NPR {limit.toLocaleString('en-US')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>After this transaction</span>
            <span className={`${styles.summaryValue} ${styles.summaryHighlight}`}>
              NPR {resultingSpend.toLocaleString('en-US')} ({resultingPct}%)
            </span>
          </div>
        </div>

        <span className={`${styles.statusPill} ${isOverLimit ? styles.pillDanger : styles.pillWarning}`}>
          {isOverLimit ? 'Over budget' : 'Near limit'}
        </span>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.btnGhost} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.btnDanger} onClick={onConfirm} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Log anyway'}
          </button>
        </div>
      </div>
    </div>
  )
}
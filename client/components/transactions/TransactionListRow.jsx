'use client'

import { Trash2 } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import styles from './TransactionListRow.module.css'

export default function TransactionListRow({ transaction, emoji, onDelete }) {
  const { money } = useLocale()
  const { merchant, category, amount, type, date } = transaction
  const time = new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const isIncome = type === 'income'

  return (
    <div className={styles.row}>
      <div className={styles.iconWrap}>{emoji}</div>

      <div className={styles.middle}>
        <span className={styles.name}>{merchant || category}</span>
        <span className={styles.categoryTag}>{category}</span>
      </div>

      <span className={styles.time}>{time}</span>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(transaction._id)}
        aria-label="Delete transaction"
      >
        <Trash2 size={14} />
      </button>

      <span className={`${styles.amount} ${isIncome ? styles.income : ''}`}>
        {isIncome ? '+' : '-'}{money(amount)}
      </span>
    </div>
  )
}
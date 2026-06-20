import styles from './TransactionRow.module.css'

export default function TransactionRow({ emoji, name, category, amount, isIncome = false }) {
  return (
    <div className={styles.row}>
      <div className={styles.iconWrap}>{emoji}</div>
      <div className={styles.middle}>
        <span className={styles.name}>{name}</span>
        <span className={styles.category}>{category}</span>
      </div>
      <span className={`${styles.amount} ${isIncome ? styles.income : ''}`}>
        {isIncome ? '+' : '-'}NPR {amount.toLocaleString('en-US')}
      </span>
    </div>
  )
}
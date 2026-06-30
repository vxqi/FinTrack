import styles from './EmptyState.module.css'

/**
 * Consistent empty-state pattern: icon/emoji + message + optional action button.
 * Used wherever a list/grid has no data yet (no transactions, no goals, no results).
 */
export default function EmptyState({ icon = '📭', title, body, actionLabel, onAction }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>{icon}</span>
      {title && <span className={styles.title}>{title}</span>}
      {body && <p className={styles.body}>{body}</p>}
      {actionLabel && onAction && (
        <button className={styles.actionBtn} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
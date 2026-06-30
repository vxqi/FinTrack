import { AlertCircle } from 'lucide-react'
import styles from './ErrorState.module.css'

/**
 * Consistent error-state pattern with an optional retry action.
 * Used wherever a data fetch fails.
 */
export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className={styles.wrap}>
      <AlertCircle size={28} className={styles.icon} />
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
import { Lock } from 'lucide-react'
import styles from './TipCard.module.css'

export default function TipCard({ tag, title, body, readTime, locked, unlockHint, onRead }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.content} ${locked ? styles.blurred : ''}`}>
        <span className={styles.tag}>{tag}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{body}</p>
        <div className={styles.footer}>
          <span className={styles.readTime}>{readTime}</span>
          <button className={styles.readBtn} onClick={onRead} disabled={locked}>
            Read more →
          </button>
        </div>
      </div>

      {locked && (
        <div className={styles.overlay}>
          <Lock size={20} className={styles.lockIcon} />
          <span className={styles.lockText}>{unlockHint}</span>
          <button className={styles.unlockLink}>How to unlock</button>
        </div>
      )}
    </div>
  )
}
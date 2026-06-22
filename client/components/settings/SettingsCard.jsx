import styles from './SettingsCard.module.css'

export default function SettingsCard({ title, children }) {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  )
}
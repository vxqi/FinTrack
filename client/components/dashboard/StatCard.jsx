import styles from './StatCard.module.css'

export default function StatCard({
  label,
  value,
  subLabel,
  trend,          // { direction: 'up' | 'down', text: '8% vs last month' }
  progress,       // 0-100, optional
  progressColor,  // css var string, optional
  dark = false,
}) {
  return (
    <div className={`${styles.card} ${dark ? styles.dark : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>

      {trend && (
        <span className={`${styles.trend} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.text}
        </span>
      )}

      {!trend && subLabel && (
        <span className={styles.subLabel}>{subLabel}</span>
      )}

      {typeof progress === 'number' && (
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min(progress, 100)}%`, background: progressColor || 'var(--accent)' }}
          />
        </div>
      )}
    </div>
  )
}
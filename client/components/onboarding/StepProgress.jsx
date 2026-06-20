import styles from './StepProgress.module.css'

export default function StepProgress({ step, total = 3 }) {
  return (
    <div className={styles.wrap}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`${styles.bar} ${i < step ? styles.filled : ''}`}
        />
      ))}
    </div>
  )
}
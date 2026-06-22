import styles from './Toggle.module.css'

export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`${styles.toggle} ${checked ? styles.on : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  )
}
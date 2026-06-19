'use client'

import { useState } from 'react'
import Link from 'next/link'
import { KeyRound, Mail, ArrowLeft } from 'lucide-react'
import styles from './forgot.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)

  const validate = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return false
    }
    return true
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate API call — wire to POST /api/auth/forgot-password when backend is ready
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  const handleResend = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
  }

  return (
    <div className={styles.card}>
      {!sent ? (
        <>
          {/* Icon */}
          <div className={styles.iconCircle}>
            <KeyRound size={22} strokeWidth={1.8} />
          </div>

          <h1 className={styles.title}>Reset your password</h1>
          <p className={styles.body}>
            Enter your registered email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Email address</label>
              <input
                id="email" type="email" autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
              />
              {error && <span className={styles.fieldError}>{error}</span>}
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : (
                <><Mail size={15} /> Send reset link</>
              )}
            </button>
          </form>

          <div className={styles.backRow}>
            <Link href="/login" className={styles.backLink}>
              <ArrowLeft size={13} /> Back to login
            </Link>
          </div>
        </>
      ) : (
        /* ── Success state ── */
        <div className={styles.successState}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>Check your inbox</h2>
          <p className={styles.body}>
            A reset link has been sent to <strong>{email}</strong>.
            It may take a minute to arrive.
          </p>
          <button
            className={styles.btnGhost}
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? <span className={styles.spinnerDark} /> : "Didn't get it? Resend email"}
          </button>

          <div className={styles.backRow}>
            <Link href="/login" className={styles.backLink}>
              <ArrowLeft size={13} /> Back to login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
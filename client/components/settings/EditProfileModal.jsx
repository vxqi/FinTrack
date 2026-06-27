'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import styles from './AccountModal.module.css'

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are both required.')
      return
    }

    setLoading(true)
    try {
      await onSave({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update profile. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit profile</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange('firstName')}
                className={styles.input}
                autoFocus
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange('lastName')}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className={styles.inputDisabled}
            />
            <span className={styles.hint}>Email can&apos;t be changed right now.</span>
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
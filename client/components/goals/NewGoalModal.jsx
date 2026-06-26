'use client'

import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import styles from './GoalModal.module.css'

// Formats a Date/ISO string into yyyy-mm-dd for the <input type="date"> value
function toDateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

/**
 * Used for both creating a new goal and editing an existing one.
 * Pass `goal` to switch into edit mode — form pre-fills, button text changes,
 * and a Delete option appears. Omit `goal` (or pass null) for create mode.
 */
export default function NewGoalModal({ goal = null, onClose, onCreate, onSave, onDelete }) {
  const isEditMode = Boolean(goal)

  const [form, setForm] = useState({
    name: goal?.name ?? '',
    targetAmount: goal?.targetAmount ?? '',
    deadline: toDateInputValue(goal?.deadline),
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Goal name is required.'); return }
    if (!form.targetAmount || Number(form.targetAmount) <= 0) {
      setError('Target amount must be greater than zero.')
      return
    }

    const payload = {
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      deadline: form.deadline || undefined,
    }

    setLoading(true)
    try {
      if (isEditMode) {
        await onSave(goal._id, payload)
      } else {
        await onCreate(payload)
      }
      onClose()
    } catch {
      setError(isEditMode ? 'Could not update goal. Please try again.' : 'Could not create goal. Please try again.')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(goal._id)
      onClose()
    } catch {
      setError('Could not delete goal. Please try again.')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditMode ? 'Edit goal' : 'Create new goal'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {!confirmDelete ? (
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <label className={styles.label} htmlFor="goalName">Goal name</label>
            <input
              id="goalName"
              type="text"
              placeholder="e.g. Trip to Pokhara"
              value={form.name}
              onChange={handleChange('name')}
              className={styles.input}
              autoFocus
            />

            <label className={styles.label} htmlFor="targetAmount">Target amount (NPR)</label>
            <input
              id="targetAmount"
              type="number"
              min="1"
              placeholder="e.g. 20000"
              value={form.targetAmount}
              onChange={handleChange('targetAmount')}
              className={styles.input}
            />

            <label className={styles.label} htmlFor="deadline">Target date (optional)</label>
            <input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange('deadline')}
              className={styles.input}
            />

            <div className={styles.buttonRow}>
              <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : (isEditMode ? 'Save changes' : 'Create goal')}
              </button>
            </div>

            {isEditMode && (
              <button
                type="button"
                className={styles.deleteLink}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={13} /> Delete this goal
              </button>
            )}
          </form>
        ) : (
          <div>
            {error && <div className={styles.errorBanner}>{error}</div>}
            <p className={styles.confirmText}>
              Are you sure you want to delete <strong>&quot;{goal.name}&quot;</strong>?
              This can&apos;t be undone.
            </p>
            <div className={styles.buttonRow}>
              <button type="button" className={styles.btnGhost} onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button type="button" className={styles.btnDanger} onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className={styles.spinner} /> : 'Delete goal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
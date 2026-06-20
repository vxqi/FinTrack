'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import StepProgress from '@/components/onboarding/StepProgress'
import styles from './income.module.css'

const EMPLOYMENT_TYPES = [
  { value: 'student',   label: 'Student' },
  { value: 'salaried',  label: 'Salaried' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'other',     label: 'Other' },
]

export default function OnboardingIncomePage() {
  const router = useRouter()
  const { updateUser } = useAuth()

  const [income, setIncome]       = useState('')
  const [employment, setEmployment] = useState('student')
  const [showOptional, setShowOptional] = useState(false)
  const [savingsPct, setSavingsPct] = useState('')
  const [error, setError]         = useState('')

  const formatNumber = (val) => {
    const digits = val.replace(/[^\d]/g, '')
    if (!digits) return ''
    return Number(digits).toLocaleString('en-US')
  }

  const handleIncomeChange = (e) => {
    setIncome(formatNumber(e.target.value))
    if (error) setError('')
  }

  const rawIncome = () => Number(income.replace(/,/g, '')) || 0

  const handleNext = () => {
    if (rawIncome() <= 0) {
      setError('Please enter your monthly income to continue.')
      return
    }
    updateUser({
      monthlyIncome: rawIncome(),
      employmentType: employment,
      savingsTargetPct: Number(savingsPct) || 0,
    })
    router.push('/onboarding/categories')
  }

  const handleSkip = () => {
    updateUser({ onboarded: true })
    router.push('/dashboard')
  }

  return (
    <div className={styles.card}>
      <StepProgress step={1} total={3} />
      <span className={styles.stepLabel}>Step 1 of 3 — Set your baseline</span>

      <h1 className={styles.title}>What&apos;s your monthly income?</h1>
      <p className={styles.body}>
        Only your income is required — everything else is optional.
      </p>

      {/* Income input */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="income">Monthly income (NPR)</label>
        <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
          <span className={styles.prefix}>NPR</span>
          <input
            id="income"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 50,000"
            value={income}
            onChange={handleIncomeChange}
            className={styles.input}
          />
        </div>
        {error && <span className={styles.fieldError}>{error}</span>}
      </div>

      {/* Employment type pills */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Employment type</label>
        <div className={styles.pillGroup}>
          {EMPLOYMENT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles.pill} ${employment === value ? styles.pillActive : ''}`}
              onClick={() => setEmployment(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional accordion */}
      <button
        type="button"
        className={styles.accordionToggle}
        onClick={() => setShowOptional(v => !v)}
      >
        <span>Optional: salary frequency, savings %</span>
        <ChevronDown
          size={16}
          className={styles.chevron}
          style={{ transform: showOptional ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <div className={`${styles.accordionBody} ${showOptional ? styles.accordionOpen : ''}`}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="savingsPct">
            What % of income would you like to save?
          </label>
          <div className={styles.inputWrap}>
            <input
              id="savingsPct"
              type="number"
              min="0" max="100"
              placeholder="e.g. 20"
              value={savingsPct}
              onChange={e => setSavingsPct(e.target.value)}
              className={styles.input}
            />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.buttonRow}>
        <button type="button" className={styles.skipLink} onClick={handleSkip}>
          Skip setup, explore first →
        </button>
        <button type="button" className={styles.btnPrimary} onClick={handleNext}>
          Next →
        </button>
      </div>
    </div>
  )
}
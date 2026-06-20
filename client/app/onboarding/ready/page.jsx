'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import StepProgress from '@/components/onboarding/StepProgress'
import styles from './ready.module.css'

const EMPLOYMENT_LABELS = {
  student: 'Student',
  salaried: 'Salaried',
  freelance: 'Freelance',
  other: 'Other',
}

export default function OnboardingReadyPage() {
  const router = useRouter()
  const { user, completeOnboarding } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const income          = user?.monthlyIncome ?? 0
  const employmentType  = user?.employmentType ?? 'student'
  const categoriesCount = user?.selectedCategories?.length ?? 0
  const dailyBudget     = income > 0 ? Math.round(income / 30) : 0

  const finishOnboarding = async () => {
    setLoading(true)
    setError('')
    try {
      await completeOnboarding({
        monthlyIncome: income,
        employmentType,
        selectedCategories: user?.selectedCategories ?? [],
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <StepProgress step={3} total={3} />

      <div className={styles.checkCircle}>
        <Check size={26} strokeWidth={2.5} />
      </div>

      <h1 className={styles.title}>
        You&apos;re all set{user?.firstName ? `, ${user.firstName}` : ''}!
      </h1>
      <p className={styles.body}>
        Based on your income, here&apos;s your starting financial snapshot:
      </p>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Summary card */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Monthly income</span>
          <span className={styles.summaryValue}>
            NPR {income > 0 ? income.toLocaleString('en-US') : '—'}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Employment type</span>
          <span className={styles.summaryValue}>{EMPLOYMENT_LABELS[employmentType]}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Categories tracked</span>
          <span className={styles.summaryValue}>{categoriesCount} selected</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Daily budget</span>
          <span className={`${styles.summaryValue} ${styles.summaryHighlight}`}>
            NPR {dailyBudget.toLocaleString('en-US')}
          </span>
        </div>
      </div>

      <button
        type="button"
        className={styles.btnPrimary}
        onClick={finishOnboarding}
        disabled={loading}
      >
        {loading ? <span className={styles.spinner} /> : 'Go to my dashboard →'}
      </button>

      <button
        type="button"
        className={styles.skipLink}
        onClick={finishOnboarding}
        disabled={loading}
      >
        Skip for now, I&apos;ll explore first
      </button>
    </div>
  )
}
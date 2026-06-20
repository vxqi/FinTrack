'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import MonthlyBarChart from '@/components/income-expense/MonthlyBarChart'
import SplitComparison from '@/components/income-expense/SplitComparison'
import styles from './income-expense.module.css'

const PERIODS = ['Last 5 months', 'This year']

const MONTHLY_DATA = [
  { month: 'Jan', income: 45000, expense: 30000 },
  { month: 'Feb', income: 45000, expense: 38000 },
  { month: 'Mar', income: 48000, expense: 41000 },
  { month: 'Apr', income: 50000, expense: 53000 }, // over income
  { month: 'May', income: 50000, expense: 32450 },
]

const TOTAL_INCOME   = 50000
const TOTAL_EXPENSES = 32450
const NET_BALANCE    = TOTAL_INCOME - TOTAL_EXPENSES
const SPENT_PCT      = Math.round((TOTAL_EXPENSES / TOTAL_INCOME) * 100)

function getHealthStatus(pct) {
  if (pct < 70) return { label: 'Healthy',    emoji: '🟢', color: 'var(--success)', bg: 'var(--success-light)' }
  if (pct < 90) return { label: 'Watch out',  emoji: '🟡', color: 'var(--warning)', bg: 'var(--warning-light)' }
  return            { label: 'Over limit',  emoji: '🔴', color: 'var(--danger)',  bg: 'var(--danger-light)' }
}

export default function IncomeExpensePage() {
  const [period, setPeriod] = useState('Last 5 months')
  const health = getHealthStatus(SPENT_PCT)
  const savingsPct = 100 - SPENT_PCT

  // mock actual split
  const actualSplit = { needs: 45, wants: 25, savings: savingsPct }

  return (
    <div className="fade-up">
      {/* Top row */}
      <div className={styles.topRow}>
        <div className={styles.pillGroup}>
          {PERIODS.map(p => (
            <button
              key={p}
              className={`${styles.pill} ${period === p ? styles.pillActive : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <button className={styles.ghostBtn}>
          <Plus size={14} /> Add income
        </button>
      </div>

      {/* Row 1 — 3 stat cards */}
      <div className={styles.statRow}>
        <StatCard label="Total income" value={`NPR ${TOTAL_INCOME.toLocaleString('en-US')}`} subLabel="This month" />
        <StatCard label="Total expenses" value={`NPR ${TOTAL_EXPENSES.toLocaleString('en-US')}`} subLabel="This month" />
        <div className={styles.netCard}>
          <span className={styles.netLabel}>Net balance</span>
          <span className={styles.netValue}>+NPR {NET_BALANCE.toLocaleString('en-US')}</span>
          <span className={styles.healthBadge} style={{ color: health.color, background: health.bg }}>
            {health.emoji} {health.label}
          </span>
        </div>
      </div>

      {/* Row 2 — 2 columns */}
      <div className={styles.row2}>
        {/* Left — bar chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Monthly comparison</h2>
          <MonthlyBarChart data={MONTHLY_DATA} />
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <span className={styles.smallLabel}>Net balance this month</span>
            <span className={styles.bigNumber}>+NPR {NET_BALANCE.toLocaleString('en-US')}</span>
            <span className={styles.savingsNote}>You&apos;re saving {savingsPct}% of income</span>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitleSm}>Your split vs 50/30/20 target</h3>
            <SplitComparison actual={actualSplit} />
          </div>

          {SPENT_PCT >= 60 && (
            <div className={styles.fixCard}>
              <span className={styles.fixTitle}>🔧 Fix it</span>
              <p className={styles.fixBody}>Cut Bills by NPR 2,000 to reach your target</p>
              <button className={styles.fixBtn}>Review Bills budget →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
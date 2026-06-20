'use client'

import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import DonutChart from '@/components/spending/DonutChart'
import CategoryRankCard from '@/components/spending/CategoryRankCard'
import styles from './spending.module.css'

const PERIODS = ['This month', 'Last month', '3 months']

const DONUT_DATA = [
  { name: 'Eating Out',  value: 8200,  pct: 45, color: '#4F46E5' },
  { name: 'Transport',   value: 4100,  pct: 23, color: '#16A34A' },
  { name: 'Bills',       value: 3200,  pct: 18, color: '#D97706' },
  { name: 'Shopping',    value: 2500,  pct: 14, color: '#DC2626' },
]
const DONUT_TOTAL = DONUT_DATA.reduce((sum, d) => sum + d.value, 0)

const RANKED_CATEGORIES = [
  {
    rank: 1, emoji: '🍴', name: 'Eating Out', spent: 8200, limit: 12000, changePct: 23, unusual: true,
    transactions: [
      { name: 'Himalayan Java', amount: 450 },
      { name: 'Bota Restro & Bar', amount: 1200 },
      { name: 'KFC Durbarmarg', amount: 890 },
    ],
  },
  {
    rank: 2, emoji: '🚗', name: 'Transport', spent: 4100, limit: 8000, changePct: -5,
    transactions: [
      { name: 'Sajha Yatayat', amount: 60 },
      { name: 'Pathao ride', amount: 320 },
    ],
  },
  {
    rank: 3, emoji: '⚡', name: 'Bills & Utilities', spent: 3200, limit: 12000, changePct: 4,
    transactions: [
      { name: 'NEA Electricity', amount: 1800 },
      { name: 'Worldlink Internet', amount: 1400 },
    ],
  },
  {
    rank: 4, emoji: '🛍', name: 'Shopping', spent: 2500, limit: 6000, changePct: -12,
    transactions: [
      { name: 'Bhatbhateni Supermarket', amount: 2500 },
    ],
  },
]

export default function SpendingPage() {
  const [period, setPeriod] = useState('This month')

  return (
    <div className="fade-up">
      {/* Top bar row */}
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
        <button className={styles.exportBtn}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className={styles.layout}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Spending overview</h2>
            <DonutChart data={DONUT_DATA} total={DONUT_TOTAL} />
          </div>

          <div className={styles.narrativeCard}>
            <span className={styles.narrativeLabel}>📖 Your money went to…</span>
            <p className={styles.narrativeText}>
              This week you spent mostly on <strong>Eating Out (45%)</strong>, with a spike on Friday.
            </p>
            <button className={styles.narrativeLink}>Read full weekly summary →</button>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <div className={styles.rightHeader}>
            <h2 className={styles.cardTitle}>Category ranking (highest → lowest)</h2>
            <button className={styles.addBtn}>
              <Plus size={14} /> Add category
            </button>
          </div>

          {RANKED_CATEGORIES.map(cat => (
            <CategoryRankCard key={cat.rank} {...cat} />
          ))}
        </div>
      </div>
    </div>
  )
}
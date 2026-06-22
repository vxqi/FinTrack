'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { transactionsApi } from '@/lib/api'
import LogExpenseModal from '@/components/transactions/LogExpenseModal'
import styles from './Topbar.module.css'

const pageTitles = {
  '/dashboard':      'Good morning',
  '/spending':       'Spending Breakdown',
  '/income-expense': 'Income vs Expense',
  '/savings':        'Savings Goals',
  '/tips':           'Tips & Financial Literacy',
  '/notifications':  'Notifications',
  '/settings':       'Settings',
  '/transactions':   'All Transactions',
}

export default function Topbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'FinTrack'
  const isDashboard = pathname === '/dashboard'
  const [showLogModal, setShowLogModal] = useState(false)

  const handleCreate = async (payload) => {
    await transactionsApi.create(payload)
    // Notify any listening page (e.g. Dashboard) to refresh its data
    window.dispatchEvent(new CustomEvent('fintrack:transaction-logged'))
  }

  return (
    <>
      <header className={styles.topbar}>
        <h1 className={styles.title}>
          {isDashboard ? (
            <>{title} <span className={styles.wave}>👋</span></>
          ) : title}
        </h1>

        <div className={styles.actions}>
          <Link href="/notifications" className={styles.iconBtn} aria-label="Notifications">
            <Bell size={18} />
            <span className={styles.badge}>2</span>
          </Link>

          <button className={styles.btnPrimary} onClick={() => setShowLogModal(true)}>
            + Log expense
          </button>
        </div>
      </header>

      {showLogModal && (
        <LogExpenseModal
          onClose={() => setShowLogModal(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  )
}
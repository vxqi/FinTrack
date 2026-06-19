'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import Link from 'next/link'
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

  return (
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

        {isDashboard && (
          <button className={styles.btnPrimary}>
            + Log expense
          </button>
        )}
      </div>
    </header>
  )
}
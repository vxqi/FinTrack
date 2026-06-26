'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationItem from '@/components/notifications/NotificationItem'
import styles from './notifications.module.css'

const TABS = ['All', 'Alerts', 'Summaries', 'Tips']

export default function NotificationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const { notifications, dismissedIds, loading, dismiss, markAllRead } = useNotifications()

  const visible = useMemo(() => {
    let list = notifications
      .filter(n => !dismissedIds.includes(n.id))
      .map(n => ({ ...n, read: dismissedIds.includes(n.id) }))
    if (activeTab !== 'All') list = list.filter(n => n.type === activeTab)
    return list
  }, [notifications, dismissedIds, activeTab])

  const counts = useMemo(() => {
    const active = notifications.filter(n => !dismissedIds.includes(n.id))
    return {
      All: active.length,
      Alerts: active.filter(n => n.type === 'Alerts').length,
      Summaries: active.filter(n => n.type === 'Summaries').length,
      Tips: active.filter(n => n.type === 'Tips').length,
    }
  }, [notifications, dismissedIds])

  const handleAction = (notification) => {
    if (notification.route) router.push(notification.route)
  }

  return (
    <div className="fade-up">
      {/* Top bar */}
      <div className={styles.topRow}>
        <h1 className={styles.pageTitle}>Notifications</h1>
        <div className={styles.actions}>
          <button className={styles.ghostBtn} onClick={markAllRead}>Mark all as read</button>
          <button className={styles.ghostBtn} onClick={() => router.push('/settings')}>
            Notification settings
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.tabGroup}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} {counts[tab] > 0 && `(${counts[tab]})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={styles.list}>
        {loading ? (
          <p className={styles.loadingText}>Loading notifications…</p>
        ) : visible.length === 0 ? (
          <p className={styles.emptyText}>You&apos;re all caught up! No notifications here.</p>
        ) : (
          visible.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              onDismiss={dismiss}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import { budgetsApi, goalsApi, transactionsApi } from '@/lib/api'
import { useLocale } from '@/context/LocaleContext'

const DISMISSED_KEY = 'fintrack_dismissed_notifications'

function getDismissed() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]') } catch { return [] }
}
function persistDismissed(ids) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids))
}

/**
 * Builds real notifications derived from live budgets, goals, and transactions.
 * Shared by the Notifications page (full list + dismiss/mark-read) and the
 * Topbar (just needs the unread count for the bell badge).
 */
export function useNotifications() {
  const { money } = useLocale()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [dismissedIds, setDismissedIds] = useState([])

  const load = useCallback(async () => {
    setDismissedIds(getDismissed())
    try {
      const now = new Date()
      const month = now.getMonth() + 1
      const year  = now.getFullYear()

      const [budgetRes, goalRes, txnRes] = await Promise.all([
        budgetsApi.withSpend({ month, year }),
        goalsApi.list(),
        transactionsApi.list({ month, year, type: 'expense' }),
      ])

      const built = []

      // Budget alerts — any category at 80%+
      budgetRes.data
        .filter(b => b.percentUsed >= 80)
        .forEach(b => {
          built.push({
            id: `budget-${b._id}`,
            type: 'Alerts',
            icon: '⚠️',
            title: `${b.category} at ${b.percentUsed}%`,
            body: b.percentUsed >= 100
              ? `You've gone over your ${b.category} budget this month.`
              : `You're close to your ${b.category} limit — ${b.percentUsed}% used so far.`,
            timestamp: 'This month',
            actionLabel: 'Review budget',
            route: '/spending',
          })
        })

      // Savings milestones — goals that crossed 25/50/75/100%
      goalRes.data.forEach(g => {
        const pct = Math.round((g.savedAmount / g.targetAmount) * 100)
        const milestone = [100, 75, 50, 25].find(m => pct >= m)
        if (milestone) {
          built.push({
            id: `goal-${g._id}`,
            type: 'Alerts',
            icon: '🎯',
            title: `${g.name} hit ${milestone}%!`,
            body: `You've saved ${money(g.savedAmount)} of your ${money(g.targetAmount)} goal.`,
            timestamp: 'Updated recently',
            actionLabel: 'View goal',
            route: '/savings',
          })
        }
      })

      // Weekly/monthly summary — total expense this month
      const totalSpent = txnRes.data.reduce((s, t) => s + t.amount, 0)
      if (totalSpent > 0) {
        built.push({
          id: 'summary-month',
          type: 'Summaries',
          icon: '📊',
          title: 'Your spending summary',
          body: `You've spent ${money(totalSpent)} so far this month.`,
          timestamp: 'This month',
          actionLabel: 'View report',
          route: '/spending',
        })
      }

      // Tips reminder
      built.push({
        id: 'tip-reminder',
        type: 'Tips',
        icon: '💡',
        title: 'New financial tips available',
        body: 'Keep logging expenses to unlock more personalised financial literacy content.',
        timestamp: 'Ongoing',
        actionLabel: 'Read tips',
        route: '/tips',
      })

      setNotifications(built)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [money])

  useEffect(() => { load() }, [load])

  const dismiss = (id) => {
    const updated = [...dismissedIds, id]
    setDismissedIds(updated)
    persistDismissed(updated)
  }

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id)
    setDismissedIds(allIds)
    persistDismissed(allIds)
  }

  const unread = notifications.filter(n => !dismissedIds.includes(n.id))

  return {
    notifications,   // full list (each item also carries `read` derived below)
    unread,          // notifications not yet dismissed
    unreadCount: unread.length,
    dismissedIds,
    loading,
    dismiss,
    markAllRead,
    reload: load,
  }
}
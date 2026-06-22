'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { goalsApi } from '@/lib/api'
import GoalCard from '@/components/goals/GoalCard'
import AddFundsModal from '@/components/goals/AddFundsModal'
import NewGoalModal from '@/components/goals/NewGoalModal'
import styles from './savings.module.css'

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [fundsModalGoal, setFundsModalGoal] = useState(null)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)

  const loadGoals = async () => {
    setLoading(true)
    try {
      const { data } = await goalsApi.list()
      setGoals(data)
    } catch {
      setError('Could not load savings goals.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGoals() }, [])

  const handleAddFunds = async (goalId, amount) => {
    const goal = goals.find(g => g._id === goalId)
    const newSaved = goal.savedAmount + amount
    const { data } = await goalsApi.update(goalId, { savedAmount: newSaved })
    setGoals(prev => prev.map(g => g._id === goalId ? data : g))
  }

  const handleCreateGoal = async (payload) => {
    const { data } = await goalsApi.create(payload)
    setGoals(prev => [data, ...prev])
  }

  const activeGoals    = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)
  const visibleGoals   = showCompleted ? completedGoals : activeGoals

  return (
    <div className="fade-up">
      {/* Top bar */}
      <div className={styles.topRow}>
        <h1 className={styles.pageTitle}>
          {showCompleted ? 'Completed goals' : 'Savings Goals'}
        </h1>
        <div className={styles.actions}>
          <button
            className={styles.ghostBtn}
            onClick={() => setShowCompleted(v => !v)}
          >
            {showCompleted ? '← Back to active' : 'View completed'}
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowNewGoalModal(true)}>
            <Plus size={14} /> New goal
          </button>
        </div>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading goals…</p>
      ) : error ? (
        <p className={styles.errorText}>{error}</p>
      ) : (
        <div className={styles.grid}>
          {visibleGoals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onAddFunds={(g) => setFundsModalGoal(g)}
              onEdit={() => {/* edit flow can be added later */}}
            />
          ))}

          {!showCompleted && (
            <button className={styles.emptyCard} onClick={() => setShowNewGoalModal(true)}>
              <span className={styles.emptyIcon}>+</span>
              <span className={styles.emptyLabel}>Create new goal</span>
              <span className={styles.emptyCta}>Get started</span>
            </button>
          )}

          {visibleGoals.length === 0 && showCompleted && (
            <p className={styles.emptyText}>No completed goals yet — keep saving!</p>
          )}
        </div>
      )}

      {fundsModalGoal && (
        <AddFundsModal
          goal={fundsModalGoal}
          onClose={() => setFundsModalGoal(null)}
          onConfirm={handleAddFunds}
        />
      )}

      {showNewGoalModal && (
        <NewGoalModal
          onClose={() => setShowNewGoalModal(false)}
          onCreate={handleCreateGoal}
        />
      )}
    </div>
  )
}
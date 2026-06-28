'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { transactionsApi, savedTipsApi } from '@/lib/api'
import TipCard from '@/components/tips/TipCard'
import styles from './tips.module.css'

const TABS = ['For you', 'All tips', 'Glossary']

const TIPS = [
  { id: 1, tag: '📌 Budgeting', title: 'The 50/30/20 rule, explained', body: 'A simple framework: 50% of income to needs, 30% to wants, and 20% to savings. Here\'s how to apply it even on a student budget.', readTime: '2 min read', unlockAt: 0 },
  { id: 2, tag: '💰 Saving', title: 'Why "pay yourself first" works', body: 'Set aside savings the moment you get paid, before any spending happens. This single habit shift outperforms most budgeting apps.', readTime: '3 min read', unlockAt: 0 },
  { id: 3, tag: '📊 Spending', title: 'How to spot lifestyle creep', body: 'As income rises, spending quietly rises with it. Learn the warning signs before it eats your savings rate.', readTime: '4 min read', unlockAt: 5 },
  { id: 4, tag: '🏦 Banking', title: 'Understanding interest rates', body: 'Compound interest can work for you or against you. A plain-language breakdown of how loans and savings accounts actually calculate interest.', readTime: '5 min read', unlockAt: 5 },
  { id: 5, tag: '🎯 Goals', title: 'Setting goals you\'ll actually keep', body: 'Specific, time-bound savings goals are far more likely to succeed than vague ones like "save more". Here\'s the research-backed method.', readTime: '3 min read', unlockAt: 10 },
  { id: 6, tag: '💳 Credit', title: 'Credit scores in Nepal: the basics', body: 'How credit history works locally, what affects it, and why it matters even if you don\'t use credit cards yet.', readTime: '4 min read', unlockAt: 10 },
]

const GLOSSARY = [
  { term: 'Net balance', def: 'The amount left over after subtracting total expenses from total income for a given period.' },
  { term: 'Budget', def: 'A planned limit on how much you intend to spend in a specific category over a set time period.' },
  { term: '50/30/20 rule', def: 'A budgeting framework allocating 50% of income to needs, 30% to wants, and 20% to savings.' },
  { term: 'Recurring expense', def: 'A cost that repeats on a regular schedule, such as rent, subscriptions, or utility bills.' },
  { term: 'Savings rate', def: 'The percentage of your income that you save rather than spend, usually calculated monthly.' },
]

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState('For you')
  const [glossarySearch, setGlossarySearch] = useState('')
  const [txnCount, setTxnCount] = useState(0)
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null) // tipId currently being saved/unsaved, for disabling double-clicks

  useEffect(() => {
    const load = async () => {
      try {
        const [txnRes, savedRes] = await Promise.all([
          transactionsApi.list({}),
          savedTipsApi.list(),
        ])
        setTxnCount(txnRes.data.length)
        setSavedIds(savedRes.data)
      } catch {
        setTxnCount(0)
        setSavedIds([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const tipsWithLockState = useMemo(() => {
    return TIPS.map(t => ({ ...t, locked: txnCount < t.unlockAt }))
  }, [txnCount])

  const readableCount = tipsWithLockState.filter(t => !t.locked).length

  // The featured tip in the banner — the first one currently unlocked
  const featuredTip = tipsWithLockState.find(t => !t.locked)
  const featuredIsSaved = featuredTip ? savedIds.includes(featuredTip.id) : false

  const toggleSave = async (tipId) => {
    setSavingId(tipId)
    try {
      if (savedIds.includes(tipId)) {
        await savedTipsApi.unsave(tipId)
        setSavedIds(prev => prev.filter(id => id !== tipId))
      } else {
        await savedTipsApi.save(tipId)
        setSavedIds(prev => [...prev, tipId])
      }
    } catch {
      // silently ignore — saving a tip is non-critical, no need to interrupt the user
    } finally {
      setSavingId(null)
    }
  }

  const filteredGlossary = useMemo(() => {
    if (!glossarySearch.trim()) return GLOSSARY
    const q = glossarySearch.toLowerCase()
    return GLOSSARY.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q))
  }, [glossarySearch])

  return (
    <div className="fade-up">
      {/* Top bar */}
      <div className={styles.topRow}>
        <h1 className={styles.pageTitle}>Tips &amp; Financial Literacy</h1>
        <div className={styles.tabGroup}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab !== 'Glossary' ? (
        <>
          {/* Personalised banner */}
          <div className={styles.banner}>
            <span className={styles.bannerLabel}>💡 PERSONALISED FOR YOU</span>
            <p className={styles.bannerText}>
              {loading
                ? 'Loading your personalised tip…'
                : txnCount === 0
                  ? 'Log your first transaction to unlock tips tailored to your spending.'
                  : `You've logged ${txnCount} transaction${txnCount === 1 ? '' : 's'} — keep going to unlock more tips below.`}
            </p>
            {featuredTip && (
              <button
                className={styles.saveTipBtn}
                onClick={() => toggleSave(featuredTip.id)}
                disabled={savingId === featuredTip.id}
              >
                {featuredIsSaved ? '✓ Saved' : 'Save tip'}
              </button>
            )}
          </div>

          {/* Tip grid */}
          <div className={styles.grid}>
            {tipsWithLockState.map(tip => (
              <TipCard
                key={tip.id}
                tag={tip.tag}
                title={tip.title}
                body={tip.body}
                readTime={tip.readTime}
                locked={tip.locked}
                unlockHint={`Log ${tip.unlockAt - txnCount} more expenses to unlock`}
                saved={savedIds.includes(tip.id)}
                onToggleSave={() => toggleSave(tip.id)}
                onRead={() => {}}
              />
            ))}
          </div>

          {/* Progress */}
          <div className={styles.progressSection}>
            <span className={styles.progressLabel}>Tips read: {readableCount} / {TIPS.length}</span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${(readableCount / TIPS.length) * 100}%` }} />
            </div>
            <button className={styles.viewAllLink} onClick={() => setActiveTab('All tips')}>
              View all tips →
            </button>
          </div>
        </>
      ) : (
        /* Glossary tab */
        <div className={styles.glossaryWrap}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search glossary…"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.glossaryList}>
            {filteredGlossary.length === 0 ? (
              <p className={styles.emptyText}>No matching terms found.</p>
            ) : (
              filteredGlossary.map(g => (
                <div key={g.term} className={styles.glossaryItem}>
                  <span className={styles.glossaryTerm}>{g.term}</span>
                  <p className={styles.glossaryDef}>{g.def}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
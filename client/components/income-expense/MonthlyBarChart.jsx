'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import styles from './MonthlyBarChart.module.css'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: p.fill }} />
          <span className={styles.tooltipName}>{p.name}</span>
          <span className={styles.tooltipValue}>NPR {p.value.toLocaleString('en-US')}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBarChart({ data }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatchSolid} /> Income
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchStriped} /> Expenses
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={6}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
          <Bar dataKey="income" name="Income" fill="#1A1A2E" radius={[4, 4, 0, 0]} animationDuration={500} />
          <Bar dataKey="expense" name="Expenses" radius={[4, 4, 0, 0]} animationDuration={500}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.expense > entry.income ? '#FCA5A5' : '#D1D5DB'}
                stroke={entry.expense > entry.income ? 'var(--danger)' : 'none'}
                strokeWidth={entry.expense > entry.income ? 1.5 : 0}
                strokeDasharray={entry.expense > entry.income ? '3 2' : '0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
// Run with: npm run seed
// Creates one test user with realistic transactions, a budget, and a savings goal
// so you can test the frontend without manually registering and logging transactions.

import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../../config/db.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'
import SavingsGoal from '../models/SavingsGoal.js'

const TEST_EMAIL = 'sita@example.com'
const TEST_PASSWORD = 'password123'

const now = new Date()
const thisMonth = now.getMonth() + 1
const thisYear  = now.getFullYear()

async function seed() {
  await connectDB()

  console.log('🧹 Clearing existing test data...')
  const existing = await User.findOne({ email: TEST_EMAIL })
  if (existing) {
    await Transaction.deleteMany({ user: existing._id })
    await Budget.deleteMany({ user: existing._id })
    await SavingsGoal.deleteMany({ user: existing._id })
    await User.deleteOne({ _id: existing._id })
  }

  console.log('👤 Creating test user...')
  const user = await User.create({
    firstName: 'Sita',
    lastName: 'Sharma',
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    onboarded: true,
    employmentType: 'student',
    monthlyIncome: 50000,
    selectedCategories: ['food', 'transport', 'bills', 'entertainment'],
  })

  console.log('💰 Creating transactions...')
  const transactions = [
    { type: 'income',  amount: 50000, category: 'Salary',           merchant: 'Freelance client', date: new Date(thisYear, thisMonth - 1, 1) },
    { type: 'expense', amount: 450,   category: 'Food & Dining',    merchant: 'Himalayan Java',   date: new Date(thisYear, thisMonth - 1, 3) },
    { type: 'expense', amount: 1200,  category: 'Food & Dining',    merchant: 'Bota Restro & Bar', date: new Date(thisYear, thisMonth - 1, 5) },
    { type: 'expense', amount: 890,   category: 'Food & Dining',    merchant: 'KFC Durbarmarg',    date: new Date(thisYear, thisMonth - 1, 8) },
    { type: 'expense', amount: 60,    category: 'Transport',        merchant: 'Sajha Yatayat',     date: new Date(thisYear, thisMonth - 1, 4) },
    { type: 'expense', amount: 320,   category: 'Transport',        merchant: 'Pathao ride',       date: new Date(thisYear, thisMonth - 1, 9) },
    { type: 'expense', amount: 1800,  category: 'Bills & Utilities',merchant: 'NEA Electricity',   date: new Date(thisYear, thisMonth - 1, 10) },
    { type: 'expense', amount: 1400,  category: 'Bills & Utilities',merchant: 'Worldlink Internet',date: new Date(thisYear, thisMonth - 1, 11) },
    { type: 'expense', amount: 2500,  category: 'Shopping',         merchant: 'Bhatbhateni Supermarket', date: new Date(thisYear, thisMonth - 1, 12) },
  ]
  await Transaction.insertMany(transactions.map(t => ({ ...t, user: user._id })))

  console.log('📊 Creating budgets...')
  const budgets = [
    { category: 'Food & Dining',     limit: 12000 },
    { category: 'Transport',         limit: 8000 },
    { category: 'Bills & Utilities', limit: 12000 },
    { category: 'Entertainment',     limit: 6000 },
  ]
  await Budget.insertMany(budgets.map(b => ({ ...b, month: thisMonth, year: thisYear, user: user._id })))

  console.log('🎯 Creating savings goal...')
  await SavingsGoal.create({
    user: user._id,
    name: 'Trip to Pokhara',
    targetAmount: 20000,
    savedAmount: 8500,
    deadline: new Date(thisYear, thisMonth + 2, 1),
    streakWeeks: 4,
  })

  console.log('\n✅ Seed complete!')
  console.log(`   Login with: ${TEST_EMAIL} / ${TEST_PASSWORD}\n`)

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
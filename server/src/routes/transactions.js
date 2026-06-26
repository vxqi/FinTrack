import express from 'express'
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
  getMonthlyTrend,
  getCategoryComparison,
} from '../controllers/transactionController.js'
import { protect } from '../middleware/auth.js'
import { transactionRules, transactionQueryRules, validate } from '../middleware/validators.js'

const router = express.Router()

router.get('/summary',             protect, getSummary)
router.get('/monthly-trend',       protect, getMonthlyTrend)
router.get('/category-comparison', protect, getCategoryComparison)
router.get('/',                    protect, transactionQueryRules, validate, getTransactions)
router.post('/',                   protect, transactionRules, validate, createTransaction)
router.delete('/:id',              protect, deleteTransaction)

export default router
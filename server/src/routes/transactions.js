import express from 'express'
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
} from '../controllers/transactionController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/summary', protect, getSummary)
router.get('/',        protect, getTransactions)
router.post('/',       protect, createTransaction)
router.delete('/:id',  protect, deleteTransaction)

export default router
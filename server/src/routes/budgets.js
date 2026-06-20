import express from 'express'
import {
  getBudgets,
  getBudgetsWithSpend,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js'
import { protect } from '../middleware/auth.js'
import { budgetRules, validate } from '../middleware/validators.js'

const router = express.Router()

router.get('/with-spend', protect, getBudgetsWithSpend)
router.get('/',           protect, getBudgets)
router.post('/',          protect, budgetRules, validate, createBudget)
router.patch('/:id',      protect, updateBudget)
router.delete('/:id',     protect, deleteBudget)

export default router
import express from 'express'
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalsController.js'
import { protect } from '../middleware/auth.js'
import { goalRules, validate } from '../middleware/validators.js'

const router = express.Router()

router.get('/',       protect, getGoals)
router.post('/',      protect, goalRules, validate, createGoal)
router.patch('/:id',  protect, updateGoal)
router.delete('/:id', protect, deleteGoal)

export default router
import express from 'express'
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalsController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/',      protect, getGoals)
router.post('/',     protect, createGoal)
router.patch('/:id', protect, updateGoal)
router.delete('/:id',protect, deleteGoal)

export default router
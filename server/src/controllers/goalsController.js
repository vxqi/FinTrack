import SavingsGoal from '../models/SavingsGoal.js'
import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

// GET /api/goals
export const getGoals = catchAsync(async (req, res) => {
  const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, data: goals })
})

// POST /api/goals
export const createGoal = catchAsync(async (req, res) => {
  const goal = await SavingsGoal.create({ ...req.body, user: req.user._id })
  res.status(201).json({ success: true, data: goal })
})

// PATCH /api/goals/:id
export const updateGoal = catchAsync(async (req, res) => {
  const goal = await SavingsGoal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!goal) throw new AppError('Goal not found', 404)

  // Auto-mark complete if saved amount reaches target
  if (goal.savedAmount >= goal.targetAmount && !goal.completed) {
    goal.completed = true
    await goal.save()
  }

  res.json({ success: true, data: goal })
})

// DELETE /api/goals/:id
export const deleteGoal = catchAsync(async (req, res) => {
  const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!goal) throw new AppError('Goal not found', 404)
  res.json({ success: true, message: 'Goal deleted' })
})
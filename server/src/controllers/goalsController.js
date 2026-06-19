import SavingsGoal from '../models/SavingsGoal.js'

// GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, data: goals })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.create({ ...req.body, user: req.user._id })
    res.status(201).json({ success: true, data: goal })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PATCH /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    )
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' })
    res.json({ success: true, data: goal })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    res.json({ success: true, message: 'Goal deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
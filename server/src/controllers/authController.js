import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'
import SavingsGoal from '../models/SavingsGoal.js'
import { sendToken } from '../utils/sendToken.js'
import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

// POST /api/auth/register
export const register = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) {
    throw new AppError('Email is already registered', 400)
  }

  const user = await User.create({ firstName, lastName, email, password })
  sendToken(user, 201, res)
})

// POST /api/auth/login
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  sendToken(user, 200, res)
})

// POST /api/auth/logout
export const logout = (req, res) => {
  res
    .cookie('token', '', { maxAge: 0 })
    .json({ success: true, message: 'Logged out successfully' })
}

// GET /api/auth/me
export const getMe = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user })
})

// PATCH /api/auth/onboarding
export const completeOnboarding = catchAsync(async (req, res) => {
  const { monthlyIncome, employmentType, selectedCategories } = req.body

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { monthlyIncome, employmentType, selectedCategories, onboarded: true },
    { new: true, runValidators: true }
  )

  res.json({ success: true, user })
})

// PATCH /api/auth/me — update profile / settings
export const updateMe = catchAsync(async (req, res) => {
  const allowedFields = [
    'firstName', 'lastName', 'currency', 'avatar', 'notificationPrefs',
  ]
  const updates = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  })

  res.json({ success: true, user })
})

// PATCH /api/auth/change-password
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are both required', 400)
  }
  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters', 400)
  }

  // Need the hashed password on this query — getMe's req.user doesn't select it
  const user = await User.findById(req.user._id).select('+password')

  const isMatch = await user.matchPassword(currentPassword)
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401)
  }

  user.password = newPassword // pre-save hook in the User model re-hashes this
  await user.save()

  res.json({ success: true, message: 'Password updated successfully' })
})

// DELETE /api/auth/me — permanently deletes the account and all associated data
export const deleteAccount = catchAsync(async (req, res) => {
  const { password } = req.body

  if (!password) {
    throw new AppError('Please confirm your password to delete your account', 400)
  }

  const user = await User.findById(req.user._id).select('+password')
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    throw new AppError('Password is incorrect', 401)
  }

  // Cascade delete — remove all data tied to this user before removing the user itself,
  // so we never leave orphaned transactions/budgets/goals behind in MongoDB.
  await Promise.all([
    Transaction.deleteMany({ user: req.user._id }),
    Budget.deleteMany({ user: req.user._id }),
    SavingsGoal.deleteMany({ user: req.user._id }),
  ])
  await User.findByIdAndDelete(req.user._id)

  res
    .cookie('token', '', { maxAge: 0 }) // log them out as part of the same response
    .json({ success: true, message: 'Account deleted successfully' })
})
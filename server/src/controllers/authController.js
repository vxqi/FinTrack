import User from '../models/User.js'
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
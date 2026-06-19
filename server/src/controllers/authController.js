import User from '../models/User.js'
import { sendToken } from '../utils/sendToken.js'

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' })
    }

    const user = await User.create({ firstName, lastName, email, password })
    sendToken(user, 201, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    sendToken(user, 200, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/auth/logout
export const logout = (req, res) => {
  res
    .cookie('token', '', { maxAge: 0 })
    .json({ success: true, message: 'Logged out successfully' })
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

// PATCH /api/auth/onboarding
export const completeOnboarding = async (req, res) => {
  try {
    const { monthlyIncome, employmentType, selectedCategories } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { monthlyIncome, employmentType, selectedCategories, onboarded: true },
      { new: true }
    )
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
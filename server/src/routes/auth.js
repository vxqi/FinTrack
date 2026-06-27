import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  completeOnboarding,
  updateMe,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { registerRules, loginRules, validate } from '../middleware/validators.js'

const router = express.Router()

router.post('/register',        registerRules, validate, register)
router.post('/login',           loginRules, validate, login)
router.post('/logout',          protect, logout)
router.get('/me',               protect, getMe)
router.patch('/me',             protect, updateMe)
router.patch('/change-password', protect, changePassword)
router.patch('/onboarding',     protect, completeOnboarding)
router.delete('/me',            protect, deleteAccount)

export default router
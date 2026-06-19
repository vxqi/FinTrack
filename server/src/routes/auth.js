import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  completeOnboarding,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register',    register)
router.post('/login',       login)
router.post('/logout',      protect, logout)
router.get('/me',           protect, getMe)
router.patch('/onboarding', protect, completeOnboarding)

export default router
import { body, query, validationResult } from 'express-validator'
import AppError from '../utils/AppError.js'

// Call this after any validation chain to collect errors and forward them
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join('. ')
    return next(new AppError(message, 400))
  }
  next()
}

// ── Auth ──
export const registerRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

export const loginRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

// ── Transactions ──
export const transactionRules = [
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
]

export const transactionQueryRules = [
  query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be valid'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
]

// ── Savings Goals ──
export const goalRules = [
  body('name').trim().notEmpty().withMessage('Goal name is required'),
  body('targetAmount').isFloat({ gt: 0 }).withMessage('Target amount must be a positive number'),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
]

// ── Budgets ──
export const budgetRules = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('limit').isFloat({ gt: 0 }).withMessage('Limit must be a positive number'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Year must be valid'),
]
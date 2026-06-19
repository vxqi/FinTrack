import Transaction from '../models/Transaction.js'

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const { month, year, type, category } = req.query
    const filter = { user: req.user._id }

    if (type) filter.type = type
    if (category) filter.category = category

    if (month && year) {
      const start = new Date(year, month - 1, 1)
      const end   = new Date(year, month, 0, 23, 59, 59)
      filter.date = { $gte: start, $lte: end }
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 })
    res.json({ success: true, data: transactions })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id })
    res.status(201).json({ success: true, data: transaction })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }
    res.json({ success: true, message: 'Transaction deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/transactions/summary  — monthly totals by category
export const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query
    const start = new Date(year, month - 1, 1)
    const end   = new Date(year, month, 0, 23, 59, 59)

    const summary = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
      { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' } } },
    ])
    res.json({ success: true, data: summary })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
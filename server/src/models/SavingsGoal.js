import mongoose from 'mongoose'

const savingsGoalSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:         { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount:  { type: Number, default: 0 },
    deadline:     { type: Date },
    photo:        { type: String, default: '' },
    completed:    { type: Boolean, default: false },
    streakWeeks:  { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('SavingsGoal', savingsGoalSchema)
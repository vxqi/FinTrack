import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, minlength: 8, select: false },
    onboarded: { type: Boolean, default: false },
    avatar:    { type: String, default: '' },

    // Onboarding data
    currency:        { type: String, default: 'NPR' },
    employmentType:  { type: String, enum: ['student', 'salaried', 'freelance', 'other'], default: 'student' },
    monthlyIncome:   { type: Number, default: 0 },
    selectedCategories: [{ type: String }],

    // Notification preferences
    notificationPrefs: {
      budgetAlerts:     { type: Boolean, default: true },
      alertThreshold:   { type: Number,  default: 80 },
      weeklySummary:    { type: Boolean, default: true },
      savingsReminders: { type: Boolean, default: true },
      spendingInsights: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare entered password with hashed
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

export default mongoose.model('User', userSchema)
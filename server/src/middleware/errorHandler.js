import AppError from '../utils/AppError.js'

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400)

const handleDuplicateField = (err) => {
  const field = Object.keys(err.keyValue)[0]
  return new AppError(`${field} '${err.keyValue[field]}' is already in use`, 400)
}

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message)
  return new AppError(`Invalid input: ${messages.join('. ')}`, 400)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401)

const handleJWTExpired = () =>
  new AppError('Your session has expired. Please log in again.', 401)

export default function errorHandler(err, req, res, next) {
  let error = { ...err, message: err.message, statusCode: err.statusCode }

  if (err.name === 'CastError')        error = handleCastError(err)
  if (err.code === 11000)              error = handleDuplicateField(err)
  if (err.name === 'ValidationError')  error = handleValidationError(err)
  if (err.name === 'JsonWebTokenError') error = handleJWTError()
  if (err.name === 'TokenExpiredError') error = handleJWTExpired()

  const statusCode = error.statusCode || 500
  const message    = error.isOperational ? error.message : 'Something went wrong on our end.'

  if (process.env.NODE_ENV === 'development' && !error.isOperational) {
    console.error('🔥 UNEXPECTED ERROR:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}
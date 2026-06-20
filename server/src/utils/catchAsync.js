// Wraps an async controller so any thrown error or rejected promise
// is passed to next() automatically — no try/catch needed in every controller.
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default catchAsync
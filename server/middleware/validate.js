export const validateRequest = (req, res, next) => {
  if (req.method === 'POST' && !req.body.message) {
    return res.status(400).json({ error: 'Validation Error: message field is required' });
  }
  next();
};

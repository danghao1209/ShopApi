export const handleError = (err, req, res, next) => {
  console.err;
  res.status(400).json({ error: err.message });
};

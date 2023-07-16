export const handleError = (err, req, res, next) => {
  console.log(err?.message);
  res.status(400).json({ status: 0, message: err?.message });
};

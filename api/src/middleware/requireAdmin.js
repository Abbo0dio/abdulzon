export const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const err = new Error('Admin access required');
    err.statusCode = 403;
    return next(err);
  }
  return next();
};

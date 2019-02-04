//401 Unauthorized - invalid token
//403 Forbidden - valid token, but not allowed

module.exports = function(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send('Acceso denegado.');

  next();
};

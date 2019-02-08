const config = require('config');

module.exports = function(req, res, next) {
  //401 Unauthorized - invalid token
  //403 Forbidden - valid token, but not allowed
  if (!config.get('requiresAuth')) return next();
  if (!req.user.isAdmin) return res.status(403).send('Acceso denegado.');
  next();
};

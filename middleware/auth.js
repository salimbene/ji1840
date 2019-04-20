const jwt = require('jsonwebtoken');
const debug = require('debug')('middleware:auth');
const config = require('config');

module.exports = function(req, res, next) {
  if (!config.get('requiresAuth')) return next();

  const token = req.header('x-auth-token');

  if (!token)
    return res.status(401).send('Acceso denegado. No se encontró el token.');

  const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  req.user = decoded;
  next();
};

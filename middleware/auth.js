const jwt = require('jsonwebtoken');
const debug = require('debug')('middleware:auth');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    debug(token);
    debug(decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
};

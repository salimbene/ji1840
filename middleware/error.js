const winston = require('winston');
module.exports = function(err, req, res, next) {
  //log levels: error, warn, info, verbose, debug, silly
  winston.error(err.message, err);
  res.status(500).send('Algo no funcionó. Contacte a su administrador.');
};

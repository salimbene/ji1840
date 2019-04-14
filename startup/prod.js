const helmet = require('helmet'); //Secure HTTP headers
const compression = require('compression');

module.exports = function(app) {
  app.use(helmet());
  app.use(compression());
};

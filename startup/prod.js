const helmet = require('helmet'); //Secure HTTP headers
const compression = require('compression');
const serveStatic = require('serve-static');
const path = require('path');
const debug = require('debug')('app:prod');
const cwd = process.cwd();

module.exports = function(app) {
  app.use(helmet());
  app.use(compression());

  debug('serving static content: ', path.join(cwd, 'build'));
  // Serve static revved files with uncoditional cache
  app.use(
    serveStatic(path.join(cwd, 'build'), {
      index: false,
      setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');
      }
    })
  );

  // Route any non API and non static file to React Client Router for SPA development
  app.use((req, res) => {
    debug('sendFile', path.join(cwd, 'build', 'index.html'));
    res.sendFile(path.join(cwd, 'build', 'index.html'));
  });
};

import Raven from 'raven-js';

function init() {
  Raven.config(
    'https://a92e94fcca124123b2bf3379ec01d717@sentry.io/1381521'
  ).install();
}

function log(error) {
  Raven.captureException(error);
}

export default {
  init,
  log
};

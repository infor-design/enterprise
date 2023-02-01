import logger from '../logger.js';

// Simple Middleware that simulates a delayed response by setting a timeout before returning the next middleware.
export default function () {
  return function responseThrottler(req, res, next) {
    if (!res.opts.delay) {
      next();
      return;
    }

    function delayedResponse() {
      logger('info', 'Delayed request continuing...');
      next();
    }

    logger('info', `Delaying the response time of this request by ${res.opts.delay}ms...`);
    setTimeout(delayedResponse, res.opts.delay);
  };
}

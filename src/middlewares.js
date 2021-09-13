const expressRateLimit = require('express-rate-limit');
const index = require('./index');

const permittedRequestsPerInterval = 10;
const intervalMinutes = 60;
const rateLimitRejectionMessage = {
  success: 'FALSE',
  message: `We have recieved too many requests from this IP address, in order to safegaurd the integrity of the system, future requests will be refused. Please try again after ${intervalMinutes} minutes.`,
};

/* The rate limiter for the get route(s).
 * This is seperate from the other routes so calls to one route do not count towards the others.
 * Having this sepertion also makes testing easier. */
const getRouteApiLimiter = expressRateLimit({
  windowMs: intervalMinutes * 60 * 1000,
  max: permittedRequestsPerInterval,
  message: rateLimitRejectionMessage,
});

function loggingMiddleware(req, res, next) {
  console.log(`${req.method} request to '${req.path}' received from req.ip: ${req.ip}, req.secure: ${req.secure}`);
  next();
}

module.exports.loggingMiddleware = loggingMiddleware;
module.exports.getRouteApiLimiter = getRouteApiLimiter;
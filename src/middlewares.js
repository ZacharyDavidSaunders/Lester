const expressRateLimit = require('express-rate-limit');
const index = require('./index');

const permittedRequestsPerInterval = 10;
const intervalMinutes = 60;
const rateLimitRejectionMessage = {
  message: `We have recieved too many requests from this IP address, in order to safegaurd the integrity of the system, future requests will be refused. Please try again after ${intervalMinutes} minutes.`,
};

/**
 * Middleware that provides rate limiting for GET requests.
 * 
 * @param {*} req the request.
 * @param {*} res the response.
 * @param {*} next the next middleware to be executed if request is allowed to proceed.
 */
const getRouteApiLimiter = expressRateLimit({
  windowMs: intervalMinutes * 60 * 1000,
  max: permittedRequestsPerInterval,
  message: rateLimitRejectionMessage,
});

/**
 * Middleware that provides logging.
 * 
 * @param {*} req the request.
 * @param {*} res the response.
 * @param {*} next the next middleware to be executed if request is allowed to proceed.
 */
function loggingMiddleware(req, res, next) {
  console.log(`${req.method} request to '${req.path}' received from req.ip: ${req.ip}, req.secure: ${req.secure}`);
  next();
}

/**
 * Checks that search requests have 1+ of the following parameters:
 *  1. Search String
 *  2. Search ID
 * 
 * @param {*} req the request.
 * @param {*} res the response.
 * @param {*} next the next middleware to be executed if request is allowed to proceed.
 */
function searchParamMiddleware(req, res, next) {
  const searchId = req.query.searchId;
  const searchString = req.query.searchString;

  if(searchId || searchString){
    next();
  }else{
    res.status(422).send({
      message: `Error: The search param route requires either a searchString or searchId parameter.`,
    });
  }
}

module.exports.loggingMiddleware = loggingMiddleware;
module.exports.getRouteApiLimiter = getRouteApiLimiter;
module.exports.searchParamMiddleware = searchParamMiddleware;
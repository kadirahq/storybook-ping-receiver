var basicAuth = require('basic-auth');

var AUTH_SECRET = process.env.AUTH_SECRET;

module.exports.auth = function(req, res, next) {
  var user = basicAuth(req);
  if(!user || AUTH_SECRET !== user.pass ) {
    res.set('WWW-Authenticate', 'Basic realm="stats"');
    return res.status(401).send();
  }
  return next();
};

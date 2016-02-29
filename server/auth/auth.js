// Auth module
var jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, require('./../../index.js').get('SECRET'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: "You're not authorized to do this!" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "You're not logged in!"
    });
  }
}

module.exports.isLoggedIn = isLoggedIn;
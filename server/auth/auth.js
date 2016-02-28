// Auth module
var jwt = require('jsonwebtoken');
var app = require('./../../index.js');

function isLoggedIn(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, app.get('SECRET'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: "Failed to authenticate token." });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "No token provided"
    });
  }
}

module.exports.isLoggedIn = isLoggedIn;
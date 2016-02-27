// Auth module
var config = require('../config/config.js');
var jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, config.secret, function(err, decoded) {
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
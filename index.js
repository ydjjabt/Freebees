var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');
var auth = require('./server/auth/auth.js');

var app = express();

mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/freebiesnearme";
mongoose.connect(mongoURI);

// to directly post to the remote online database, use this connection:
// mongoose.connect("mongodb://master:master@ds061405.mongolab.com:61405/heroku_477ltgkh");

mongoose.connection.once('open', function(){
  console.log('Connected to mongodb');
});

var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// require('./server/config/passport')(passport);

// Attach/initiate sessions
app.use(session({ secret: 'yeezy yeezy yeezy just jumped over jumpman' }));
app.use(passport.initialize());
app.use(passport.session());

//use routes.js
app.use(express.static(__dirname + '/client'));
require('./server/routes')(app, passport);

app.listen(port);
console.log('Express is listening on port: ' + port);

module.exports = app;
//
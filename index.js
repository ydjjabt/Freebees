// express
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();

//create mongo database
mongoURI = process.env.MONGOLAB_URI || 'mongodb://master:master@ds061405.mongolab.com:61405/heroku_477ltgkh';
mongoose.connect(mongoURI);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client'));

//set up server logging
app.use(morgan('combined'));

app.use(bodyParser.json());
//parse x-ww-form-urlencoded encoded req bodies
app.use(bodyParser.urlencoded({extended: true}));

//use routes.js
require('./server/routes')(app);

app.listen(port);
console.log('Express is listening on port: ' + port);

module.exports = app;


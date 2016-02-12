// express
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();

//create mongo database

mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/freebiesnearme";

mongoose.connect(mongoURI);
mongoose.connection.once('open', function() {
  console.log('Connected to mongodb');
});

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


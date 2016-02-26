// JWT secret.
var secret = "YOUR SECRET HERE";

// URI for Mongo database.
var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/freebiesnearme";

// You can use this in case you want to post directly to your production database
var mongoURI_PRODUCTION = "Your remote mongo database uri here";

module.exports = {
  'secret': secret,
  'mongoURI': mongoURI,
  'mongoURI_PRODUCTION': mongoURI_PRODUCTION
}
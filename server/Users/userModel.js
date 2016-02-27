var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema ({
  username : {
    type: String,
    required: true
  },
  password :{
    type: String,
    required: true
  },
  address :{
    type: String,
    required: false
  }
});

// Methods for hash generation and comparing passwords
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

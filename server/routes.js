//require server-side itemController functions to interact with db
var ItemFuncs = require('./items/itemController.js');
var UserFuncs = require('./Users/userController.js');
var User = require('./Users/userModel.js');
var auth = require('./auth/auth.js');
var config = require('./config/config.js');

module.exports = function(app){
  //when navigate to /api/items, retrieve all data rows from db
  app.get('/api/items', ItemFuncs.getAllItems);
  app.post('/api/users', UserFuncs.getUser);
  //when submit an item to be given away, save it to db
  app.post('/user', UserFuncs.saveUser);
  app.post('/submit', auth.isLoggedIn, ItemFuncs.saveItem);
  app.post('/remove', auth.isLoggedIn, ItemFuncs.removeItem);

  app.get('/profile', auth.isLoggedIn, function(req, res) {
    // some logic here
    res.send(req.decoded);
  });

  app.post('/login', function(req, res, next) {
    User.findOne({
      local.username: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if(!user) {
        res.json({ success: false, message: 'Auth failed. User not found.'})
      } else {
        if(User.comparePassword(req.body.password)) {
          var token = jwt.sign(user, config.secret, {
            expiresInMinutes: 1440
          });
          res.json({
            success: true,
            message: "Authentication successful.",
            token: token
          });
        } else {
          res.json({ success: false, message: 'Auth failed. Password incorrect.'});
        }
      }
    })
  })

  app.post('/signup', function(req, res, next) {
    User.findOne({
      local.username: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if(user) {
        res.json({ success: false, message: 'Signup failed. Username already exists.'});
      } else {
        var newUser = new User();
        newUser.local.username = req.body.username;
        newUser.local.password = User.generateHash(req.body.password);
        newUser.save(function(err) {
          if(err) throw err;
          var token = jwt.sign(newUser, config.secret, {
            expiresInMinutes: 1440
          });
          res.json({
            success: true,
            message: "Signup successful.",
            token: token
          });
        });
      }
    })
  });

  //any other route will load root
  app.get('*', function(req, res){
    res.redirect('/');
  });
};
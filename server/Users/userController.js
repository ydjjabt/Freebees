var mongoose = require('mongoose');
//var fs  = require('fs')
var User = require('./userModel.js');
//var fs = require('fs');
var Q = require('q');

module.exports = {
    saveUser : function (req, res){
    var sentUsername = req.body.username;
    var sentPassword = req.body.password;
    var sentAddress  = req.body.address;
    var create;
    //console.log(User);


    var findUser = Q.nbind(User.model.findOne, User.model);

    findUser({username: sentUsername, password: sentPassword, address: sentAddress})
        .then(function(user){
            if (user){
                console.log("Trying to add user that alreay exists")
                res.status(400).send("try another")
            } else {
              console.log("made it here")
               createUser =  Q.nbind(User.model.create, User.model);
               var newUser = {//
                local : {
                username : sentUsername,
                password : sentPassword,//User.encryptPassword(sentPassword),
                address : sentAddress
               }};

               createUser(newUser)
                .then(function(data){
                    console.log("save")
                    res.send(data);
                })
                .catch(function(err){
                    console.log("Error when create user invoked - creating newuser and save to db. Err ", err);
                    res.send(400)
                });
            }
        })
        .catch(function(err){
            console.log("errror looking for user", err);
        });
    },
    getUser: function(req, res) {
      //console.log('hello');
      //res.send("hello");
      var sentUsername = req.body.username;
      var sentPassword = req.body.password;
      var sentAddress  = req.body.address;
      var findUser = Q.nbind(User.model.findOne, User.model);

    findUser({username: sentUsername, password: sentPassword, address: sentAddress})
      .then(function(user){
        if (user){

          console.log("Trying to add user that alreay exists");
          res.status(200).send(user);
        } else {
          console.log('sent from no user')
          res.set(200).send("user not found");
        }
      })
      .catch(function(err){
        console.log("error getuser err", err)
      })
    }
}
var mongoose = require('mongoose');

var User = require('./userModel.js');

var Q = require('q');

module.exports = {
    saveUser : function (req, res){
    var sentUsername = req.body.username;
    var sentPassword = req.body.password;
    var sentAddress  = req.body.address;
           
    var findUser = Q.nbind(User.findOne,User);
    findUser({username: username, password: password, address: address})
        .then(function(user){
            if(user){
                console.log("Trying to add user that alreay exists")
                res.status(400).send("try another")
            } else {
               createUser =  Q.nbind(User.create, User);
               var newUser = {
                username : sentUsername,
                password : sentPassword,
                address : sentAddress
               };

               create(newUser)
                .then(function(data){
                    console.log("save")
                    res.send(data);
                })
                .catch(function(err){
                    console.log("Error when create user invoked - creating newuser and save to db. Err ", err);
                })
            }
        })
        .catch(function(err){
            console.log("errror looking for user", err);
        })
    }
}
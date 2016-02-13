var Item = require('./itemModel.js');
var Q = require('q');
// var Promise = require('bluebird');
var mongoose = require('mongoose');

//commenting out bluebird for now
// mongoose.Promise = Promise;

// module.exports = {
//   saveOneItem: function(req, res){
//     var itemName = req.body.itemName;
//     var itemLocation = req.body.itemLocation;
//     var create;
//     var newuser;

//     return Item
//       .findOne({
//         itemName: itemName,
//         itemLocation: itemLocation
//       })
//   }
// }

module.exports = {
  saveItem : function (toSave) {
    console.log("we are trying to save: ", toSave);
    var itemName = toSave.item;
    var itemLocation = toSave.LatLng;
    var create;
    var newuser;
    //The below line returns promisified version of Item.findOne bound to context Item
    var findOne = Q.nbind(Item.findOne, Item);

    //This function adds new item to database
    findOne({itemName: itemName, itemLocation: itemLocation})
      //The above line queries the database for any entries that match the item name and location from req.body
      .then(function(item){
        //If the item already exists, throws an error
        if (item){
          console.log('That item is already being offered from that location \n Try offering something new');
          return false;
        } else {
          // The Item.create involes .save automatically
          create = Q.nbind(Item.create, Item);
          newItem = {
            itemName: itemName,
            itemLocation: itemLocation
          };
          Item.create(newItem, function(){
            console.log('inside create/save async callback');
          });
          return true;
        }
    });
  },

  getAllItems: function(req, res){
    var findAll = Q.nbind(Item.find, Item);

    findAll({})
      .then(function(items){
        res.json(items);
    });
  }
};



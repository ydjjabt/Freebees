var Item = require('./itemModel.js');
var Q = require('q');

module.exports = {
  saveItem : function (req, res, next) {
    var itemName = req.body.itemName;
    var itemLocation = req.body.itemLocation;
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
          next(new Error('That item is already being offered from that location \n Try offering something new'));
        } else {
          // The Item.create involes .save automatically
          create = Q.nbind(Item.create, Item);
          newItem = {
            itemName: itemName,
            itemLocation: itemLocation
          };
          return;
        }
      });

  }


};

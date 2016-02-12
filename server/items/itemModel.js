var mongoose = require('mongoose');


var ItemSchema = new mongoose.Schema ({
  itemName :{
    type: String,
    require: true
  },

  itemLocation :{
    type: Object,
    require: true
  }

});

module.exports = mongoose.model('Item', ItemSchema);


var mongoose = require('mongoose');


var ItemSchema = new mongoose.Schema ({
  itemName :{
    type: String,
    required: true
  },

  itemLocation :{
    type: Object,
    required: true
  }

});

module.exports = mongoose.model('Item', ItemSchema);


var mongoose = require('mongoose');


var ItemSchema = new mongoose.Schema ({
  itemName :{
    type: String,
    require: yes
  },

  itemLocation :{
    type: Object,
    require: yes
  }

});

module.exports = mongoose.model('Item', ItemSchema);


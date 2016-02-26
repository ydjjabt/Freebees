var mongoose = require('mongoose');

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
        required: true
    }
})

module.exprots = mongoose.model('User',UserSchema);
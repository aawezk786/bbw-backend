const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String},
    phonenumber : {type : Number,unique : true},
    email   :{type : String },
    password : {type : String},
    role : {type:String}

});

module.exports = mongoose.model('Admin', adminSchema);
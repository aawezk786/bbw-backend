const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phonenumber : {type : Number},
    password : {type : String}

});

module.exports = mongoose.model('Admin', adminSchema);
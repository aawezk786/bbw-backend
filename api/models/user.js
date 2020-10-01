const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    methods :{
        type : String,
        required : true
    },
    local: {
        name : {
            type : String
        },
        phonenumber: {
            type: Number
        },
        local_email: {
            type: String,
            lowercase : true,
            unique : true
        },
        password: { type: String}
    },
    google : {
        googleId : {
            type : Number
        },
        name : {
            type : String
        },
        phonenumber :{
            type : Number
        },
        google_email : {
            type : String,
            lowercase : true
        }
    },
    facebook : {
        facebookId : {
            type : String
        },
        name : {
            type : String
        },
        phonenumber :{
            type : Number
        },
        facebook_email : {
            type : String,
            lowercase : true
        }
    },
    isActive : {
        type : Boolean,
        default : true
    }
   
   
});

module.exports = mongoose.model('User', userSchema);
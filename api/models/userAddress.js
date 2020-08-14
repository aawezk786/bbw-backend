const mongoose = require('mongoose');

const userAddressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: {
        
        mobileNumber: { type: Number, required: true },
        pinCode: { type: Number, required: true },
        locality: { type: String, required : true},
        address: { type: String,required : true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        landmark: String,
        alternatePhoneNumber: Number
    }
});

module.exports = mongoose.model('UserAddress', userAddressSchema);
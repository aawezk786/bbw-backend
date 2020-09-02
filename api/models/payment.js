const mongoose = require('mongoose');
const subcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderid : {type : String},
    razorpay_payment_id : {type : String},
    razorpay_signature : {type : String}
    
});
module.exports = mongoose.model('Payment', subcategorySchema);
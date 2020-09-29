const mongoose = require('mongoose');
const CouponSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
   coupon_code: {type:String},
   percentage: {type:Boolean},
   coupon_amount:{type:String},
   created_at:{ type: Date, default: Date.now()},
   expiry_date:{type:Date}
    
});
module.exports = mongoose.model('Coupon', CouponSchema);
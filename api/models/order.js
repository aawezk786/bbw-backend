const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: [
        {
            orderid: { type: String },
            paymentid: { type: String },
            signature: { type: String },
            book: [{
                bookdetail: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
                units: { type: Number }
            }],
            amount: { type: Number},
            receipt : String,
            currency : {type:String,default : "INR"},
            payment_capture :{type :Number,default : 1},
            totalitems: Number,
            totalweight: Number,
            address: {
                fullname : {type :String},
                address : {type : String},
                mobilenumber : {type : String},
                city : {type : String},
                pincode : {type : String},
                state : {type : String}
            },
            isCouponApplied:{type:Boolean,default:false},
            coupon_code:{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }
        }
        
    ],
    invoiceurl: {type: String},
    shippingid: { type: Number },
    shiporderid: {type : Number},
    isPaymentCompleted : {type: Boolean,default : false},
    orderDate: { type: Date, default: Date.now() },
    isOrderCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', orderSchema);



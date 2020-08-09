const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: [
        {
            book: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
            totalprice: { type: Number, required: true},
            totalquantity: Number,
            totalweight: Number
        }
    ],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress' },
    orderDate: { type: Date, default: Date.now() },
    isOrderCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', orderSchema);
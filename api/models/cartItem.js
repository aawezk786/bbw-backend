const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart: [
        {   
            
            book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
            quantity: { type: Number, default: 1 },
            price: {type : Number},
            total: {type: Number}
        }
    ],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
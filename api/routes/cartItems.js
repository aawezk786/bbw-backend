const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const CartItem = require('../models/cartItem');
const Book = require('../models/book');
const checkAuth = require('../middleware/check-auth');






router.post('/:bookId', checkAuth, (req, res, next) => {
    const userId = req.userData.userId;
    const bookId = req.params.bookId;
    CartItem.findOne({ user: userId })
        .exec()
        .then(cartItem => {

            if (cartItem) {

                const item = cartItem.cart.find(item => item.book == req.params.bookId);
                let where, action, set;
                if (item) {
                    action = "$set";
                    where = { "user": userId, "cart.book": bookId };
                    set = "cart.$";
                } else {
                    action = "$push";
                    where = { "user": userId };
                    set = "cart"
                }

                CartItem.findOneAndUpdate(where, {
                    [action]: {
                        [set]: {
                            _id: item ? item._id : new mongoose.Types.ObjectId(),
                            book: bookId,
                            quantity: item ? (parseInt(item.quantity) + parseInt(req.query.quantity)) : req.query.quantity,
                            price: req.query.price,
                            total: item ? req.query.price * (parseInt(item.quantity) + parseInt(req.query.quantity)) : (req.query.price * req.query.quantity),
                            weight: item ? req.query.weight * (parseInt(item.quantity) + parseInt(req.query.quantity)) : (req.query.weight * req.query.quantity) / 1000
                        }
                    }
                })
                    .exec()
                    .then(newItem => {
                        res.status(201).json({
                            message: "Update Product To Cart"
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: error
                        });
                    });



            } else {
                const newCartItem = new CartItem({
                    _id: new mongoose.Types.ObjectId(),
                    user: userId,
                    cart: [
                        {
                            _id: new mongoose.Types.ObjectId(),
                            book: bookId,
                            quantity: req.query.quantity,
                            price: req.query.price,
                            total: req.query.quantity * req.query.price,
                            weight: req.query.quantity * req.query.weight / 1000
                        }
                    ]
                });

                newCartItem
                    .save()
                    .then(newCart => {
                        res.status(201).json({
                            message: "Add Product To Cart"
                        });
                    })
                    .catch(error => {
                        res.status(500).json({
                            error: error
                        });
                    });

            }

        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });

});

router.get('/User', checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    console.log(userId);
    let total = [];
    let weight = [];
    let totalweight = 0;
    let subtotal = 0;
    CartItem.find({ user: userId })
        .select('_id user cart')
        .populate('cart.book', 'book_name _id quantity selling_price weight book_img')
        .exec()
        .then(cartItems => {
            console.log(cartItems);
            if (cartItems.length > 0) {
                let count = cartItems[0].cart;


                for (var { total: prices } of count) {
                    let price = prices;
                    total.push(price)
                }
                for (let num of total) {
                    subtotal = subtotal + num
                }

                for (var { weight: weights } of count) {
                    let weight1 = weights;
                    weight.push(weight1)
                }
                for (let num1 of weight) {
                    totalweight = totalweight + num1
                }


                res.status(200).json({
                    count: count.length,
                    cartItems,
                    subtotal: subtotal,
                    totalweight : totalweight

                });



            } else {
                res.status(200).json({
                    cartItems,
                    subtotal: subtotal,
                    totalweight : totalweight
                });
            }


        }).catch(err => {
            next(err);
        });
});

router.put('/update/quantity', checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const productId = req.query.bookId;
    const quantity = req.query.quantity;
    const price = req.query.price;
    const weight = req.query.weight;

    CartItem.updateOne({ "user": userId, "cart.book": productId }, {
        $set: {
            "cart.$.quantity": quantity,
            "cart.$.total": quantity * price,
            "cart.$.weight": quantity * weight / 1000
        }
    })
        .exec()
        .then(cartItem => {
            res.status(201).json({
                message: cartItem
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });

});


router.delete('/:cartId', checkAuth, (req, res, next) => {
    const id = req.params.cartId;
    const userId = req.userData.userId
    CartItem.findOneAndUpdate({ user: userId }, { $pull: { "cart": { _id: id } } }).exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Book deleted From Cart"
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const CartItem = require('../models/cartItem');
const Book = require('../models/book');
const checkAuth = require('../middleware/check-auth');


router.post('/:bookId', checkAuth, (req, res, next) => {
    const userId = req.userData.userId;
    const bookId = req.params.bookId;
    CartItem.find({ "cart.book": bookId, user: userId })
    .exec()
        .then(result => {
            if (result != 0) {
                
                const quantity = result[0].cart[0].quantity + 1;
                console.log(quantity)
                const myquery = { "cart.book": bookId, user: userId };
                const newvalue = { $inc: { "cart.$.quantity": 1 } ,$set : {"cart.$.total" : quantity * req.query.selling_price} };
                Book.find({ _id: bookId }).then(results => {

                    


                    if (results[0].quantity >= quantity) {

                        CartItem.updateOne(myquery, newvalue)
                            .then(results => {
                                console.log(results);
                                res.status(200).json({
                                    message: "quantity updated",
                                    data: results

                                });
                            }).catch(err => {
                                res.json({
                                    error: err
                                })
                            });
                    }
                     else 
                     {
                        res.json({
                            message: "Out Of Stock"

                        });
                    }
                }).catch(err => {
                    next(err);
                });



            } else {
                const cartItem = new CartItem({
                    _id: mongoose.Types.ObjectId(),
                    user: userId,
                    cart: [
                        {
                            book: bookId,
                            quantity: req.query.quantity,
                            price: req.query.selling_price,
                            total: req.query.quantity * req.query.selling_price
                        }
                    ]
                });
                cartItem.save()
                    .then(result => {
                        console.log(result);
                        return res.status(200).json({
                            message: "Product Added To Cart",
                            docs: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
            }
        })
        .catch(err =>{
            next(err);
        });

});


router.get('/', (req, res, next) => {
    CartItem.find({}).populate('user cart.book').exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                cart: result
            });
        })
        .catch(err => {
            next(err);
        });
});






module.exports = router;
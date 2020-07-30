const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const CartItem = require('../models/cartItem');
const checkAuth = require('../middleware/check-auth');


router.post('/add',checkAuth, (req, res, next) => {
  
   
            const newCartItem = new CartItem({
                _id: new mongoose.Types.ObjectId(),
                user: req.body.user,
                cart: [
                    {
                        _id: new mongoose.Types.ObjectId(),
                        book: req.body.book,
                        quantity: req.body.quantity,
                        price: req.body.price,
                        total: req.body.total
                    }
                ]
            });
            newCartItem.save()
            .then(result =>{
                res.status(200).json(result);
            })
            .catch(err =>{
                res.status(500).json({
                    error : err
                });
            });
       
  
  

});



module.exports = router;
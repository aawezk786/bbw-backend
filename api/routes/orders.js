const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const CartItem = require('../models/cartItem');
const UserAddress = require('../models/userAddress');
const checkAuth = require('../middleware/check-auth');


router.post('/create', checkAuth, (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        order: req.body.order,
        address: req.body.address
    });

    order.save()
    .then(order => {

        CartItem.remove({"user": req.userData.userId})
        .exec()
        .then(doc => {
            res.status(201).json({
                message: order
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        })


        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    })
})

router.get('/getorders',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    Order.find({"user": userId})
    .select('address order orderDate  isOrderCompleted')
    .populate('order.book', 'book_name selling_price weight')
    .exec()
    .then(orders => {

        UserAddress.findOne({"user": userId})
        .exec()
        .then(userAddress => {

            const orderWithAddress = orders.map(order => {
                const address = userAddress.address.find(userAdd => order.address.equals(userAdd._id));
                return {
                    _id: order._id,
                    order: order.order,
                    address: address,
                    orderDate: order.orderDate,
                    isOrderComleted: order.isOrderComleted
                }
            });

            res.status(200).json({
                message: orderWithAddress
            });

        })
        .catch(error => {
            return res.status(500).json({
                error: error
            })
        })

        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });

});


// cron.schedule('* * * * *', () => {
//     request.post(options, (err, res, body) => {
//         if (err) {
//             return console.log(err);
//         }
//         console.log(`Status: ${res.statusCode}`);
//         console.log(body.token);
//         shiprocketToken = body.token;
//         console.log(shiprocketToken)
//     });
//   });


module.exports = router;
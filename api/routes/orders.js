const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const CartItem = require('../models/cartItem');
const UserAddress = require('../models/userAddress');
const checkAuth = require('../middleware/check-auth');
const Coupon = require('../models/coupon');
var cron = require('node-cron');
const request = require('request');
let shiprocketToken;
const options = {
    url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
    json: true,
    method: 'POST',
    body: 
    {
        email: 'aawezk786@gmail.com',
        password: 'aawez123'
    }
    // {
    //     email: 'zewaa99@gmail.com',
    //     password: 'Aawez@123123'
    // }
};
var crypto = require('crypto');
var Razorpay = require('razorpay');
let instance = new Razorpay({
    // key_id: 'rzp_live_Ztkdvk7oPSuPCy', 
    // key_secret: 'ooHzXexh9cIX2wXnZbVt3wg1' 
    key_id: 'rzp_test_ImeRpaCPi1JD7v', 
    key_secret: 'TpJ7W7kEA7NuwqtPwno8NQhl' 
  })
  request.post(options, (err, res, body) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Status: ${res.statusCode}`);
    shiprocketToken = body.token;
});

router.post('/create', (req, res, next) => {
    var params = {
                amount: req.query.amount * 100,  
                currency: "INR",
                receipt: req.query.userId,
                payment_capture: '1'
              };
              instance.orders.create(params).then(data=>{
                console.log(data)
               return res.json({'sub':data,"status":"success","token" : shiprocketToken});
            }).catch(error =>{
                console.log(error)
                res.send({"sub":error,"status": "failed"})
            });
})

router.post('/verify', checkAuth, (req, res, next) => {
    let order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        order: [{
            orderid: req.query.razorpay_order_id,
            paymentid: req.query.razorpay_payment_id,
            signature: req.query.razorpay_signature,
            book: req.body.book,
            amount: req.body.amount,
            totalitems: req.body.totalitems,
            totalweight: req.body.totalweight,
            address: {
                fullname: req.body.fullname,
                mobilenumber: req.body.mobilenumber,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                state: req.body.state
            },
            isCouponApplied: req.body.isCouponApplied,
            coupon_code: req.body.coupon_code
        }],
        isPaymentCompleted: "true"
    })
    body = req.query.razorpay_order_id + "|" + req.query.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', 'TpJ7W7kEA7NuwqtPwno8NQhl')
        .update(body.toString())
        .digest('hex');
    console.log("sig" + req.query.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { "status": "failure" }
    if (expectedSignature === req.query.razorpay_signature) {
        order.save()
            .then(data => {
                Coupon.findOneAndUpdate({ _id: req.body.coupon_code }, { $push: { "user": req.userData.userId } }).exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Order Has been Placed"
                        })
                    })
                    .catch(err => {
                        next(err)
                    });
            })
            .catch(err => {
                next(err)
            });
    } else {
        res.send(response);
    }
});


router.get('/getorders',checkAuth, (req, res, next) => {
    const val = false;
    const userId = req.userData.userId;
    Order.find({"user": userId})
    .select('order  isOrderCompleted orderDate isPaymentCompleted shippingid shiporderid')
    .populate('order.book.bookdetail', 'book_name selling_price weight sku')
    .populate('user')
    .exec()
    .then(orders => {
                let orderWithAddress = orders.map(order => {
                    return {
                        _id: order._id,
                        user :   order.user._id,
                        order_items: order.order[0].book,
                        orderid : order.order[0].orderid,
                        paymentid : order.order[0].paymentid,
                        amount : order.order[0].amount,
                        address: order.order[0].address,
                        orderDate: order.orderDate,
                        isOrderComleted: order.isOrderCompleted,
                        isPaymentCompleted: order.isPaymentCompleted,
                        shiporderid : order.shiporderid,
                        shippingid : order.shippingid
                    }
                })
                res.status(200).json(
                    orderWithAddress
                );
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });
});
router.post('/updateorder/:orderid', (req,res,next) => {
    Order.find({"order.orderid" : req.params.orderid})
    .then(data =>{
        const myquery = {"order.orderid" : req.params.orderid};
        const newvalue = { $set : {"shippingid" : req.query.shippingid,"shiporderid" : req.query.shiporderid}}; 
        Order.updateOne(myquery,newvalue)
        .then(data =>{
            CartItem.deleteOne({user : req.query.userId})
            .then(doc => {doc}).catch(err=>{next(err)});
            res.json({
                message : "Order Updated SuccessFull",
            })
        })
        .catch(err=>{
            next(err)
        });
    })
    .catch(err=>{
        next(err)
    });
});

router.get('/getorderbyid/:orderid', (req, res, next) => {
    Order.find({"order.orderid": req.params.orderid})
    .select('order  isOrderCompleted orderDate isPaymentCompleted shiporderid shippingid')
    .populate('order.book.bookdetail', 'book_name selling_price weight sku')
    .populate('user')
    .exec()
    .then(orders => {
                let orderWithAddress = orders.map(order => {
                    return {
                        _id: order._id,
                        user :   order.user._id,
                        order_items: order.order[0].book,
                        orderid : order.order[0].orderid,
                        paymentid : order.order[0].paymentid,
                        amount : order.order[0].amount,
                        address: order.order[0].address,
                        orderDate: order.orderDate,
                        isOrderComleted: order.isOrderCompleted,
                        isPaymentCompleted: order.isPaymentCompleted,
                        shiporderid : order.shiporderid,
                        shippingid : order.shippingid
                    }
                })
                res.status(200).json(
                    orderWithAddress
                );
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });
});
router.get('/getallorders', (req, res, next) => {
    const val = false;
    Order.find()
    .select('order  isOrderCompleted isPaymentCompleted orderDate shiporderid shippingid')
    .populate('order.book.bookdetail', 'book_name sku selling_price weight')
    .populate('user')
    .exec()
    .then(orders => {
        let orderWithAddress = orders.map(order => {
            return {
                _id: order._id,
                user :   order.user._id,
                order_items: order.order[0].book,
                orderid : order.order[0].orderid,
                paymentid : order.order[0].paymentid,
                amount : order.order[0].amount,
                address: order.order[0].address,
                orderDate: order.orderDate,
                isOrderComleted: order.isOrderCompleted,
                isPaymentCompleted: order.isPaymentCompleted,
                shiporderid : order.shiporderid,
                shippingid : order.shippingid
            }
        })
        res.status(200).json(
            orderWithAddress
        );
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });
});
// cron.schedule('* * * * * *', () => {
//     request.post(options, (err, res, body) => {
//         if (err) {
//             return console.log(err);
//         }
//         console.log(`Status: ${res.statusCode}`);
//         shiprocketToken = body.token;
//         console.log(shiprocketToken);
//     });
//   });
module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const CartItem = require('../models/cartItem');
const UserAddress = require('../models/userAddress');
const checkAuth = require('../middleware/check-auth');
var cron = require('node-cron');
const request = require('request');
let shiprocketToken;
const options = {
    url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
    json: true,
    method: 'POST',
    body: {
        email: 'aawezk786@gmail.com',
        password: 'aawez123'
    }
};

var crypto = require('crypto');
var Razorpay = require('razorpay');

let instance = new Razorpay({
    key_id: 'rzp_test_wsDPvMUuPkTgca', // your `KEY_ID`
    key_secret: 'Y4xVb0hA2BcQUDldBa15b8Tl' // your `KEY_SECRET`
  })




router.post('/create', checkAuth, (req, res, next) => {
    var order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        order: req.body.order,
        address: "5f2e650e1935c41df451684e"
    });
   
    
    order.save()
    .then( order => {
        
        
            var params = {
                amount: order.order[0].amount * 100,  
                currency: "INR",
                receipt: req.userData.userId,
                payment_capture: '1'
              };
              instance.orders.create(params).then(data=>{
                console.log(data)
               return res.send({'sub':data,"status":"success"});
            }).catch(error =>{
                console.log(error)
                res.send({"sub":error,"status": "failed"})
            });
       
     


        CartItem.deleteOne({"user": req.userData.userId})
        .exec()
        .then(doc => {doc})
        .catch(error => {
         next(error)
        })


        
    })
    .catch(error => {
       next(error)
    })

   
})

router.post('/verify',(req,res)=>{
    // var options = {
    //     "key_id": "rzp_test_wsDPvMUuPkTgca",  //Enter your razorpay key
    //     "key_secret" : "Y4xVb0hA2BcQUDldBa15b8Tl",
    //     "currency": "INR",
    //     "name": "Razor Tutorial",
    //     "description": "Razor Test Transaction",
    //     "image": "https://previews.123rf.com/images/subhanbaghirov/subhanbaghirov1605/subhanbaghirov160500087/56875269-vector-light-bulb-icon-with-concept-of-idea-brainstorming-idea-illustration-.jpg",
    //     "order_id": 'order_FP3MqLlhgPNsos',
    //     "handler": {
    //        "razorpay_order_id" : "order_FP3MqLlhgPNsos",
    //         "razorpay_signature": "6a0ee7d5284fcefa81d46a125693fa6710e4cd204b2c0f57f14bc5e870ee3c60"
    //     }
    
    //     ,
    //     "theme": {
    //         "color": "#227254"
    //     }
    // };
    // var rzp1 = new Razorpay(options);
    
    body='order_FP3MqLlhgPNsos' + "|" + req.body.razorpay_payment_id;
var expectedSignature = crypto.createHmac('sha256', 'Y4xVb0hA2BcQUDldBa15b8Tl')
                                .update(body.toString())
                                .digest('hex');
                                console.log("sig"+"6a0ee7d5284fcefa81d46a125693fa6710e4cd204b2c0f57f14bc5e870ee3c60");
                                console.log("sig"+expectedSignature);
var response = {"status":"failure"}
if(expectedSignature === '6a0ee7d5284fcefa81d46a125693fa6710e4cd204b2c0f57f14bc5e870ee3c60')
 response={"status":"success"}
   return res.send(response);
    
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
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Payment = require('../models/payment');
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




router.post('/create', checkAuth, (req, res, next) => {
    let order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        order: [{
           book : req.body.book,
           amount : req.body.amount,
           totalitems: req.body.totalitems,
           totalweight: req.body.totalweight,
           address: req.query.address
        }],
        
    });
   
    let amount = req.body.amount;
    console.log(amount)
    order.save()
    .then( order => {
        
        
            var params = {
                amount: amount * 100,  
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
       
     


        // CartItem.deleteOne({"user": req.userData.userId})
        // .exec()
        // .then(doc => {doc})
        // .catch(error => {
        //  next(error)
        // })


        
    })
    .catch(error => {
       next(error)
    })

   
})

router.post('/verify' ,(req,res)=>{
    const payment = new Payment({
        _id : new mongoose.Types.ObjectId(),
        user : req.query.userId,
        razorpay_order_id : req.query.razorpay_order_id,
        razorpay_payment_id : req.query.razorpay_payment_id,
        razorpay_signature : req.query.razorpay_signature
    });
        payment.save()
        .then(payment => {
            const myquery = {user :  req.query.userId};
        const newvalue = { $set : {isPaymentCompleted : "true"}};
        Order.updateOne(myquery,newvalue)
        .then(data =>{
            body = req.query.razorpay_order_id + "|" + req.query.razorpay_payment_id;
            var expectedSignature = crypto.createHmac('sha256', 'TpJ7W7kEA7NuwqtPwno8NQhl')
                .update(body.toString())
                .digest('hex');
            console.log("sig" + req.query.razorpay_signature);
            console.log("sig" + expectedSignature);
            var response = { "status": "failure" }
            if (expectedSignature === req.query.razorpay_signature)
                response = { "status": "success" }
            res.send(response);
        })
        .catch(error => {
            next(error);
        });
        })
        .catch(err=>{
            next(err)
        });
            

         CartItem.deleteOne({"user": req.query.userId})
        .exec()
        .then(doc => {doc})
        .catch(error => {
         next(error)
        })
    
});

router.get('/getorders',checkAuth, (req, res, next) => {
    const val = false;
    const userId = req.userData.userId;
    Order.find({"user": userId,"isOrderCompleted" : val})
    .select('order  isOrderCompleted orderDate')
    .populate('order.book', 'book_name selling_price weight')
    .populate('user' , ' _id')
    .exec()
    .then(orders => {
        console.log(orders)
        UserAddress.find({"user": userId})
        .exec()
        .then(userAddress => {
            console.log(userAddress)
            let orderWithAddress = orders.map(order => {
                console.log(order)
                let address = userAddress.address.find(userAdd => order.order[0].address.equals(userAdd._id));
                return {
                    _id: order._id,
                    order: order.order,
                    address: address,
                    orderDate: order.orderDate,
                    isOrderComleted: order.isOrderCompleted
                }
            });

            res.status(200).json({
                orderDetails : orderWithAddress
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

router.get('/getallorders',checkAuth, (req, res, next) => {
    const val = false;
    const userId = req.userData.userId;
    Order.find({"isOrderCompleted" : val})
    .select('order  isOrderCompleted orderDate')
    .populate('order.book', 'book_name selling_price weight')
    .populate('user' , 'local.name local.local_email local.phonenumber _id')
    .exec()
    .then(orders => {
        UserAddress.findOne({})
        .exec()
        .then(userAddress => {
            let orderWithAddress = orders.map(order => {
                
                let address = userAddress.address.find(userAdd => order.order[0].address.equals(userAdd._id));
                return {
                    _id: order._id,
                    order: order.order,
                    address: address,
                    orderDate: order.orderDate,
                    isOrderComleted: order.isOrderCompleted
                }
            });

            res.status(200).json({
                orderDetails : orderWithAddress
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
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




router.post('/create', (req, res, next) => {
            var params = {
                amount: req.query.amount * 100,  
                currency: "INR",
                receipt: req.query.userId,
                payment_capture: '1'
              };
              instance.orders.create(params).then(data=>{
                console.log(data)
               return res.send({'sub':data,"status":"success"});
            }).catch(error =>{
                console.log(error)
                res.send({"sub":error,"status": "failed"})
            });
})

router.post('/verify', checkAuth, (req,res)=>{
    let order = new Order({
        _id : new mongoose.Types.ObjectId(),
        user : req.userData.userId,
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
                mobilenumber : req.body.mobilenumber,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                state: req.body.state
            }
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
            if (expectedSignature === req.query.razorpay_signature){
               order.save()
               .then(data=>{
                   res.status(200).json({
                       message : "Order Has been Placed",
                       token : shiprocketToken
                   })
                // const optionShip ={
                //     url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
                //     json: true,
                //     method: 'POST',
                //     body :{
                //     order_id: req.query.razorpay_order_id,
                //     order_date: Date.now(),
                //     pickup_location: "pickup",
                //     channel_id: "",
                //     comment: "Reseller: M/s Goku",
                //     billing_customer_name: req.body.fullname,
                //     billing_last_name: "",
                //     billing_address: "House 221B, Leaf Village",
                //     billing_address_2: "Near Hokage House",
                //     billing_city: "New Delhi",
                //     billing_pincode: "110002",
                //     billing_state: "Delhi",
                //     billing_country: "India",
                //     billing_email: "aawez@gmail.com",
                //     billing_phone: "8108481831",
                //     shipping_is_billing: true,
                //     shipping_customer_name: "",
                //     shipping_last_name: "",
                //     shipping_address: "",
                //     shipping_address_2: "",
                //     shipping_city: "",
                //     shipping_pincode: "",
                //     shipping_country: "",
                //     shipping_state: "",
                //     shipping_email: "",
                //     shipping_phone: "",
                //     order_items: [
                //       {
                //         name: "Kunai",
                //         sku: "chakra123",
                //         units: 1,
                //         selling_price: "90",
                //         discount: "",
                //         tax: "",
                //         hsn: 441122
                //       }
                //     ],
                //     payment_method: "Prepaid",
                //     shipping_charges: 0,
                //     giftwrap_charges: 0,
                //     transaction_charges: 0,
                //     total_discount: 0,
                //     sub_total: 90,
                //     length: 10,
                //     breadth: 15,
                //     height: 20,
                //     weight: 2.5
                //     }
                    
                // }
                // request.post(options, (err, res, body) => {
                //     if (err) {
                //         return console.log(err);
                //     }
                    
                    
                // });
                   
                  
               })
               .catch();
            }else{
                res.send(response);
            }
                
         CartItem.deleteOne({"user": req.userData.userId})
        .exec()
        .then(doc => {doc})
        .catch(error => {
         next(error)
        })





    // const payment = new Payment({
    //     _id : new mongoose.Types.ObjectId(),
    //     user : req.query.userId,
    //     razorpay_order_id : req.query.razorpay_order_id,
    //     razorpay_payment_id : req.query.razorpay_payment_id,
    //     razorpay_signature : req.query.razorpay_signature
    // });
    //     payment.save()
    //     .then(payment => {
    //         const myquery = {user :  req.query.userId,"order._id" : "5f48ca6177e85c0018c6f5d7"};
    //     const newvalue = { $set : {isPaymentCompleted : "true"}};
    //     Order.updateOne(myquery,newvalue)
    //     .then(data =>{
    //         body = req.query.razorpay_order_id + "|" + req.query.razorpay_payment_id;
    //         var expectedSignature = crypto.createHmac('sha256', 'TpJ7W7kEA7NuwqtPwno8NQhl')
    //             .update(body.toString())
    //             .digest('hex');
    //         console.log("sig" + req.query.razorpay_signature);
    //         console.log("sig" + expectedSignature);
    //         var response = { "status": "failure" }
    //         if (expectedSignature === req.query.razorpay_signature)
    //             response = { "status": "success" }
    //         res.send(response);
    //     })
    //     .catch(error => {
    //         next(error);
    //     });
    //     })
    //     .catch(err=>{
    //         next(err)
    //     });
            

       
    
});

router.get('/getorders',checkAuth, (req, res, next) => {
    const val = false;
    const userId = req.userData.userId;
    Order.find({"user": userId})
    .select('order  isOrderCompleted orderDate isPaymentCompleted')
    .populate('order.book', 'book_name selling_price weight sku')
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
                        isPaymentCompleted: order.isPaymentCompleted
                    }
                })
                res.status(200).json(
                    orderWithAddress
                );
        // UserAddress.find({"user": userId})
        // .exec()
        // .then(userAddress => {
        //     console.log(userAddress)
        //     let orderWithAddress = orders.map(order => {
        //         console.log(order)
        //         let address = userAddress.address.find(userAdd => order.order[0].address.equals(userAdd._id));
        //         return {
        //             _id: order._id,
        //             order: order.order,
        //             address: address,
        //             orderDate: order.orderDate,
        //             isOrderComleted: order.isOrderCompleted
        //         }
        //     });
        //     res.status(200).json({
        //         orderDetails : orderWithAddress
        //     });
        // })
        // .catch(error => {
        //     return res.status(500).json({
        //         error: error
        //     })
        // })
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
    Order.find()
    .select('order  isOrderCompleted isPaymentCompleted orderDate')
    .populate('order.book', 'book_name selling_price weight')
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
                isPaymentCompleted: order.isPaymentCompleted
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




cron.schedule('* * * * *', () => {
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        shiprocketToken = body.token;
        console.log(shiprocketToken);
    });
  });


module.exports = router;
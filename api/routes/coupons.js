const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
var cron = require('node-cron');
const request = require('request');


router.post('/AddCoupon', (req, res, next) => {
    const coupon = new Coupon({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        coupon_code: req.body.coupon_code,
        percentage: req.body.percentage,
        coupon_amount: req.body.coupon_amount,
        expiry_date: req.body.expiry_date
    });
    coupon.save()
        .then(coupon => {
            return res.status(201).json({
                message: 'Coupon was created',
                details: coupon
            });
        })
        .catch(error => {
            next(error);
        });
});

router.get('/getAll', (req,res,next)=>{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let dates = year + "-" + month + "-" + date;
  console.log(dates)
    Coupon.find({expiry_date : {$ne: dates}}).populate('user')
    .exec()
    .then(docs =>{
        if(docs.length >= 0){
            res.status(200).json(docs);
        }else{
            res.status(404).json({
                message : "No Coupon Found"
            });
        }
    })
    .catch(err =>{
        next(err);
    });
});

router.get('/getAllUser',checkAuth, (req,res,next)=>{
  let user = req.userData.userId;
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let dates = year + "-" + month + "-" + date;
    Coupon.find()
    .exec()
    .then(docs =>{
        Coupon.find({user : { $ne: user },expiry_date : {$ne: dates}})
        .then(doc=>{
            if(doc.length >=0){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message : "No Coupon Found"
            });
        }
        })
    })
    .catch(err =>{
        next(err);
    });
});

router.get('/getById/:couponId', (req,res,next)=>{
    Coupon.find({_id : req.params.couponId})
    .exec()
    .then(docs =>{
        if(docs.length >=0){
            res.status(200).json(docs);
        }else{
            res.status(404).json({
                message : "Coupon Has Been Expired"
            });
        }
    })
    .catch(err =>{
        next(err);
    });
});



module.exports = router;
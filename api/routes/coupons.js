const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');
const mongoose = require('mongoose');

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



module.exports = router;
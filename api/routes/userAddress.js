const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const UserAddress = require('../models/userAddress');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.post('/new-address', checkAuth, (req, res, next) => {
    const userId = req.userData.userId;
    UserAddress.findOne({"user": userId})
    .exec()
    .then(user => {

        if(user){

            UserAddress.findOneAndUpdate({"user": userId}, {
                $push: {
                    "address": req.body.address
                }
            }, {
                new: true
            })
            .then(doc => {
                res.status(201).json({
                    message: doc
                });
            });

        }else{

            const userAddress = new UserAddress({
                _id: new mongoose.Types.ObjectId(),
                user: userId,
                address: req.body.address
            });

            userAddress.save()
            .then(doc => {
                res.status(201).json({
                    message: doc
                });
            })
            .catch(error => {
                res.status(500).json({
                    error: error
                });
            })

        }

    });

});


router.get('/get-addresses', checkAuth, (req, res, next) => {

    UserAddress.findOne({"user": req.userData.userId})
    .select('_id user address')
    .populate('user')
    .exec()
    .then(user => {
        if(user != null){
            res.status(200).json(
                user
            )
        }else{
            res.status(404).json("Address Not Found")
        }
        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })

});


router.put('/address/:addressId',checkAuth,(req,res,next)=>{
    UserAddress.find({"user": req.userData.userId})
    .then(result=>{
        UserAddress.update({"address._id": req.params.addressId },{
            address : req.body.address
        },(err,docs)=>{
            if (err) {
                res.status(500).json({
                    error: err
                });
            } else {
                res.status(200).json({
                    message: "Updated Success",
                    docs
                });
            }
        })
       
    })
    .catch(err=>{
        next(err)
    })
});

module.exports = router;
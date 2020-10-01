const mongoose = require('mongoose')
const UserAddress = require('../models/userAddress');
const Order = require('../models/order');

exports.addAddress =(req, res, next) => {
    const userId = req.userData.userId;
    UserAddress.findOne({"user": userId})
    .exec()
    .then(result => {

        if(result){
            let item = result.address.find(item => item._id == req.query.add);
            let where, action, set;
            if (item) {
                action = "$set";
                where = { "user": userId, "address._id": req.query.add };
                set = "address.$";
            } else {
                action = "$push";
                where = { "user": userId };
                set = "address"
            }
            UserAddress.findOneAndUpdate(where, {
                [action]: {
                    [set]: {
                        _id: item ? item._id : new mongoose.Types.ObjectId(),
                        mobileNumber: req.body.mobileNumber,
                        email : req.body.email,
                        pinCode:   req.body.pinCode,
                        fullName: req.body.fullName,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        landmark: req.body.landmark,
                        alternatePhoneNumber: req.body.alternatePhoneNumber
                    }
                }
            })
                .exec()
                .then(newItem => {
                    res.status(201).json({
                        message: "Update Address"
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        message: error
                    });
                });
       
            
        }else{

            const userAddress = new UserAddress({
                _id: new mongoose.Types.ObjectId(),
                user: userId,
                address: {
                    mobileNumber : req.body.mobileNumber,
                    email : req.body.email,
                    pinCode : req.body.pinCode,
                    fullName : req.body.fullName,
                    address : req.body.address,
                    city : req.body.city,
                    state : req.body.state,
                    landmark : req.body.landmark,
                    alternatePhoneNumber : req.body.alternatePhoneNumber
                }
            });
            
            userAddress.save()
            .then(doc => {
                res.status(201).json({
                    message: doc
                });
            })
            .catch(error => {
              next(error);
            })

        }

    });

}


exports.getAddByUser =(req, res, next) => {

    UserAddress.findOne({"user": req.userData.userId})
    .select('_id user address' )
    .populate('user')
    .exec()
    .then(user => {
        if(user != null){
            res.status(200).json(
                user
            )
        }else{
            res.status(200).json({address : []})
        }
        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })

}




exports.add_delete = (req, res, next) => {
   
    const id = req.params.add;
    const userId = req.userData.userId
    UserAddress.findOneAndUpdate({ user: userId }, { $pull: { "address": { _id: id } } }).exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Address deleted Successfully"
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.getUserDetails =async (req, res, next) => {
let order =await Order.find({"user" : req.params.userId})
.populate('order.book.bookdetail', '_id final_price sale_price book_name Isbn_no')
.populate('order.coupon_code','coupon_code coupon_amount expiry_date')
.exec();
   await UserAddress.findOne({"user": req.params.userId})
    .select('_id user address' )
    .populate('user')
    .exec()
    .then(user => {
        if(user != null){
            res.status(200).json({
                userDetails : user,
                orders: order,
                totalOrder : order.length
            })
        }else{
            res.status(200).json({address : [],orders : order})
        }
        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })

}
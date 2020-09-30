const mongoose = require('mongoose')
const UserAddress = require('../models/userAddress');


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
            res.status(404).json({address : []})
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
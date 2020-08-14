const mongoose = require('mongoose')
const UserAddress = require('../models/userAddress');


exports.addAddress =(req, res, next) => {
    const userId = req.userData.userId;
    UserAddress.findOne({"user": userId})
    .exec()
    .then(user => {

        if(user){

        res.json("Address Already Present");
            
        }else{

            const userAddress = new UserAddress({
                _id: new mongoose.Types.ObjectId(),
                user: userId,
                
                    mobileNumber : req.body.mobileNumber,
                    pinCode : req.body.pinCode,
                    locality : req.body.locality,
                    address : req.body.address,
                    city : req.body.city,
                    state : req.body.state,
                    landmark : req.body.landmark,
                    alternatePhoneNumber : req.body.alternatePhoneNumber
                
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
            res.status(404).json("Address Not Found")
        }
        
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })

}


exports.EditAdd = (req,res,next)=>{
    UserAddress.find({"user": req.userData.userId})
    .then(result=>{
        console.log(result)
        UserAddress.updateOne({ "user": req.userData.userId },
            {   
                "address.mobileNumber" : req.body.mobileNumber,
                "address.pinCode" : req.body.pinCode,
                "address.locality" : req.body.locality,
                "address.address" : req.body.address,
                "address.city": req.body.city,
                "address.state": req.body.state,
                "address.landmark": req.body.landmark,
                "address.alternatePhoneNumber": req.body.alternatePhoneNumber
            
            }, (err, docs) => {
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
        // UserAddress.update({"address._id": req.params.addressId },{
        //     address : {
        //         mobileNumber : req.body.mobileNumber,
        //         pinCode : req.body.pinCode,
        //         locality : req.body.locality,
        //         address : req.body.address,
        //         city : req.body.city,
        //         state : req.body.state,
        //         landmark : req.body.landmark,
        //         alternatePhoneNumber : req.body.alternatePhoneNumber
        //     }
        // },(err,docs)=>{
        //     if (err) {
        //         res.status(500).json({
        //             error: err
        //         });
        //     } else {
        //         res.status(200).json({
        //             message: "Updated Success",
        //             docs
        //         });
        //     }
        // })
       
    })
    .catch(err=>{
        next(err)
    })
}

exports.add_delete = (req, res, next) => {
    const id = req.userData.userId;
    UserAddress.deleteOne({ "user": id }).exec()
        .then(result => {
            res.status(200).json({
                message: "Address deleted Successfully",
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
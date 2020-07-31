const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../../config');
const client = require('twilio')(config.ACCOUNT_SID, config.AUTH_TOKEN);
const jwt = require('jsonwebtoken');



exports.user_signup = (req, res, next) => {
    User.find({ "local.phonenumber": req.body.phonenumber}).exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json(
                    "Phonenumber already Exist"
                );
            } else {
               
                        client
                            .verify
                            .services(config.SERVICE_ID)
                            .verifications
                            .create({
                                to: `+91${req.body.phonenumber}`,
                                channel: "sms"
                            }).then(data =>{
                               res.status(200).json(
                               "Verification Sent Successfully"
                                
                               );
                            }).catch(err =>{
                                res.status(400).json("Check Phonenumber");
                            });

                       
                    }

                
           
        });
}


exports.user_login = (req, res, next) => {
   
    User.find({  "local.phonenumber": req.body.phonenumber })
        .exec()
        .then(user => {
            console.log(user)
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].local.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        name : user[0].local.name,
                        email: user[0].local.local_email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "8d"
                        });
                    return res.status(200).json({
                        message: "Auth Successfull",
                        token: token
                    });
                }
                return res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}


exports.getall_users = (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            if (docs.length >= 0) {
                res.status(200).json({
                    count : docs.length,
                    users : docs
                });
            } else {
                res.status(404).json({
                    message: "No Entry Found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.verification = (req, res, next) => {

    if (req.query.phonenumber && (req.query.code).length === 6) {
        client
            .verify
            .services(config.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+91${req.query.phonenumber}`,
                code: req.query.code
            }).then(data => {
                if (data.status === "approved") {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        methods : 'local',
                        local : {
                            name : req.body.name,
                            phonenumber: req.query.phonenumber,
                            local_email: req.body.email,
                            password: hash
                        }
                       
                    });
                    user.save()
                        .then(result => {
                            console.log(result);
                            return res.status(201).json({
                                message: 'Register Successfull'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })
                        });
                    }
                    });
                }else{
                    res.status(400).json(
                        "Verification Failed"
                    );
                }
            }).catch(err=>{
                res.status(401).json(
                     "Otp Expired"
                );
            });
       
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phonenumber: req.query.phonenumber

        })
    }
}

//not working update
exports.updateUser = (req, res, next) => {
    const id = req.params.UserId;
    User.update({ _id: id },
        {   
            name : req.body.name,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
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
}


exports.user_delete = (req, res, next) => {
    const id = req.params.UserId;
    User.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted Successfully",
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.sendOtp = (req,res,next) =>{
    User.find({"local.phonenumber" : req.params.Phone})
    .exec()
    .then(user => {
        console.log(user)
        if(user.length > 0){
            client
            .verify
            .services(config.SERVICE_ID)
            .verifications
            .create({
                to : `+91${req.params.Phone}`,
                channel : "sms"
            })
            .then(result =>{
                res.status(200).json(result)
            })
            .catch(err =>{
                res.status(500).json({
                    error :  err
                });
            });
            
        }else{
            res.status(404).json(

                 "phonenumber doesnt exist"
            );
        }
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    });
}

exports.resendOtp = (req,res,next) =>{
  
            client
            .verify
            .services(config.SERVICE_ID)
            .verifications
            .create({
                to : `+91${req.params.Phone}`,
                channel : "sms"
            })
            .then(result =>{
                res.status(200).json("OTP SEND SUCCESSFULLY")
            })
            .catch(err =>{
                res.status(500).json({
                    error :  err
                });
            });
            
}

exports.forgetpw = (req, res, next) => {

    if (req.query.phonenumber && (req.query.code).length === 6) {
        client
            .verify
            .services(config.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+91${req.query.phonenumber}`,
                code: req.query.code
            })  .then(data => {
                if (data.status === "approved") {
                    bcrypt.hash(req.query.password, 10, (err, hash) => {
                            if(err){
                                return res.status(500).json({
                                    error: err
                                })
                            }
                            else{
                                const myquery = { "local.phonenumber" : req.query.phonenumber };
                                const newvalue = { $set: { "local.password" : hash} };
                                User.updateOne(myquery, newvalue)
                                    .then(data => {
                                        const user = data;
                                        res.status(200).json({
                                            message: "Password Change Successfully"
                                            
                                        })
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            error1: err
                                        })
                                    });
                            }
                        });
                
                }else{
                    res.status(401).json(
                        "Verification Failed1"
                        
                    );
                }
            }).catch(err=>{
                res.status(401).json(
                     "Verification Failed"
                    
                );
            });
              
       
    } else {
        res.status(400).send(
           "Wrong phone number or code :("
            

        );
    }
}


exports.loginGoogle = (req,res,next) =>{
    User.find({ 'google.googleId' : req.query.googleId})
    .then(result => {
        
        if(result.length > 0){
            const token1 = jwt.sign({
                googleId : result[0].google.googleId,
                name : result[0].google.name,
                email: result[0].google.google_email,
                userId: result[0]._id
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "8d"
                });

                res.json({
                    message : "User Already Exist",
                    token : token1
                });

        }else{
             const user = new User({
                _id : mongoose.Types.ObjectId(),
                methods : 'google',
                google : {
                    googleId : req.query.googleId,
                    name : req.query.name,
                    google_email : req.query.email
                }
            });
            console.log(user);
            user.save()
            .then(user =>{
                const token = jwt.sign({
                    googleId : user.google.googleId,
                    name : user.google.name,
                    email: user.google.google_email,
                    userId: user._id
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "8d"
                    });
    
                    res.status(200).json({
                        message : "Success",
                        token : token
                    });
                
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error : err
                });
            });

        }
    }).catch(err =>{
        res.status(401).json({
            error : err
        });
    });
           
            
    
}



exports.loginFacebook = (req,res,next) =>{
    User.find({ 'facebook.facebookId' : req.query.facebookId})
    .then(result => {
        
        if(result.length > 0){
            const token1 = jwt.sign({
                facebookId : result[0].facebook.facebookId,
                name : result[0].facebook.name,
                email: result[0].facebook.facebook_email,
                userId: result[0]._id
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "8d"
                });

                res.json({
                    message : "User Already Exist",
                    token : token1
                });

        }else{
             const user = new User({
                _id : mongoose.Types.ObjectId(),
                methods : 'facebook',
                facebook : {
                    facebookId : req.query.facebookId,
                    name : req.query.name,
                    facebook_email : req.query.email
                }
            });
            console.log(user);
            user.save()
            .then(user =>{
                const token = jwt.sign({
                    facebookId : user.google.facebookId,
                    name : user.facebook.name,
                    email: user.facebook.facebook_email,
                    userId: user._id
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "8d"
                    });
    
                    res.status(200).json({
                        message : "Success",
                        token : token
                    });
                
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error : err
                });
            });

        }
    }).catch(err =>{
        res.status(401).json({
            error : err
        });
    });
           
            
    
}
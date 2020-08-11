const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

router.post('/login', (req,res,next)=>{
    Admin.find({  "phonenumber": req.body.phonenumber })
    .exec()
    .then(user => {
        console.log(user)
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
              
                return res.status(200).json("Auth Successfull");
            }
            return res.status(401).json("Phonenumber or Pass wrong"
            );
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});


router.post('/signup' , (req,res,next)=>{
    Admin.find({phonenumber : req.body.phonenumber})
    .exec()
    .then(data =>{
       if(data.length > 1){
            res.json({
                message : "Admin Already Exist"
            });
       } else{
           bcrypt.hash(req.body.password,10,(err,hash)=>{
               if(err){
                   next(err)
               }else{
                const admin = new Admin({
                    _id : new mongoose.Types.ObjectId(),
                    phonenumber : req.body.phonenumber,
                    password : hash
                });
                admin.save()
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
           })
    
       }
    })
    .catch(err=>{
        next(err)
    });
    
});

module.exports = router;
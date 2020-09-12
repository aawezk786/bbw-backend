const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    Admin.find({ "phonenumber": req.body.phonenumber })
        .exec()
        .then(admin => {
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        name: admin[0].name,
                        email: admin[0].email,
                        phonenumber: admin[0].phonenumber,
                        role: admin[0].role,
                        adminId: admin[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "30d"
                        });
                    return res.status(200).json({
                        message: "Auth Successfull",
                        role: admin[0].role,
                        token: token
                    });
                }
                return res.status(401).json("Phonenumber or Pass wrong");
            });
        })
        .catch(err => {
            next(err)
        });
});


router.post('/signup', (req, res, next) => {
    Admin.find({ phonenumber: req.body.phonenumber })
        .exec()
        .then(data => {
            if (data.length > 1) {
                res.json({
                    message: "Admin Already Exist",
                    detail: data
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        next(err)
                    } else {
                        const admin = new Admin({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email : req.body.email,
                            role: req.body.role,
                            phonenumber: req.body.phonenumber,
                            password: hash
                        });
                        admin.save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message: "Register Successfull",
                                    detail: result
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                })
            }
        })
        .catch(err => {
            next(err)
        });
});

router.get('/getall',(req,res,next) =>{
    Admin.find({role:'Admin'})
    .exec()
    .then( data => {
        res.status(200).json(data)
    })
    .catch( err => {
        next(err)
    })
})
router.delete('/:adminId',(req,res,next) =>{
    const id = req.params.adminId;
    Admin.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: "Admin Deleted Successfully",
                result
            });
        })
        .catch( err => {
            next(err)
        })
})

module.exports = router;
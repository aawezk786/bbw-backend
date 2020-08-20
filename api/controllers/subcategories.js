const Subcategory = require('../models/subcategory');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const async = require('async');



exports.create_subcats = (req, res, next) => {
    const category = new Subcategory({
        _id : new mongoose.Types.ObjectId(),
        name :  req.body.name
    });
        category.save()
        .then(category => {
            return res.status(201).json({
                message: 'Category was created',
                category: category
            });
        })
        .catch(error => {
            next(error);
        });
}


exports.getall_subcats = (req,res,next)=>{
    Subcategory.find()
    .exec()
    .then(docs =>{
        if(docs.length >=0){
            res.status(200).json(docs);
        }else{
            res.status(404).json({
                message : "No Category Found"
            });
        }
    })
    .catch(err =>{
        next(err);
    });
}




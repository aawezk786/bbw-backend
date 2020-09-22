const Category = require('../models/category');
const mongoose = require('mongoose');




exports.create_cats = (req, res, next) => {
    const category = new Category({
        _id : new mongoose.Types.ObjectId(),
        icon_name : req.body.icon_name,
        category : req.body.category,
        subcategory : req.body.subcategory
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


exports.getall_cats = (req,res,next)=>{
    Category.find().sort({category : 1}).populate('subcategory')
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

exports.deleteCats = (req,res,next)=>{
    Category.deleteOne({_id : req.params.catId})
    .exec()
    .then(docs =>{
        res.status(200).json({
            message : "Category was Deleted"
        })
    })
    .catch(err =>{
        next(err);
    });
}



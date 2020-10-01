const Category = require('../models/category');
const mongoose = require('mongoose');




exports.create_cats = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        icon_name: req.body.icon_name,
        category: req.body.category,
        subcategory: req.body.subcategory
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


exports.getall_cats = (req, res, next) => {
    Category.find({active: true}).sort({ category: 1 }).populate('subcategory')
        .exec()
        .then(docs => {
            console.log(docs)
            // for (let i = 0; i < docs.length; i++) {
            //     let bookdetail = docs[i]['_id'];
            //     console.log(bookdetail)
                
            //     // Book.updateOne({_id : bookdetail},{$inc : {quantity : -element}}).then(data=>{console.log(data)}).catch(err=>{console.log(err)})
            //     Category.updateOne({_id: bookdetail},{$set:{"active":true}}).then(data=>{console.log(data)})
            // }
            if (docs.length >= 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: "No Category Found"
                });
            }
        })
        .catch(err => {
            next(err);
        });
}

exports.deleteCats = (req, res, next) => {
    Category.deleteOne({ _id: req.params.catId })
        .exec()
        .then(docs => {
            res.status(200).json({
                message: "Category was Deleted"
            })
        })
        .catch(err => {
            next(err);
        });
}

exports.updateActive = (req,res,next)=>{
    Category.findByIdAndUpdate({_id : req.params.catId},{$set:{active:false}})
    .exec()
    .then(data=>{
        res.json({
            message: "Category has been Inactive"
        })
    })
    .catch(err=>{
        next(err)
    })
}

exports.deleteSubcats = (req, res, next) => {
    const subcatId = req.query.subcatId;
    const catId = req.params.catId;
    Category.findOneAndUpdate({ _id: catId }, { $pull: { "subcategory": subcatId } }).exec()
        .then(result => {
            console.log(result)
            if (result) {
                res.status(200).json({
                    message: "Subcategory Is Deleted From Category"
                });
            }
        })
        .catch(err => {
          next(err)
        });
}

exports.UpdateSubcat = (req, res, next) => {
    const subcatId = req.query.subcatId;
    const catId = req.params.catId
    Category.findOneAndUpdate({ _id: catId }, { $push: { "subcategory": { _id: subcatId } } }).exec()
        .then(result => {
            console.log(result)
            if (result) {
                res.status(200).json({
                    message: "Subcategory Added To Category"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


const Book = require('../models/book');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const async = require('async');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const fetch = require('node-fetch');

exports.update_books = (req, res, next) => {
    let goc_dollar = req.body.goc_dollar;
    let goc_euro = req.body.goc_euro;
    let goc_aus_dollar = req.body.goc_aus_dollar;
    let goc_pound = req.body.goc_pound;
    Book.find().exec()
    .then((result) =>{
        let record = result
        for (let i = 0; i < record.length; i++) {
           if(record[i]['mrp_dollar']!=null || record[i]['mrp_euro']!=null || record[i]['mrp_aus_dollar']!=null ||record[i]['mrp_pound']!=null){
            if(record[i]['mrp_dollar'] && goc_dollar != null  ){
                record[i]['mrp_inr'] = Number(record[i]['mrp_dollar']) * goc_dollar
            }else if(record[i]['mrp_euro'] && goc_euro != null){
                record[i]['mrp_inr'] = Number(record[i]['mrp_euro']) * goc_euro
            }else if(record[i]['mrp_aus_dollar'] && goc_aus_dollar != null){
                record[i]['mrp_inr'] = Number(record[i]['mrp_aus_dollar']) * goc_aus_dollar

            }else if(record[i]['mrp_pound'] && goc_pound != null){
                record[i]['mrp_inr'] = Number(record[i]['mrp_pound']) * goc_pound
            }else{
                record[i]['mrp_inr'] = record[i]['final_price']
            }
           }
           record[i]['discount_rs'] = record[i]['mrp_inr'] - record[i]['final_price']
           record[i]['discount_per'] = record[i]['discount_rs'] / record[i]['mrp_inr'] * 100
           record[i]['sale_disc_inr'] = record[i]['mrp_inr'] - record[i]['sale_price']
           record[i]['sale_disc_per'] = record[i]['sale_disc_inr'] / record[i]['mrp_inr'] * 100

            Book.updateOne({_id:record[i]._id},{$set:{mrp_inr:record[i].mrp_inr,
                discount_rs:record[i].discount_rs,
                discount_per:record[i].discount_per,
                sale_disc_inr:record[i].sale_disc_inr,
                sale_disc_per:record[i].sale_disc_per
            }})
            .then((data)=>{
                console.log(record[i].mrp_inr)
                res.json("Updated Success")
            })
            .catch((error)=>{
                next(error)
            })
        }
        
       
    })
    .catch(err=>{
        next(err)
    });
}

exports.saveBooks =  (req, res, next) => {
   let url = req.file.location;
    fetch(url)
        .then(res => res.text())
        .then(body => {
            const Product = JSON.parse(body);
            console.log(Product.length)
            Book.insertMany(Product)
        },err=>{
            next(err)
        });
    res.json({
        Message : "Uploaded"
    })
   
}



exports.getAllBooks = (req, res, next) => {

    const perPage = 20;
    const page = req.query.page - 1;
    async.parallel([
        function (callback) {
            Book.countDocuments({quantity : {$ne : 0}}, (err, count) => {
                var totalBooks = count;
                callback(err, totalBooks);
            });
        },
        function (callback) {
            Book.find({quantity : {$ne : 0}})
                .skip(perPage * page)
                .limit(perPage)
                // .group(
                //     {
                //         _id :{Isbn_no: "$Isbn_no"},
                //         book_name : {$addToSet :  "$book_name"},
                //         final_price : {$addToSet : "$final_price"}
                // })
                // .distinct("Isbn_no")
                // .populate('categories', 'category')
                .exec((err, books) => {
                    if (err) return next(err);
                    callback(err, books);
                });
        }
    ], function (err, results) {
        var totalBooks = results[0];
        var books = results[1];
        var pag = Math.ceil(totalBooks / perPage);
        if(pag > page){
        res.status(200).json({
            success: true,
            books: books,
            totalBooks: totalBooks,
            pages: Math.ceil(totalBooks / perPage)
        });
    }else{
        res.status(200).json({
            success: false,
            books: [],
            totalBooks: 0,
            pages: 0
          });
    }
        if (err) return next(err);
    });





}

exports.latestBooks = (req, res, next) => {

    const mysort = { _id: -1 };
    async.parallel([
        function (callback) {
            Book.find({quantity : {$ne : 0}}).sort(mysort)
                .limit(20)
                .populate('categories')
                .exec((err, books) => {
                    if (err) return next(err);
                    callback(err, books);
                });
        }
    ], function (err, results) {
        var books = results[0];
        res.status(200).json({
            success: true,
            books: books,
            totalBooks: books.length
        });
        if (err) return next(err);
    })

}

exports.popularbook = (req, res, next) => {


    const mysort = { _id: 1 };
    async.parallel([
        function (callback) {
            Book.find({quantity : {$ne : 0}}).sort(mysort)
                .limit(20)
                .populate('categories')
                .exec((err, books) => {
                    if (err) return next(err);
                    callback(err, books);
                });
        }
    ], function (err, results) {
        var books = results[0];
        res.status(200).json({
            success: true,
            books: books,
            totalBooks: books.length
        });
        if (err) return next(err);
    })

}


exports.deleteBooks = (req, res, next) => {
    const id = req.params.bookId;
    Book.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: "Book deleted Successfully",
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.detailBooks = (req, res, next) => {
    const id = req.params.bookId;
    Book.find({ _id: id })
        .populate('categories', 'category')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    success: true,
                    books: doc
                });
            } else {
                res.status(404).json({
                    message: "No valid enrty found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


exports.getBooksByCats = (req, res, next) => {
    const perPage = 20;
    const page = req.query.page - 1;

    async.parallel([
        function (callback) {
            Book.countDocuments({ categories: req.params.catId ,quantity : {$ne : 0}}, (err, count) => {
                var totalBooks = count;
                callback(err, totalBooks);
            });
        },
        function (callback) {
            const mysort = { final_price: 1 };
            Book.find({quantity : {$ne : 0}})
            Book.find({ categories: req.params.catId,quantity : {$ne : 0} })
            .skip(perPage * page)
            .limit(perPage)
            .sort(mysort)
                .populate('categories')
                .exec((err, books) => {
                    if (err) return next(err);
                    callback(err, books);
                });
        },
        function (callback) {
            Category.findOne({ _id: req.params.catId }, (err, categories) => {
                callback(err, categories)
            });
        }
    ], function (err, results) {
        var totalBooks = results[0];
            var books = results[1];
            var categories = results[2];
        var pag = Math.ceil(totalBooks / perPage );
        if(pag > page){
            res.json({
            success: true,
            message: categories,
            books: books,
            totalBooks: totalBooks,
            pages: Math.ceil(totalBooks / perPage)
        });
        }else{
            res.json({
                success: false,
                books: [],
                totalBooks: 0,
                pages: 0
            });
        }
        if(err) return next(err);
    });
}

exports.getBooksBySubCats = (req, res, next) => {
    const perPage = 20;
    const page = req.query.page - 1;
    async.parallel([
        function (callback) {
            Book.countDocuments({ subcategory: req.params.catId ,quantity : {$ne : 0}}, (err, count) => {
                var totalBooks = count;
                callback(err, totalBooks);
            });
        },
        function (callback) {
            const mysort = { final_price : 1 };
            Book.find({ subcategory: req.params.catId,quantity : {$ne : 0} })
            .skip(perPage * page)
            .limit(perPage)
            .sort(mysort)
                .populate('categories' ,'category')
                .exec((err, books) => {
                    if (err) return next(err);
                    callback(err, books);
                });
        },
        function (callback) {
            Subcategory.findOne({ _id: req.params.catId }, (err, categories) => {
                callback(err, categories)
            });
        }
    ], function (err, results) {
        var totalBooks = results[0];
        var books = results[1];
        var categories = results[2];
        var pag = Math.ceil(totalBooks / perPage );
        if(pag > page){
            res.json({
                success: true,
                message: categories,
                books: books,
                totalBooks: totalBooks,
                pages: Math.ceil(totalBooks / perPage)
            });
        }
        else{
            res.json({
                success: false,
                books: [],
                totalBooks: 0,
                pages: 0
            });
        }
        if(err) return next(err);
    });
}


exports.book_single_post = (req, res, next) => {
    if (req.files.length == 1) {
        product = new Book({
            _id: new mongoose.Types.ObjectId(),
            book_name: req.body.book_name,
            mrp_dollar: req.body.mrp_dollar,
            mrp_euro: req.body.mrp_euro,
            mrp_aus_dollar: req.body.mrp_aus_dollar,
            mrp_pound: req.body.mrp_pound,
            author_name: req.body.author_name,
            Isbn_no: req.body.Isbn_no,
            book_img: [
                req.files[0].location
            ],
            publisher: req.body.publisher,
            condition: req.body.condition,
            print_format: req.body.print_format,
            mrp_inr: req.body.mrp_inr,
            sale_price: req.body.sale_price,
            description: req.body.description,
            publication_year: req.body.publication_year,
            quantity: req.body.quantity,
            no_Of_pages: req.body.no_Of_pages,
            rate: req.body.rate,
            language: req.body.language,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            categories: mongoose.Types.ObjectId(req.body.categories),
            subcategory: mongoose.Types.ObjectId(req.body.subcategory),
            sku: req.body.sku,
            country_origin: req.body.country_origin,
            discount_per: req.body.discount_per,
            discount_rs: req.body.discount_rs,
            final_price: req.body.final_price,
            sale_disc_per: req.body.sale_disc_per,
            sale_disc_inr: req.body.sale_disc_inr,
            sale_rate: req.body.sale_rate
        })
    }
    else if (req.files.length == 2) {
        product = new Book({
            _id: new mongoose.Types.ObjectId(),
            book_name: req.body.book_name,
            mrp_dollar: req.body.mrp_dollar,
            mrp_euro: req.body.mrp_euro,
            mrp_aus_dollar: req.body.mrp_aus_dollar,
            mrp_pound: req.body.mrp_pound,
            author_name: req.body.author_name,
            Isbn_no: req.body.Isbn_no,
            book_img: [
                req.files[0].location,
                req.files[1].location
            ],
            publisher: req.body.publisher,
            condition: req.body.condition,
            print_format: req.body.print_format,
            mrp_inr: req.body.mrp_inr,
            sale_price: req.body.sale_price,
            description: req.body.description,
            publication_year: req.body.publication_year,
            quantity: req.body.quantity,
            no_Of_pages: req.body.no_Of_pages,
            rate: req.body.rate,
            language: req.body.language,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            categories: mongoose.Types.ObjectId(req.body.categories),
            subcategory: mongoose.Types.ObjectId(req.body.subcategory),
            sku: req.body.sku,
            country_origin: req.body.country_origin,
            discount_per: req.body.discount_per,
            discount_rs: req.body.discount_rs,
            final_price: req.body.final_price,
            sale_disc_per: req.body.sale_disc_per,
            sale_disc_inr: req.body.sale_disc_inr,
            sale_rate: req.body.sale_rate
        })
    }
    else if (req.files.length == 3) {
        product = new Book({
            _id: new mongoose.Types.ObjectId(),
            book_name: req.body.book_name,
            mrp_dollar: req.body.mrp_dollar,
            mrp_euro: req.body.mrp_euro,
            mrp_aus_dollar: req.body.mrp_aus_dollar,
            mrp_pound: req.body.mrp_pound,
            author_name: req.body.author_name,
            Isbn_no: req.body.Isbn_no,
            book_img: [
                req.files[0].location,
                req.files[1].location,
                req.files[2].location
            ],
            publisher: req.body.publisher,
            condition: req.body.condition,
            print_format: req.body.print_format,
            mrp_inr: req.body.mrp_inr,
            sale_price: req.body.sale_price,
            description: req.body.description,
            publication_year: req.body.publication_year,
            quantity: req.body.quantity,
            no_Of_pages: req.body.no_Of_pages,
            rate: req.body.rate,
            language: req.body.language,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            categories: mongoose.Types.ObjectId(req.body.categories),
            subcategory: mongoose.Types.ObjectId(req.body.subcategory),
            sku: req.body.sku,
            country_origin: req.body.country_origin,
            discount_per: req.body.discount_per,
            discount_rs: req.body.discount_rs,
            final_price: req.body.final_price,
            sale_disc_per: req.body.sale_disc_per,
            sale_disc_inr: req.body.sale_disc_inr,
            sale_rate: req.body.sale_rate

        })
    }
    else if (req.files.length == 4) {
        product = new Book({
            _id: new mongoose.Types.ObjectId(),
            book_name: req.body.book_name,
            mrp_dollar: req.body.mrp_dollar,
            mrp_euro: req.body.mrp_euro,
            mrp_aus_dollar: req.body.mrp_aus_dollar,
            mrp_pound: req.body.mrp_pound,
            author_name: req.body.author_name,
            Isbn_no: req.body.Isbn_no,
            book_img: [
                req.files[0].location,
                req.files[1].location,
                req.files[2].location,
                req.files[3].location
            ],
            publisher: req.body.publisher,
            condition: req.body.condition,
            print_format: req.body.print_format,
            mrp_inr: req.body.mrp_inr,
            sale_price: req.body.sale_price,
            description: req.body.description,
            publication_year: req.body.publication_year,
            quantity: req.body.quantity,
            no_Of_pages: req.body.no_Of_pages,
            rate: req.body.rate,
            language: req.body.language,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            categories: mongoose.Types.ObjectId(req.body.categories),
            subcategory: mongoose.Types.ObjectId(req.body.subcategory),
            sku: req.body.sku,
            country_origin: req.body.country_origin,
            discount_per: rupdateOneeq.body.discount_per,
            discount_rs: req.body.discount_rs,
            final_price: req.body.final_price,
            sale_disc_per: req.body.sale_disc_per,
            sale_disc_inr: req.body.sale_disc_inr,
            sale_rate: req.body.sale_rate
        })
    }
    product.save().then(result => {
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id
            }
        });
    }).catch(err => {
       next(err)
    });
}

exports.EditBooks = (req,res,next)=>{
    const id = req.params.id;

        Book.updateOne({_id : id},{
            book_name: req.body.book_name,
            mrp_dollar: req.body.mrp_dollar,
            mrp_euro: req.body.mrp_euro,
            mrp_aus_dollar: req.body.mrp_aus_dollar,
            mrp_pound: req.body.mrp_pound,
            author_name: req.body.author_name,
            Isbn_no: req.body.Isbn_no,
            book_img: req.body.book_img,
            publisher: req.body.publisher,
            condition: req.body.condition,
            print_format: req.body.print_format,
            mrp_inr: req.body.mrp_inr,
            sale_price: req.body.sale_price,
            description: req.body.description,
            publication_year: req.body.publication_year,
            quantity: req.body.quantity,
            no_Of_pages: req.body.no_Of_pages,
            rate: req.body.rate,
            language: req.body.language,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            categories: mongoose.Types.ObjectId(req.body.categories),
            subcategory: mongoose.Types.ObjectId(req.body.subcategory),
            sku: req.body.sku,
            country_origin: req.body.country_origin,
            discount_per: req.body.discount_per,
            discount_rs: req.body.discount_rs,
            final_price: req.body.final_price,
            sale_disc_per: req.body.sale_disc_per,
            sale_disc_inr: req.body.sale_disc_inr,
            sale_rate: req.body.sale_rate
        })
        .then(result=>{res.json({message : "Updated Successfully",result : result})})
        .catch(err=>{next(err)});
    
}
    
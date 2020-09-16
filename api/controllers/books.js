const Book = require('../models/book');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const async = require('async');
const Category = require('../models/category');


exports.saveBooks = (req, res, next) => {
    let data = []
    let wb = xlsx.readFile(req.file.path);
    let ws = wb.SheetNames;
    let we = wb.Sheets[ws];   
     data = xlsx.utils.sheet_to_json(we);

    for (let i = 0; i < data.length; i++) {
        
        let book_name = data[i].book_name;
        let active_bool = data[i].active_bool;
        let mrp_dollar = data[i].mrp_dollar;
        let mrp_euro = data[i].mrp_euro;
        let mrp_aus_dollar = data[i].mrp_aus_dollar;
        let mrp_pound = data[i].mrp_pound;
        let author_name = data[i].author_name;
        let Isbn_no = data[i].Isbn_no;
        let publisher = data[i].publisher;
        let condition = data[i].condition;
        let print_format = data[i].print_format;
        let mrp_inr = data[i].mrp_inr;
        let sale_price = data[i].sale_price;
        let description = data[i].description;
        let publication_year = data[i].publication_year;
        let no_Of_pages = data[i].no_Of_pages;
        let language = data[i].language;
        let dimensions = data[i].dimensions;
        let rate = data[i].rate;
        let weight = data[i].weight;
        let categories = data[i].categories;
        let subcategory = data[i].subcategory;
        let quantity = data[i].quantity;
        let sku = data[i].sku;
        let country_origin = data[i].country_origin;
        let book_img = [
            "https://booksimg.s3.us-east-2.amazonaws.com/" + data[i].book_img1,
            "https://booksimg.s3.us-east-2.amazonaws.com/" +data[i].book_img2,
            "https://booksimg.s3.us-east-2.amazonaws.com/" +data[i].book_img3,
            "https://booksimg.s3.us-east-2.amazonaws.com/" +data[i].book_img4
        ];
        let discount_per = data[i].discount_per;
        let discount_rs = data[i].discount_rs;
        let final_price = data[i].final_price;
        let sale_disc_per = data[i].sale_disc_per;
        let sale_disc_inr = data[i].sale_disc_inr;
        let sale_rate = data[i].sale_rate;
        let books = new Book({
            _id: new mongoose.Types.ObjectId(),
            book_name: book_name,
            active_bool: active_bool,
            mrp_dollar: mrp_dollar,
            mrp_euro: mrp_euro,
            mrp_aus_dollar: mrp_aus_dollar,
            mrp_pound: mrp_pound,
            author_name: author_name,
            Isbn_no: Isbn_no,
            book_img: book_img,
            publisher: publisher,
            condition: condition,
            print_format: print_format,
            mrp_inr: mrp_inr,
            sale_price: sale_price,
            description: description,
            publication_year: publication_year,
            quantity: quantity,
            no_Of_pages: no_Of_pages,
            language: language,
            dimensions: dimensions,
            weight: weight,
            rate: rate,
            categories:categories,
            subcategory:subcategory,
            sku: sku,
            country_origin: country_origin,
            discount_per: discount_per,
            discount_rs: discount_rs,
            final_price: final_price,
            sale_disc_per: sale_disc_per,
            sale_disc_inr: sale_disc_inr,
            sale_rate: sale_rate,
            excel_file: req.file.path
        });
        books.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created Product Successfully'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }) 
    }
    // data.map((record) => {
    //     let book_name = record.book_name;
    //     let active_bool = record.active_bool;
    //     let mrp_dollar = record.mrp_dollar;
    //     let mrp_euro = record.mrp_euro;
    //     let mrp_aus_dollar = record.mrp_aus_dollar;
    //     let mrp_pound = record.mrp_pound;
    //     let author_name = record.author_name;
    //     let Isbn_no = record.Isbn_no;
    //     let publisher = record.publisher;
    //     let condition = record.condition;
    //     let print_format = record.print_format;
    //     let mrp_inr = record.mrp_inr;
    //     let sale_price = record.sale_price;
    //     let description = record.description;
    //     let publication_year = record.publication_year;
    //     let no_Of_pages = record.no_Of_pages;
    //     let language = record.language;
    //     let dimensions = record.dimensions;
    //     let rate = record.rate;
    //     let weight = record.weight;
    //     let categories = record.categories;
    //     let subcategory = record.subcategory;
    //     let quantity = record.quantity;
    //     let sku = record.sku;
    //     let country_origin = record.country_origin;
    //     let book_img = [
    //         "https://booksimg.s3.us-east-2.amazonaws.com/" + record.book_img1,
    //         "https://booksimg.s3.us-east-2.amazonaws.com/" +record.book_img2,
    //         "https://booksimg.s3.us-east-2.amazonaws.com/" +record.book_img3,
    //         "https://booksimg.s3.us-east-2.amazonaws.com/" +record.book_img4
    //     ];
    //     let discount_per = record.discount_per;
    //     let discount_rs = record.discount_rs;
    //     let final_price = record.final_price;
    //     let sale_disc_per = record.sale_disc_per;
    //     let sale_disc_inr = record.sale_disc_inr;
    //     let sale_rate = record.sale_rate;
    //     let books = new Book({
    //         _id: new mongoose.Types.ObjectId(),
    //         book_name: book_name,
    //         active_bool: active_bool,
    //         mrp_dollar: mrp_dollar,
    //         mrp_euro: mrp_euro,
    //         mrp_aus_dollar: mrp_aus_dollar,
    //         mrp_pound: mrp_pound,
    //         author_name: author_name,
    //         Isbn_no: Isbn_no,
    //         book_img: book_img,
    //         publisher: publisher,
    //         condition: condition,
    //         print_format: print_format,
    //         mrp_inr: mrp_inr,
    //         sale_price: sale_price,
    //         description: description,
    //         publication_year: publication_year,
    //         quantity: quantity,
    //         no_Of_pages: no_Of_pages,
    //         language: language,
    //         dimensions: dimensions,
    //         weight: weight,
    //         rate: rate,
    //         categories: mongoose.Types.ObjectId(categories),
    //         subcategory: mongoose.Types.ObjectId(subcategory),
    //         sku: sku,
    //         country_origin: country_origin,
    //         discount_per: discount_per,
    //         discount_rs: discount_rs,
    //         final_price: final_price,
    //         sale_disc_per: sale_disc_per,
    //         sale_disc_inr: sale_disc_inr,
    //         sale_rate: sale_rate,
    //         excel_file: req.file.path
    //     });
    //     books.save().then(result => {
    //         console.log(result);
    //         res.status(201).json({
    //             message: 'Created Product Successfully'
    //         });
    //     }).catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     })
    // });

}



exports.getAllBooks = (req, res, next) => {
    async.parallel([
        function (callback) {
            Book.countDocuments({}, (err, count) => {
                var totalBooks = count;
                callback(err, totalBooks);
                
            });
        },
        function (callback) {
            Book.find({})
                .populate('categories', 'category')
                .populate('subcategory1')
                .exec((err, books) => {
                    if (err) return next(err);
                    callback(err, books);
                });
        }
    ], function (err, results) {
        var totalBooks = results[0];
        var books = results[1];
        res.status(200).json({
            success: true,
            books: books,
            totalBooks: totalBooks 
        });
        if (err) return next(err);
    });

}

exports.latestBooks =  (req, res, next) => {

    const mysort = { _id: -1 };
    async.parallel([
        function (callback) {
            Book.find({}).sort(mysort)
                .limit(5)
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
    })

}

exports.popularbook =  (req, res, next) => {

    const mysort = { _id: 1 };
    async.parallel([
        function (callback) {
            Book.find({}).sort(mysort)
                .limit(5)
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
        .populate('categories', 'category subcategory')
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
    
    async.parallel([
        function (callback) {
            Book.countDocuments({ categories: req.params.catId }, (err, count) => {
                var totalBooks = count;
                callback(err, totalBooks);
            });
        },
        function (callback) {
            const mysort = { selling_price: 1 };
            Book.find({ categories: req.params.catId }).sort(mysort)
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
            res.json({
                success: true,
                message: categories,
                books: books,
                totalBooks: totalBooks
    
            });
    });
}



exports.book_single_post = (req,res,next) =>{
    console.log(req.files)
    if(req.files.length == 1){
        product = new Book({
           _id : new mongoose.Types.ObjectId(),
           book_name : req.body.book_name,
           author_name : req.body.author_name,
           Isbn_no : req.body.Isbn_no,
           book_img: [
               req.files[0].location,
             
           ],
           publisher : req.body.publisher,
           condition : req.body.condition,
           print_type : req.body.print_type,
           mrp : req.body.mrp,
           selling_price : req.body.selling_price,
           saved_price : req.body.saved_price,
           sale_price : req.body.sale_price,
           description : req.body.description,
           publication_year : req.body.publication_year,
           quantity : req.body.quantity,
           no_Of_pages : req.body.no_Of_pages,
           language : req.body.language,
           dimensions : req.body.dimensions,
           weight : req.body.weight,
           categories : mongoose.Types.ObjectId(req.body.categories),
           sku : req.body.sku
   
       })
   }
else if(req.files.length == 2){
     product = new Book({
        _id : new mongoose.Types.ObjectId(),
        book_name : req.body.book_name,
        author_name : req.body.author_name,
        Isbn_no : req.body.Isbn_no,
        book_img: [
            req.files[0].location,
            req.files[1].location
        ],
        publisher : req.body.publisher,
        condition : req.body.condition,
        print_type : req.body.print_type,
        mrp : req.body.mrp,
        selling_price : req.body.selling_price,
        saved_price : req.body.saved_price,
        sale_price : req.body.sale_price,
        description : req.body.description,
        publication_year : req.body.publication_year,
        quantity : req.body.quantity,
        no_Of_pages : req.body.no_Of_pages,
        language : req.body.language,
        dimensions : req.body.dimensions,
        weight : req.body.weight,
        categories : mongoose.Types.ObjectId(req.body.categories),
        sku : req.body.sku

    })
}
else if(req.files.length == 3){
    product = new Book({
       _id : new mongoose.Types.ObjectId(),
       book_name : req.body.book_name,
       author_name : req.body.author_name,
       Isbn_no : req.body.Isbn_no,
       book_img: [
           req.files[0].location,
           req.files[1].location,
           req.files[2].location
       ],
       publisher : req.body.publisher,
       condition : req.body.condition,
       print_type : req.body.print_type,
       mrp : req.body.mrp,
       selling_price : req.body.selling_price,
       saved_price : req.body.saved_price,
       sale_price : req.body.sale_price,
       description : req.body.description,
       publication_year : req.body.publication_year,
       quantity : req.body.quantity,
       no_Of_pages : req.body.no_Of_pages,
       language : req.body.language,
       dimensions : req.body.dimensions,
       weight : req.body.weight,
       categories : mongoose.Types.ObjectId(req.body.categories),
       sku : req.body.sku

   })
}
else if(req.files.length == 4){
    product = new Book({
       _id : new mongoose.Types.ObjectId(),
       book_name : req.body.book_name,
       author_name : req.body.author_name,
       Isbn_no : req.body.Isbn_no,
       book_img: [
           req.files[0].location,
           req.files[1].location,
           req.files[2].location,
           req.files[3].location
       ],
       publisher : req.body.publisher,
       condition : req.body.condition,
       print_type : req.body.print_type,
       mrp : req.body.mrp,
       selling_price : req.body.selling_price,
       saved_price : req.body.saved_price,
       sale_price : req.body.sale_price,
       description : req.body.description,
       publication_year : req.body.publication_year,
       quantity : req.body.quantity,
       no_Of_pages : req.body.no_Of_pages,
       language : req.body.language,
       dimensions : req.body.dimensions,
       weight : req.body.weight,
       categories : mongoose.Types.ObjectId(req.body.categories),
       sku : req.body.sku

   })
}

    




   

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
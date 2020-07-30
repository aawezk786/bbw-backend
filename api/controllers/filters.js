const Book = require('../models/book');
const mongoose = require('mongoose');
const async = require('async');

exports.sortBy = (req, res, next) => {
    // const perPage = 12;
    // const page = req.query.page;
    var asc = req.query.sortBy =='asc';
    var desc = req.query.sortBy == 'desc';
    if (asc) {
        const mysort = { selling_price: 1 };
        Book.countDocuments({}, (err, count) => {
            var totalBooks = count;
            Book.find().sort(mysort).exec()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        books: result,
                        totalBooks: totalBooks,
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });
        // async.parallel([
        //     function (callback) {
        //         Book.count({}, (err, count) => {
        //             var totalBooks = count;
        //             callback(err, totalBooks);
        //         });
        //     }, function (callback) {
        //         const mysort = { selling_price: 1 };
        //         Book.find().sort(mysort)
        //             .skip(perPage * page)
        //             .limit(perPage)
        //             .exec((err, books) => {
        //                 if (err) return next(err);
        //                 callback(err, books);
        //             });
        //     }
        // ], function (err, results) {
        //     var totalBooks = results[0];
        //     var books = results[1];

        //     res.json({
        //         success: true,
        //         books: books,
        //         totalBooks: totalBooks,
        //         pages: Math.ceil(totalBooks / perPage - 1)
        //     });
        // });



    }
    
    if (desc) {
        const mysort = { selling_price: -1 };
        Book.countDocuments({}, (err, count) => {
            var totalBooks = count;
            Book.find().sort(mysort).exec()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        books: result,
                        totalBooks: totalBooks,
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });

        //     async.parallel([
        //         function(callback){
        //             Book.count({},(err,count)=>{
        //                 var totalBooks = count;
        //                 callback(err,totalBooks);
        //             });
        //         },function(callback){
        //             const mysort = { selling_price: -1 };
        //             Book.find().sort(mysort)
        //             .skip(perPage * page)
        //             .limit(perPage)
        //             .exec((err,books)=>{
        //                 if(err) return next(err);
        //                 callback(err,books);
        //             });
        //         }
        //     ],function(err,results){
        //         var totalBooks = results[0];
        //         var books = results[1];

        //         res.json({
        //             success : true,
        //             books : books,
        //             totalBooks : totalBooks,
        //             pages : Math.ceil(totalBooks/perPage -1)
        //         });
        //     });
        // }
    }
    if(!asc && !desc){
        res.status(404).json({
            message : "Check Query"
        });
    }
}

    exports.price_sort = (req, res, next) => {
        // const first = req.params.first;
        // const second = req.params.second;
        // const perPage = 12;
        // const page = req.query.page;
        // async.parallel([
        //     function(callback){
        //         Book.count({selling_price : {$gte:(first),$lte:(second)}},(err,count)=>{
        //             var totalBooks = count;
        //             callback(err,totalBooks);
        //         });

        //     },
        //     function(callback){
        //         Book.find({selling_price : {$gte:(first),$lte:(second)}})
        //         .skip(perPage * page)
        //         .limit(perPage)
        //         .exec((err,books)=>{
        //             if(err) return next(err);
        //             callback(err,books);
        //         });
        //     }
        // ],function(err,results){
        //     var totalBooks = results[0];
        //     var books = results[1];

        //     res.json({
        //         success : true,
        //         books : books,
        //         totalBooks : totalBooks,
        //         pages : Math.ceil(totalBooks/perPage - 1)
        //     });
        // });
        const first = req.params.first;
        const second = req.params.second;
       
        Book.countDocuments({ selling_price: { $gte: (first), $lte: (second) } }, (err, count) => {
            var totalBooks = count;
            const mysort = { selling_price: 1 };
            Book.find({ selling_price: { $gte: (first), $lte: (second) } }).sort(mysort).exec()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        books: result,
                        totalBooks: totalBooks,
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });



    }
const Book = require('../models/book');
const mongoose = require('mongoose');
const async = require('async');

exports.sortBy = (req, res, next) => {
    var asc = req.query.sortBy == 'asc';
    var desc = req.query.sortBy == 'desc';
    const perPage = 20;
    const page = req.query.page - 1;
    if (asc) {
        const mysort = { final_price: 1 };
        Book.countDocuments({quantity : {$ne : 0}}, (err, count) => {
            var totalBooks = count;
            if (err) throw err;
            Book.aggregate().match({quantity : {$ne : 0}}).sort(mysort).allowDiskUse(true)
                .skip(perPage * page)
                .limit(perPage)
            .exec()
                .then(result => {
                    console.log(result)
                    var pag = Math.ceil(totalBooks / perPage);
                    if (pag > page) {
                        res.status(200).json({
                            success: true,
                            books: result,
                            totalBooks: totalBooks,
                            pages: Math.ceil(totalBooks / perPage )
                        });
                    }
                     else {
                        res.status(200).json({
                            success: false,
                            books: [],
                            totalBooks: 0,
                            pages: 0
                        });
                    }
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });
    }

    if (desc) {
        const mysort = { final_price: -1 };
        Book.countDocuments({}, (err, count) => {
            var totalBooks = count;
            Book.aggregate().match({quantity : {$ne : 0}}).sort(mysort).allowDiskUse(true)
                .skip(perPage * page)
                .limit(perPage)
                .exec()
                .then(result => {
                    var pag = Math.ceil(totalBooks / perPage);
                    if (pag > page) {
                        res.status(200).json({
                            success: true,
                            books: result,
                            totalBooks: totalBooks,
                            pages: Math.ceil(totalBooks / perPage)
                        });
                    } else {
                        res.status(200).json({
                            success: false,
                            books: result,
                            totalBooks: 0,
                            pages: 0
                        });
                    }
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });
    }
    if (!asc && !desc) {
        res.status(404).json({
            message: "Check Query"
        });
    }
}

exports.price_sort = (req, res, next) => {
    const first = req.params.first;
    const second = req.params.second;
    const perPage = 20;
    const page = req.query.page - 1;
    Book.countDocuments({ final_price: { $gte: (first) , $lte : (second)},quantity : {$ne : 0} }, (err, count) => {
        var totalBooks = count;
        const mysort = {  final_price : 1 };
        Book.aggregate()
        .match({final_price:{$gte: parseInt(first),$lte : parseInt(second)},quantity : {$ne : 0} })
        // .project({book_name : 1,final_price : 1,final_active :{ $gte: ["$final_price",first]},final_inact:{ $lte : ["$final_price" , second]}})
        .sort(mysort)
        .allowDiskUse(true)
                .skip(perPage * page)
                .limit(perPage)
                .exec()
            .then(result => {
                var pag = Math.ceil(totalBooks / perPage);
                if (pag > page) {
                    res.status(200).json({
                        success: true,
                        books: result,
                        totalBooks: totalBooks,
                        pages: Math.ceil(totalBooks / perPage)
                    });
                } 
                else {
                    res.status(200).json({
                        success: false,
                        books: result,
                        totalBooks: 0,
                        pages: 0
                    });
                }
            })
            .catch(error => {
                next(error)
            });
        if (err) {
            console.log(err)
        }
    });



}

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
        Book.countDocuments({}, (err, count) => {
            var totalBooks = count;
            Book.find()
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
                            pages: Math.ceil(totalBooks / perPage )
                        });
                    } else {
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
            Book.find()
                .skip(perPage * page)
                .limit(perPage)
                .sort(mysort).exec()
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

    Book.countDocuments({ final_price: { $gte: (first), $lte: (second) } }, (err, count) => {
        var totalBooks = count;
        const mysort = {  final_price : 1 };
        Book.find({ final_price: { $gte: (first), $lte: (second) } }).sort(mysort)
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
const Book = require('../models/book');
const mongoose = require('mongoose');
const async = require('async');

exports.sortBy = (req, res, next) => {
    var asc = req.query.sortBy =='asc';
    var desc = req.query.sortBy == 'desc';
    if (asc) {
        const mysort = { mrp_inr: 1 };
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
    }
    
    if (desc) {
        const mysort = { mrp_inr : -1 };
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
    }
    if(!asc && !desc){
        res.status(404).json({
            message : "Check Query"
        });
    }
}

    exports.price_sort = (req, res, next) => {
        const first = req.params.first;
        const second = req.params.second;
       
        Book.countDocuments({ mrp_inr: { $gte: (first), $lte: (second) } }, (err, count) => {
            var totalBooks = count;
            const mysort = { mrp_inr: 1 };
            Book.find({ mrp_inr: { $gte: (first), $lte: (second) } }).sort(mysort).exec()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        books: result,
                        totalBooks: totalBooks,
                    });
                })
                .catch(error => {
                   next(error)
                });
        });



    }
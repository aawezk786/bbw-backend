const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');


router.post('/:bookId', checkAuth, (req, res, next) => {
    const userId = req.userData.userId;
    const bookId = req.params.bookId;
    Wishlist.find({ user: userId, book: bookId })
        .then(result => {
            if (result.length > 0) {
                res.status(409).json({
                    message: "Product Already in Added",
                    foundProduct: result
                });
            } else {

                const wishlist = new Wishlist({
                    _id: mongoose.Types.ObjectId(),
                    book: req.params.bookId,
                    user: userId
                });
                wishlist.save()
                    .then(result => {
                        console.log(result);
                        return res.status(200).json({
                            message: "Product Added To Wishlist",
                            docs: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
            }
        }).catch(err => {
            next(err);
        });

});


router.get('/', (req, res, next) => {
    Wishlist.find({}).populate('user').populate('book').exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                wishlists: result
            });
        })
        .catch(err => {
            next(err);
        });
});



router.get('/ByUser', checkAuth, (req, res, next) => {
    Wishlist.find({ user: req.userData.userId }).populate('book')
        .select('book')
        .exec()
        .then(result => {
            res.json({
                user: req.userData.userId,
                books: result
            });
        })
        .catch(err => {
           next(err);
        });
});

router.delete('/:WishlistId', checkAuth, (req, res, next) => {
    const id = req.params.WishlistId;
    Wishlist.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: "Book deleted From Wishlist",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
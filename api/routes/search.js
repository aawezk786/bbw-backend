const express = require('express');
const router = express.Router();
const Book = require('../models/book');
router.get('/', async (req, res) => {
  if (req.query.book_name == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        book_name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.find({ ...searchKeyword });
    return res.status(200).json({
      success: true,
      count: products.length + " " + "Results found",
      books: products
    });
  }
  if (req.query.author_name == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        author_name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.find({ ...searchKeyword });
    return res.status(200).json({
      success: true,
      count: products.length + " " + "Results found",
      books: products
    });
  }
  if (req.query.publisher == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        publisher: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.find({ ...searchKeyword });
    return res.status(200).json({
      success: true,
      count: products.length + " " + "Results found",
      books: products
    });
  }
  if (req.query.isbn == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        Isbn_no: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.find({ ...searchKeyword });
    return res.status(200).json({
      success: true,
      count: products.length + " " + "Results found",
      books: products
    });
  }
  res.json({
    message: "Check query"
  });
});
router.get('/books', async (req, res) => {
  if (req.query.condition == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        condition: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.find({ ...searchKeyword });
    return res.status(200).json({
      success: true,
      count: products.length + " " + "Results found",
      books: products,
      totalBooks: products.length
    });
  }
  res.json({
    message: "Check query"
  });
});
router.get('/filter/new', (req, res) => {
  var asc = req.query.sortBy == 'asc';
  var desc = req.query.sortBy == 'desc';
  if (asc) {
    const mysort = { final_price: 1 };
    Book.countDocuments({ condition: "New" }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: "New" }).sort(mysort).exec()
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
    const mysort = { final_price: -1 };
    Book.countDocuments({ condition: "New" }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: "New" }).sort(mysort).exec()
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
  if (!asc && !desc) {
    res.status(404).json({
      message: "Check Query"
    });
  }
});
router.get('/filter/preowned', (req, res) => {
  var asc = req.query.sortBy == 'asc';
  var desc = req.query.sortBy == 'desc';
  var condition = req.query.condition = 'Pre';
  var regex = new RegExp(condition.toLowerCase(), 'i');
  if (asc) {
    const mysort = { final_price: 1 };
    Book.countDocuments({ condition: regex }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: regex }).sort(mysort).exec()
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
    const mysort = { final_price: -1 };
    Book.countDocuments({ condition: regex }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: regex }).sort(mysort).exec()
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
  if (!asc && !desc) {
    res.status(404).json({
      message: "Check Query"
    });
  }
});
router.get('/priceDefined/:first/:second', (req, res, next) => {
  const first = req.params.first;
  const second = req.params.second;
  var condition = req.query.condition;
  var regex = new RegExp(condition.toLowerCase(), 'i');
  Book.countDocuments({ final_price: { $gte: (first), $lte: (second) }, condition: regex }, (err, count) => {
    var totalBooks = count;
    const mysort = { final_price: 1 };
    Book.find({ final_price: { $gte: (first), $lte: (second) }, condition: regex }).sort(mysort).exec()
      .then(result => {
        res.status(200).json({
          success: true,
          books: result,
          totalBooks: totalBooks
        });
      })
      .catch(error => {
        res.status(500).json({
          error: error
        });
      });
  });
});
module.exports = router;
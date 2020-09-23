const express = require('express');
const router = express.Router();
const Book = require('../models/book');
router.get('/', async (req, res) => {
  const perPage = 20;
  const page = req.query.page;
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
    let productslen = products.length;

    let productsOP = await Book.find({ ...searchKeyword }).skip(perPage * page)
      .limit(perPage);
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage - 1)
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
    let productslen = products.length;

    let productsOP = await Book.find({ ...searchKeyword }).skip(perPage * page)
      .limit(perPage);
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage - 1)
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
    let productslen = products.length;

    let productsOP = await Book.find({ ...searchKeyword }).skip(perPage * page)
      .limit(perPage);
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage - 1)
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
    let productslen = products.length;

    let productsOP = await Book.find({ ...searchKeyword }).skip(perPage * page)
      .limit(perPage);
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage - 1)
    });
  }
  res.json({
    message: "Check query"
  });
});
router.get('/books', async (req, res) => {
  const perPage = 20;
  const page = req.query.page;
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

    let productslen = products.length;

    let productsOP = await Book.find({ ...searchKeyword }).skip(perPage * page)
      .limit(perPage);
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage - 1)
    });
  }
  res.json({
    message: "Check query"
  });
});

router.get('/filter/new', (req, res, next) => {
  var asc = req.query.sortBy == 'asc';
  var desc = req.query.sortBy == 'desc';
  const perPage = 20;
  const page = req.query.page;
  if (asc) {
    const mysort = { final_price: 1 };
    Book.countDocuments({ condition: "New" }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: "New" })
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
              pages: Math.ceil(totalBooks / perPage - 1)
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
          next(error)
        });
    });
  }
  if (desc) {
    const mysort = { final_price: -1 };
    Book.countDocuments({ condition: "New" }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: "New" })
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
              pages: Math.ceil(totalBooks / perPage - 1)
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
          next(error)
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
  const perPage = 20;
  const page = req.query.page;
  var regex = new RegExp(condition.toLowerCase(), 'i');
  if (asc) {
    const mysort = { final_price: 1 };
    Book.countDocuments({ condition: regex }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: regex })
        .skip(perPage * page)
        .limit(perPage)
        .sort(mysort).exec()
        .then(result => {
          var pag = Math.ceil(totalBooks / perPage);
          console.log(pag)
          if (pag > page) {
            res.status(200).json({
              success: true,
              books: result,
              totalBooks: totalBooks,
              pages: Math.ceil(totalBooks / perPage - 1)
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
          next(error)
        });
    });
  }
  if (desc) {
    const mysort = { final_price: -1 };
    Book.countDocuments({ condition: regex }, (err, count) => {
      var totalBooks = count;
      Book.find({ condition: regex })
        .skip(perPage * page)
        .limit(perPage)
        .sort(mysort).exec()
        .then(result => {
          var pag = Math.ceil(totalBooks / perPage);
          console.log(pag)
          if (pag > page) {
            res.status(200).json({
              success: true,
              books: result,
              totalBooks: totalBooks,
              pages: Math.ceil(totalBooks / perPage - 1)
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
          next(error)
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
  const perPage = 20;
  const page = req.query.page;
  var condition = req.query.condition;
  var regex = new RegExp(condition.toLowerCase(), 'i');
  Book.countDocuments({ final_price: { $gte: (first), $lte: (second) }, condition: regex }, (err, count) => {
    var totalBooks = count;
    const mysort = { final_price: 1 };
    Book.find({ final_price: { $gte: (first), $lte: (second) }, condition: regex })
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
            pages: Math.ceil(totalBooks / perPage - 1)
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
        next(error)
      });
  });
});
module.exports = router;
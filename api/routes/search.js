const express = require('express');
const router = express.Router();
const Book = require('../models/book');
router.get('/', async (req, res) => {
  const perPage = 20;
  const page = req.query.page - 1;


  if (req.query.book_name == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        book_name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.countDocuments({ ...searchKeyword ,quantity : {$ne : 0}});

    let productslen = products;

    let productsOP = await Book.aggregate().match({ ...searchKeyword ,quantity : {$ne : 0}}).skip(perPage * page)
      .limit(perPage).sort({ final_price: 1 }).allowDiskUse(true).exec();
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage)
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
    let products = await Book.countDocuments({ ...searchKeyword,quantity : {$ne : 0} });

    let productslen = products;

    let productsOP = await Book.aggregate().match({ ...searchKeyword ,quantity : {$ne : 0}}).skip(perPage * page)
      .limit(perPage).sort({ final_price: 1 }).allowDiskUse(true).exec();
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage)
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
    let products = await Book.countDocuments({ ...searchKeyword ,quantity : {$ne : 0}});

    let productslen = products;

    let productsOP = await Book.aggregate().match({ ...searchKeyword ,quantity : {$ne : 0}}).skip(perPage * page)
      .limit(perPage).sort({ final_price: 1 }).allowDiskUse(true).exec();
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage)
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
    let products = await Book.countDocuments({ ...searchKeyword ,quantity : {$ne : 0}});

    let productslen = products;

    let productsOP = await Book.aggregate().match({ ...searchKeyword ,quantity : {$ne : 0}}).skip(perPage * page)
      .limit(perPage).sort({ final_price: 1 }).allowDiskUse(true).exec();
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage)
    });
  }
  res.json({
    message: "Check query"
  });


});





router.get('/books', async (req, res) => {
  const perPage = 20;
  const page = req.query.page - 1;
  if (req.query.condition == '1') {
    let searchKeyword = req.query.searchKeyword
      ? {
        condition: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
      : {};
    let products = await Book.countDocuments({ ...searchKeyword ,quantity : {$ne : 0}});

    let productslen = products;

    let productsOP = await Book.aggregate().match({ ...searchKeyword ,quantity : {$ne : 0}}).skip(perPage * page)
      .limit(perPage).sort({ final_price: 1 }).allowDiskUse(true).exec();
    return res.status(200).json({
      success: true,
      count: productslen + " " + "Results found",
      books: productsOP,
      totalBooks: productslen,
      pages: Math.ceil(productslen / perPage)
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
  const page = req.query.page - 1;
  if (asc) {
    const mysort = { final_price: 1 };
    Book.countDocuments({ condition: "New" ,quantity : {$ne : 0}}, (err, count) => {
      var totalBooks = count;
      Book.aggregate().match({ condition: "New",quantity : {$ne : 0} })
        .skip(perPage * page)
        .limit(perPage)
        .sort(mysort).allowDiskUse(true).exec()
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
    Book.countDocuments({ condition: "New" ,quantity : {$ne : 0}}, (err, count) => {
      var totalBooks = count;
      Book.aggregate().match({ condition: "New",quantity : {$ne : 0} })
        .skip(perPage * page)
        .limit(perPage)
        .sort(mysort).allowDiskUse(true).exec()
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





router.get('/filter/preowned', (req, res, next) => {
  var asc = req.query.sortBy == 'asc';
  var desc = req.query.sortBy == 'desc';
  var condition = req.query.condition = 'Pre';
  const perPage = 20;
  const page = req.query.page - 1;
  var regex = new RegExp(condition.toLowerCase(), 'i');
  if (asc) {
    const mysort = { final_price: 1 };
    Book.countDocuments({ condition: regex ,quantity : {$ne : 0}}, (err, count) => {
      var totalBooks = count;
      Book.aggregate().match({ condition: regex ,quantity : {$ne : 0}})
        .skip(perPage * page)
        .limit(perPage)
        .sort(mysort).allowDiskUse(true).exec()
        .then(result => {
          var pag = Math.ceil(totalBooks / perPage);
          console.log(pag)
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
    Book.countDocuments({ condition: regex ,quantity : {$ne : 0}}, (err, count) => {
      var totalBooks = count;
      Book.aggregate().match({ condition: regex,quantity : {$ne : 0} })
        .skip(perPage * page)
        .limit(perPage)
        .sort(mysort).allowDiskUse(true).exec()
        .then(result => {
          var pag = Math.ceil(totalBooks / perPage);
          console.log(pag)
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
  const page = req.query.page - 1;
  var condition = req.query.condition;
  var regex = new RegExp(condition.toLowerCase(), 'i');
  Book.countDocuments({ final_price: { $gte: (first), $lte: (second) }, condition: regex,quantity : {$ne : 0} }, (err, count) => {
    var totalBooks = count;
    const mysort = { final_price: 1 };
    Book.aggregate()
      .match({ final_price: { $gte: parseInt(first), $lte: parseInt(second) }, condition: regex ,quantity : {$ne : 0}})
      .skip(perPage * page)
      .limit(perPage)
      .sort(mysort).allowDiskUse(true).exec()
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
const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/',async (req,res)=>{
  if(req.query.book_name == '1'){
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
      count : products.length +" " + "Results found",
      books :products
    });
  }


  if(req.query.author_name == '1'){
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
      count : products.length +" " + "Results found",
      books :products
    });
  }


  if(req.query.publisher == '1'){
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
      count : products.length +" " + "Results found",
      books :products
    });
  }


  if(req.query.isbn == '1'){
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
      count : products.length +" " + "Results found",
      books :products
    });
  }

  
  res.json({
    message : "Check query"
  });
    
});


router.get('/books',async (req,res)=>{
  if(req.query.condition == '1'){
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
      count : products.length +" " + "Results found",
      books :products
    });
  }


 


 


 

  
  res.json({
    message : "Check query"
  });
    
});



module.exports = router;
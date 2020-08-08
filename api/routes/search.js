const express = require('express');
const router = express.Router();
const Book = require('../models/book');
// const algoliasearch = require('algoliasearch');
// const client = algoliasearch('JF5EPDPH1R','dfa3ef2bde335a6e8d006df5eabdde15');
// const index = client.initIndex('bbw');

router.get('/',async (req,res,next)=>{
  if(req.query.book_name == '1'){
    const searchKeyword = req.query.searchKeyword
    ? {
        book_name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};
    const products = await Book.find({ ...searchKeyword });
   return res.status(200).json({
      success: true,
      count : products.length +" " + "Results found",
      books :products
    });
  }
  if(req.query.author_name == '1'){
    const searchKeyword = req.query.searchKeyword
    ? {
        author_name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};
    const products = await Book.find({ ...searchKeyword });
   return res.status(200).json({
      success: true,
      count : products.length +" " + "Results found",
      books :products
    });
  }
  res.json({
    message : "Check query"
  });
    
    
    // var regex = new RegExp(req.params.name.toLowerCase(),'i');
    // Book.find({book_name: regex})
    // .then(result=>{
    //     res.status(200).json(result);
    // })
    // .catch(err=>{
    //     res.status(404).json({
    //         message : "Not Found",
    //         error : err
    //     });
    // });
});



module.exports = router;
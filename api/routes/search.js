const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('JF5EPDPH1R','dfa3ef2bde335a6e8d006df5eabdde15');
const index = client.initIndex('bbw');

router.get('/:name',(req,res,next)=>{
    var regex = new RegExp(req.params.name.toLowerCase(),'i');
    Book.find({book_name: regex})
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        res.status(404).json({
            message : "Not Found",
            error : err
        });
    });
});

router.get('/', (req, res, next) => {
    if (req.query.search) {
        console.log("OK")
      index.search({
        query: req.query.search
      }, (err, content) => {
        res.json({
          success: true,
          message: "Here is your search",
          status: 200,
          content: content,
          search_result: req.query.search
        });
      });
    }
  });

module.exports = router;
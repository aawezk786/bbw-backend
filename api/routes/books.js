const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const BooksControllers = require('../controllers/books');
const checkAuth = require('../middleware/check-auth');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({ accessKeyId: process.env.ACCESS_KEY, secretAccessKey: process.env.SECRET_KEY });

let uploadsingle = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'booksimg',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "" + file.originalname)
        },

    })
});
let uploadjson = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bulksbooks',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "" + file.originalname)
        },

    })
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = "./uploaded_excel";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, './uploaded_excel/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+ file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    cb(null, true);
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/saveBook', uploadjson.single('excel_file'), BooksControllers.saveBooks);
router.delete('/:bookId', BooksControllers.deleteBooks);
router.get('/latest', BooksControllers.latestBooks);
router.get('/popular', BooksControllers.popularbook);
router.get('/', BooksControllers.getAllBooks);
router.get('/:bookId', BooksControllers.detailBooks);
router.get('/categories/:catId', BooksControllers.getBooksByCats);
router.get('/subcategory/:catId', BooksControllers.getBooksBySubCats);
router.post('/singleBook', uploadsingle.array('book_img' ,4), BooksControllers.book_single_post);
router.put('/updategoc/', BooksControllers.update_books);
router.put('/editBook/:id',uploadsingle.array('book_img' ,4),BooksControllers.EditBooks);
module.exports = router;
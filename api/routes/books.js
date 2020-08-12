const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const BooksControllers = require('../controllers/books');
const checkAuth = require('../middleware/check-auth');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({ accessKeyId: 'AKIAJZRZZA5E7WNYVRCA', secretAccessKey: '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' });

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = "./uploaded_excel";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, './uploaded_excel/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + " " + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    cb(null, true);
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/saveBook', upload.single('excel_file'), BooksControllers.saveBooks);
router.delete('/:bookId', BooksControllers.deleteBooks);
router.get('/latest', BooksControllers.latestBooks);
router.get('/', BooksControllers.getAllBooks);
router.get('/:bookId', BooksControllers.detailBooks);
router.get('/categories/:catId', BooksControllers.getBooksByCats);
router.post('/singleBook', uploadsingle.array('book_img', 3), BooksControllers.book_single_post);

module.exports = router;
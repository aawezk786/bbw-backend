const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const BooksControllers = require('../controllers/books');


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

router.post('/saveBook', upload.single('excel_file'),  BooksControllers.saveBooks);
router.delete('/:bookId', BooksControllers.deleteBooks);
router.get('/latest', BooksControllers.latestBooks);
router.get('/', BooksControllers.getAllBooks);
router.get('/:bookId', BooksControllers.detailBooks);
router.get('/categories/:catId', BooksControllers.getBooksByCats);

module.exports = router;
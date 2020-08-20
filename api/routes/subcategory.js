const express = require('express');
const router = express.Router();
const CatControllers = require('../controllers/subcategories');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = "./uploaded_excelcat";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, './uploaded_excelcat/');
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

router.post('/', CatControllers.create_subcats );
router.get('/', CatControllers.getall_subcats);
// router.post('/',upload.single('excel_cat'), CatControllers.createbyexcel);

module.exports = router;
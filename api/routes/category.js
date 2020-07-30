const express = require('express');
const router = express.Router();
const CatControllers = require('../controllers/categories');

router.post('/', CatControllers.create_cats );
router.get('/', CatControllers.getall_cats);

module.exports = router;
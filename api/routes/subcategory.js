const express = require('express');
const router = express.Router();
const CatControllers = require('../controllers/subcategories');

router.post('/', CatControllers.create_subcats );
router.get('/', CatControllers.getall_subcats);

module.exports = router;
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const FilterController = require('../controllers/filters');

router.get('/price', FilterController.sortBy);
router.get('/sort/:first/:second', FilterController.price_sort);


module.exports = router;
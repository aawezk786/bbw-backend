const express = require('express');
const router = express.Router();
const CatControllers = require('../controllers/categories');

router.post('/', CatControllers.create_cats );
router.get('/', CatControllers.getall_cats);
router.delete('/:catId', CatControllers.deleteCats);
router.delete('/delsubcat/:catId', CatControllers.deleteSubcats);
router.post('/:catId', CatControllers.UpdateSubcat);
router.put('/:catId',CatControllers.updateActive);

module.exports = router;
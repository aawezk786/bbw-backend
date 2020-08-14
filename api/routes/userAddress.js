const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const AddressController = require('../controllers/userAddress');


router.post('/new-address', checkAuth, AddressController.addAddress );
router.get('/get-addresses', checkAuth, AddressController.getAddByUser);
router.put('/address',checkAuth,AddressController.EditAdd);
router.delete('/address',checkAuth,AddressController.add_delete);


module.exports = router;
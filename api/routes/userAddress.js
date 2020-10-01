const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const AddressController = require('../controllers/userAddress');


router.post('/new-address', checkAuth, AddressController.addAddress );
router.get('/get-addresses', checkAuth, AddressController.getAddByUser);
router.delete('/address/:add',checkAuth,AddressController.add_delete);
router.get('/get-userdetails/:userId', AddressController.getUserDetails);

module.exports = router;
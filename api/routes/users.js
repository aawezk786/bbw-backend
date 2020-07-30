const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');



router.post('/signup', UsersController.user_signup);
router.post('/verify', UsersController.verification);
router.post('/login', UsersController.user_login);
router.get('/', UsersController.getall_users);
router.patch('/:UserId', UsersController.updateUser);
router.delete('/:UserId', UsersController.user_delete);
router.post('/sendOtp/:Phone' ,UsersController.sendOtp);
router.post('/forgetpw',UsersController.forgetpw);
router.post('/resendOtp/:Phone',UsersController.resendOtp);
router.post('/loginGoogle/',UsersController.loginGoogle);
router.post('/loginFacebook/',UsersController.loginFacebook);
module.exports = router;

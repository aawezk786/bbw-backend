const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');


router.post('/signup', UsersController.user_signup);
router.post('/verify', UsersController.verification);
router.post('/login', UsersController.user_login);
router.get('/', UsersController.getall_users);
router.get('/ById',checkAuth, UsersController.get_userId);
router.patch('/',checkAuth, UsersController.updateUser);
router.delete('/:UserId', UsersController.user_delete);
router.post('/sendOtp/:Phone' ,UsersController.sendOtp);
router.post('/forgetpw',UsersController.forgetpw);
router.post('/resendOtp/:Phone',UsersController.resendOtp);
router.post('/loginGoogle/',UsersController.loginGoogle);
router.post('/loginFacebook/',UsersController.loginFacebook);
router.put('/block/:UserId',UsersController.blockUser);
router.put('/unblock/:UserId',UsersController.unblockUser);

router.post('/update/otp',UsersController.otp);
router.post('/verify/otp',checkAuth,UsersController.verifyOtpUpdate);

module.exports = router;

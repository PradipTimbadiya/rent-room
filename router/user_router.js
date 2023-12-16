const { Router } = require('express');
const UserController = require('../controller/user_controller');
const {multer} = require('../middlewares/multer');
const router = Router();

router.post('/sign-up',UserController.signUp);

router.post('/sign-in',UserController.signIn);

router.post('/forgot-password',UserController.forgotPassword);

router.post("/verify-otp", UserController.verifyOtp);

router.post("/reset-password", UserController.resetPassword);

router.get('/user-data',UserController.userData);

router.post('/google-login',UserController.googleUser);

router.post('/change-profilePic',multer.single('image'),UserController.changeProfilePic);

router.delete('/delete-profilePic',UserController.deleteProfilePic);

router.post('/update-profile',UserController.updateProfile);



module.exports = router;
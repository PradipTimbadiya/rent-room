const { Router } = require('express');
const UserContoller = require('../controller/user_controller');
const {multer} = require('../middlewares/multer');
const router = Router();

router.post('/sign-up',UserContoller.signUp);

router.post('/sign-in',UserContoller.signIn);

router.get('/user-data',UserContoller.userData);

router.post('/google-login',UserContoller.googleUser);

router.post('/change-profilePic',multer.single('image'),UserContoller.changeProfile);

router.delete('/delete-profilePic',UserContoller.deleteProfile);

module.exports = router;
const { Router } = require('express');
const userRouter = require('../router/user_router');
const propertyRouter = require('../router/property_router');
const ratingRouter = require('../router/rating_router');
const contactRating = require('../router/contact_router');
const router= Router();

router.use('/auth',userRouter);
router.use('/property',propertyRouter);
router.use('/feedback',ratingRouter);
router.use('/contact',contactRating);


module.exports = router;

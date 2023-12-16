const { Router } = require('express');
const userRouter = require('../router/user_router');
const propertyRouter = require('../router/property_router');
const router= Router();

router.use('/auth',userRouter);
router.use('/property',propertyRouter);


module.exports = router;

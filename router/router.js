const { Router } = require('express');
const userRouter = require('../router/user_router');
const router= Router();

router.use('/auth',userRouter);

module.exports = router;

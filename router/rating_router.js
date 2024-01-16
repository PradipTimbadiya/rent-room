const { Router } = require('express');
const RatingContoller = require('../controller/rating_controller');
const router = new Router();

router.post('/add-feedback',RatingContoller.addRating);

module.exports = router;
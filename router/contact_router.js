const { Router } = require('express');
const ContactContoller = require('../controller/contact_controller');
const router = new Router();

router.post('/add-issue',ContactContoller.addIssue);

module.exports = router;
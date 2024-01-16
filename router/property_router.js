const { Router } = require('express');
const PropertyContoller = require('../controller/property_contoller');
const {multer} = require('../middlewares/multer');
const router = Router();

router.post('/add-property',multer.fields([{name:"image",maxCount:4}]),PropertyContoller.addProperty);

router.put('/update-property/:id',multer.fields([{name:"image",maxCount:4}]),PropertyContoller.updateProperty);


module.exports=router;

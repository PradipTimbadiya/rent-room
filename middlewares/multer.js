const multer = require('multer');

exports.multer=multer({
    storage:multer.diskStorage({
        filename:function (req,file,cb){
            cb(null,file.originalname)
        }
    }),limits:{fileSize:10000000}
})
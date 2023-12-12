const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.ATLAS)
    .then(()=>{console.log("connection successfully.💥")})
    .catch((e)=>{
        console.log(e);
})
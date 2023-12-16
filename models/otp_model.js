const mongoose = require('mongoose');
const validator = require('validator');

const OTP =mongoose.Schema({
    email:{
        type:String,
        required:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Please Enter Valid E-Mail')
            }
        }
    },
    otp:{
        type:String
    }

});

const OtpModel = mongoose.model('genarate_otp', OTP)


module.exports=OtpModel;
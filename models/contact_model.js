const mongoose = require('mongoose');

const Contact = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    issue:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    toJSON:{
        transform:function(_doc,ret,_option){
            delete ret._id;
        },
        virtuals: true,
        versionKey :false
    }
})

const ContactModel = mongoose.model('contact',Contact);;

module.exports=ContactModel;
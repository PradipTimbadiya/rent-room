const mongoose = require('mongoose');

const Property = mongoose.Schema({
    type:{
        type:String,
        enum:['Sell','Rent'],
        required:true
    },
    city:{
        type:String,
        required:true
    },
    locality:{
        type:String,
        required:true
    },
    propertyType:{
        type:String,
        enum:['Apartment','Independent House','Luxury Affordable House'],
        required:true
    },
    size:{
        type:String,
        required:true
    },
    houseType:{
        type:String,
        enum:['1Rk','1BK','2BHK','3+BHK'],
        required:true
    },
    propertyAge:{
        type:String,
        required:true
    },
    furnishing:{
        type:String,
        enum:['Unfurnished','Semi Furnished','Fully Furnished'],
        required:true
    },
    facility:{
        type:String,
        enum:['Parking','Lift','Garden','Gas Pipline'],
        required:true
    },
    bathrooms:{
        type:String,
        enum:['1','2','3+'],
        required:true
    },
    faching:{
        type:String,
        enum:['North','East','South','West'],
        required:true
    },
    address:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:Array,
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

const PropertyModel = mongoose.model('property',Property);

module.exports = PropertyModel;
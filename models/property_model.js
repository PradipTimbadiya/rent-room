const mongoose = require('mongoose');

const Property = mongoose.Schema({
    type:{
        type:String,
        enum:['Sell','Rent'],
        required:true
    },
    description:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    propertyAge:{
        type:String,
        required:true
    },
    floorNo:{
        type:String,
        required:true
    },
    propertyType:{
        type:String,
        enum:['Appartement','Independent House','Villa','Affordable House'],
        required:true
    },
    faching:{
        type:String,
        enum:['North','East','South','West'],
        required:true
    },
    houseType:{
        type:String,
        enum:['1Rk','1BK','2BHK','3+BHK'],
        required:true
    },
    facility:{
        type:Array,
        // enum:['Parking','Lift','Garden','Gas Pipline','24*7 Security','Inverter'],
        required:true
    },
    furnishing:{
        type:String,
        enum:['Unfurnished','Semi Furnished','Fully Furnished'],
        required:true
    },
    mobileNo:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    image:{
        type:Array,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required:true
   },
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
const mongoose = require('mongoose');

const Rating = mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        enum:['1','2','3','4','5'],
        default:3
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

const RatingModel = mongoose.model('rating',Rating);

module.exports = RatingModel;
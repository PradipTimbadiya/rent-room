const RatingModel = require('../models/rating_model');

const RatingContoller={
    addRating:async function(req,res){
        try {
            const data = req.body;
            const addRating = new RatingModel(data);
            await addRating.save();
            const response = {success:"true",message:"Feedback send successfully"};
            return res.status(200).json(response);
        } catch (error) {
            const response = {success:"false",message:error.message};
            return res.status(400).json(response);
        }
    }
}

module.exports = RatingContoller;
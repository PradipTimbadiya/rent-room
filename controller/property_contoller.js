const PropertyModel = require('../models/property_model');
const UserModel = require('../models/user_model');
const { verifyToken } = require('../utils/verifyToken');
const { uploads } = require('../middlewares/cloudinary');

const PropertyContoller = {
    addProperty: async function (req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userTokenData = verifyToken(token);
            if (!userTokenData) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userId = userTokenData.id;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }

            const data = req.body;
            if (req.files === undefined) {
                return res.status(400).json({ success: false, message: "Image is required" });
            }
            const image = [];
            for (let i = 0; i < req.files['image'].length; i++) {
                let result = await uploads(req.files['image'][i].path);
                image.push(result.secure_url);
            }
            data.image = image;
            const propertyData = new PropertyModel(data);
            await propertyData.save();
            const response = { success: true, message: "Property Add Successfully", };
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = PropertyContoller;
const ContactModel = require('../models/contact_model');
const UserModel = require('../models/user_model');
const {verifyToken} = require('../utils/verifyToken');

const ContactContoller ={
    addIssue: async function(req,res){
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
            if(user.mobileNo != data.mobileNo || user.email != data.email)
            {
                return res.status(401).json({ success: false, message: "invalid data" });
            }

            const addIssue = new ContactModel(data);
            await addIssue.save();
            const response = {success:"true",message:"message send successfully"};
            return res.status(200).json(response);

        } catch (error) {
            const response = {success:"false",message:error.message};
            return res.status(400).json(response);
        }
    }
}

module.exports = ContactContoller
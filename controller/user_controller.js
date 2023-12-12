const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const {genrateToken} = require('../utils/genrateToken');
const {verifyToken} = require('../utils/verifyToken');
const { transporter } = require('../utils/nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const client = new OAuth2Client(process.env.CLIENTID);
const {uploads,destroy} = require('../middlewares/cloudinary');
const { publicUrl } = require('../middlewares/profilepic');


const UserContoller ={
    signUp:async function(req,res) {
        try {
            const data = req.body;
            const findUser = await UserModel.findOne({"email":data.email});

            if(data.role === 'ADMIN')
            {
                const response = { success: false,message: "User Already Exists" };
                return res.status(401).json(response); 
            }
            if(findUser)
            {
                const response = { success: false,message: "User Already Exists" };
                return res.status(401).json(response); 
            }

            const nameFirstLetter = data.name.toLowerCase().slice(0, 1);
            const url = publicUrl(nameFirstLetter);
            const user = new UserModel({ ...data, image: url });
            await user.save();

            const token = genrateToken(user._id);

            const emailTemp = `
            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div style="padding: 20px; background-color: white; text-align: center;">
                            <img src="https://media.istockphoto.com/id/1472307744/photo/clipboard-and-pencil-on-blue-background-notepad-icon-clipboard-task-management-todo-check.webp?b=1&s=170667a&w=0&k=20&c=WfRoNKWq5Dr-23RuNifv1kbIR1LVuZAsCzzSH2I3HsY=" alt="Logo" width="200" height="100" style="display: block; margin: 0 auto;">
                                <h1>Welcome to Our Service!</h1>
                                <p>Dear ${user.name},</p>
                                <p>Thank you for registering with Our app. You're now a part of our community.</p>
                                <p>Your account details:</p>
                                
                                <strong>Username:</strong> ${user.name}<br>
                                <strong>Email:</strong> ${user.email}
                                
                                <p>We're excited to have you on board, and you can start using our service right away.</p>
                                <p>If you have any questions or need assistance, please don't hesitate to contact our support team at pradiptimbadiya@gmail.com.</p>
                                <p>Best regards,</p>
                                <p>Rent-room</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

            `

            transporter.sendMail({
                to: user.email,
                subject: "Rent-room",
                html: emailTemp
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email Sent : " + info.response);
                }
            });

            const response = { success: true ,message: "Signup Successfully",token: token };
            return res.status(200).json(response); 
        } catch (error) {
            const response = { success: false,message: error.message };
            return res.status(400).json(response);
        }
    },
    signIn:async function(req,res){
        try {
            const data = req.body;
            const findUser = await UserModel.findOne({"email":data.email});
            if(!findUser)
            {
                const response = { success: false,message: "User Not Exists" };
                return res.status(401).json(response);
            }
            const matchPass = await bcrypt.compare(data.password,findUser.password);
            if(!matchPass)
            {
                const response = { success: false,message: "User Not Exists" };
                return res.status(401).json(response);
            }
            const token = genrateToken(findUser._id);
            const response = { success: true ,message: "Signin Successfully",token: token };
            return res.status(200).json(response); 
        } catch (error) {
            const response = { success: false,message: error.message };
            return res.status(400).json(response);
        }
    },
    userData:async function(req,res){
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userTokenData = verifyToken(token);
            if (!userTokenData.id) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userId = userTokenData.id;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const response = { success: true, data: user };
            return res.status(200).json(response);

        } catch (error) {
            const response = { success: false,message: error.message };
            return res.status(400).json(response);
        }
    },
    googleUser: async function (req, res) {
        try {
            const token = req.body.token;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENTID
            })
            let payload = ticket.getPayload();
            const findUser = await UserModel.findOne({ email: payload.email });
            if (findUser) {
                const userToken = genrateToken(findUser._id);
                const response = {
                    success: true,
                    data: findUser,
                    message: "SignIn successfully",
                    token: userToken,
                };
                return res.status(200).json(response);
            }
            const result = await uploads(payload.picture, "profile");
            const newUser = new UserModel({
                name: payload.name,
                email: payload.email,
                image: result.secure_url,
                publicUrl: result.public_id,
                isLogin: true
            });
            await newUser.save();
            const userToken = genrateToken(newUser._id);
            
            const emailTemp = `
            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div style="padding: 20px; background-color: white; text-align: center;">
                            <img src="https://media.istockphoto.com/id/1472307744/photo/clipboard-and-pencil-on-blue-background-notepad-icon-clipboard-task-management-todo-check.webp?b=1&s=170667a&w=0&k=20&c=WfRoNKWq5Dr-23RuNifv1kbIR1LVuZAsCzzSH2I3HsY=" alt="Logo" width="200" height="100" style="display: block; margin: 0 auto;">
                                <h1>Welcome to Our Service!</h1>
                                <p>Dear ${user.name},</p>
                                <p>Thank you for registering with Our app. You're now a part of our community.</p>
                                <p>Your account details:</p>
                                
                                <strong>Username:</strong> ${user.name}<br>
                                <strong>Email:</strong> ${user.email}
                                
                                <p>We're excited to have you on board, and you can start using our service right away.</p>
                                <p>If you have any questions or need assistance, please don't hesitate to contact our support team at pradiptimbadiya@gmail.com.</p>
                                <p>Best regards,</p>
                                <p>Rent-room</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

            `

            transporter.sendMail({
                to: user.email,
                subject: "Rent-room",
                html: emailTemp
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email Sent : " + info.response);
                }
            });

            const response = { success: true, message: "New User Created", token: userToken };
            return res.status(200).json(response);

        } catch (error) {
            const response = { success: false, message: error.message };
            return res.status(400).json(response)
        }
    },
    changeProfile: async function (req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userTokenData = verifyToken(token);
            if (!userTokenData.id) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userId = userTokenData.id;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const path = req.file?.path;
            
            if(user.publicUrl !== null) {
                const r = await destroy(user.publicUrl)
            }

            const result = await uploads(path, "profile_pic");
            user.publicUrl = result.public_id;
            user.image = result.secure_url;

            await user.save();
            
            const response = {
                success: true,
                data: user,
                message: "Profile Picture Changed"
            };
            return res.status(200).json(response);

        } catch (error) {
            const response = { success: false, message: error.message };
            return res.status(400).json(response)
        }
    },
    deleteProfile: async function (req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userTokenData = verifyToken(token);
            if (!userTokenData.id) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            const userId = userTokenData.id;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "invalid user" });
            }
            if(user.publicUrl !== null) {
                const r = await destroy(user.publicUrl)
            }
            const nameFirstLetter = user.name.toLowerCase().slice(0, 1);
            const url = publicUrl(nameFirstLetter);
            user.image=url;
            user.publicUrl=null;
            await user.save();

            const response = {
                success: true,
                message: "Profile Picture deleted",

            };
            return res.status(200).json(response);

        } catch (error) {
            const response = { success: false, message: error.message };
            return res.status(400).json(response)
        }
    },
}

module.exports = UserContoller;
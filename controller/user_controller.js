const UserModel = require('../models/user_model');
const OtpModel = require('../models/otp_model');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateToken');
const {verifyToken} = require('../utils/verifyToken');
const { transporter } = require('../utils/nodemailer');
const {generateOTP} = require('../utils/generateOtp');
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

            const token = generateToken(user._id);

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
            const token = generateToken(findUser._id);
            const response = { success: true ,message: "Signin Successfully",token: token };
            return res.status(200).json(response); 
        } catch (error) {
            const response = { success: false,message: error.message };
            return res.status(400).json(response);
        }
    },
    forgotPassword: async function (req, res) {
        try {
            email = req.body.email;
            const findUser = await UserModel.findOne({ email });

            if (!findUser) {
                const response = { success: false, message: "Email is not found" };
                return res.status(401).json(response);
            }

            const otp = generateOTP();
            const mailFormat = `
            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f0">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <div style="padding: 20px; background-color: #ffffff; text-align: center;">
                                <img src="https://media.istockphoto.com/id/1300422159/photo/woman-hand-enter-a-one-time-password-for-the-validation-process-mobile-otp-secure.webp?b=1&s=170667a&w=0&k=20&c=eADS7XcHTFs4kNItYwelOtHYFVbl0RWpSuXJgjFjai4=" alt="OTP Image" width="200" height="200" style="display: block; margin: 0 auto;">
                                    <h1>One-Time Password OTP Verification</h1>
                                    <p>Hello there!</p>
                                    <p>Your OTP code is: <strong style="font-size: 24px;">${otp}</strong></p>
                                    <p>This OTP will expire in 1 minutes.</p>
                                    <p>If you didn't request this OTP, please ignore this email.</p>
                                    <P>Don't share your otp with someone else.</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            </table>
            `

            const mailOptions = {
                to: findUser.email,
                subject: "Forget Password OTP ",
                html: mailFormat,
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    const response = { success: false, message: error.message };
                    return res.status(400).json(response);
                }
                else {
                    await OtpModel.findOneAndDelete({ email: findUser.email })
                    const user = new OtpModel({ email: findUser.email, otp: otp });
                    await user.save();

                    setTimeout(async () => {
                        await OtpModel.findOneAndDelete({ email: findUser.email })
                    }, 1000 * 60)

                    const response = { success: true, message: "Otp Send" };
                    return res.json(response);
                }
            });
        } catch (error) {
            const response = { success: false, message: error.message };
            return res.status(400).json(response);
        }
    },
    verifyOtp: async function (req, res) {
        try {
            email = req.body.email;
            otp = req.body.otp;

            const findUser = await OtpModel.findOne({ email });

            if (!findUser) {
                const response = { success: false, message: "otp not sent" };
                return res.status(401).json(response);
            }

            if (findUser.otp != otp) {
                const response = { success: false, message: "otp is wrong" };
                return res.status(401).json(response);
            }
            await OtpModel.findOneAndDelete({ email: findUser.email })
            const response = { success: true, message: "otp is right" };
            return res.json(response);

        } catch (error) {
            const response = { success: false, message: error.message };
            return res.status(400).json(response);
        }
    },
    resetPassword: async function (req, res) {
        try {
            email = req.body.email;
            newPassword = req.body.password;

            const findUser = await UserModel.findOne({ email });

            if (!findUser) {
                const response = { success: false, message: "User Not Exist" };
                return res.status(401).json(response);
            }
            findUser.password = newPassword;
            await findUser.save();

            const response = { success: true, message: "Password is change" };
            return res.json(response);

        } catch (error) {
            const response = { success: false, message: error.message };
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
    changeProfilePic: async function (req, res) {
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
    deleteProfilePic: async function (req, res) {
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
    updateProfile:async function(req,res){
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
            const data = req.body;
            const updateProfile = await UserModel.findByIdAndUpdate(userId,{$set:{...data}},{new:true});
            await updateProfile.save();

            const response = { success: true, message:"Profile Updated" };
            return res.status(200).json(response)
        } catch (error) {
            const response = { success: false, message: error.message };
            return res.status(400).json(response)
        }
    }

}

module.exports = UserContoller;
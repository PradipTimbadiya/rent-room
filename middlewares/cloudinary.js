const cloudinary=require('cloudinary').v2;
const dotenv=require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.APIKEY, 
    api_secret: process.env.APISECRET 
})

exports.uploads = async function uploads(file, folder) {
    const result = await cloudinary.uploader.upload(file, { folder: folder, overwrite: true })
    return result
}
exports.destroy = async function uploads(publicUrl) {
    const result = await cloudinary.uploader.destroy(publicUrl)
    return result
}
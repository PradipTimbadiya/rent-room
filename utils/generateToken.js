const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = function(data){
    const token = jwt.sign({id:data},process.env.SECRET_KEY);
    return token;
}

module.exports.generateToken = generateToken;
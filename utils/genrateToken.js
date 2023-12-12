const jwt = require('jsonwebtoken');
require('dotenv').config();

const genrateToken = function(data){
    const token = jwt.sign({id:data},process.env.SECRET_KEY);
    return token;
}

module.exports.genrateToken = genrateToken;
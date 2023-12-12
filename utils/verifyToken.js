const jwt = require('jsonwebtoken');

const verifyToken = function(token){
    try {
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        return verifyToken;
    } catch (error) {
        return undefined;
    }
}

module.exports.verifyToken = verifyToken;
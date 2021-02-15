const jwt = require('jsonwebtoken');

async function encodeToken(email) {
    let token = jwt.sign({
        email: email
    },
    'yukirocks', {
        expiresIn: "1h",
    }); 
    return token;
}

async function decodeToken(token) {
    let decoded = jwt.verify(token,'yukirocks');

    if(decoded){
        return decoded;
    }else{
        return false;
    }
}

exports.encodeToken = encodeToken;
exports.decodeToken = decodeToken;


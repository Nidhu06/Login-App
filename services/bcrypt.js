const bcrypt = require('bcryptjs');

async function compareHash(pwd, DBpwd) {
    const match = await bcrypt.compare(pwd, DBpwd);
    if(match) {
        return true;
    }
    else{
        return false;
    }
}

async function generateHash(password) {
    let saltRounds = await bcrypt.genSalt(10);
    let hashedPwd = await bcrypt.hash(password, saltRounds)
    return hashedPwd;
}

exports.compareHash = compareHash;
exports.generateHash = generateHash;



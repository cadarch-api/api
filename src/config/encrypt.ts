const bcrypt = require('bcrypt');
const saltRounds = 10;


export async function encryptPassword(plainPassword: String) {
    try {
        const encyptedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return encyptedPassword;
    }
    catch (ex) {
        return ex
    }
}


export async function verifyPassword(plainPassword: String, hashedPassword: String) {
    try {
        encryptPassword(plainPassword);
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    }
    catch (ex) {
        return ex;
    }
}
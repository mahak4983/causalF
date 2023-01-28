const errMessage = "'user-id' must contains only upper or lower case english characters, digits(0-9) and  underscore'_'";

const test = (userId) => {
    const regex = /^[A-Za-z0-9_]{3,255}$/;

    if (typeof userId !== 'string' || !regex.test(userId)) {
        return false;
    }
    return true;
};

module.exports.errMessage = errMessage;
module.exports.validate = test;

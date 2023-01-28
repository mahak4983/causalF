const errMessage = 'Name should only contains english alphabets!';

const test = (name) => {
    const regex = /^[A-Za-z ]{2,255}$/;
    if (typeof name !== 'string' || !regex.test(name)) {
        return false;
    }
    return true;
};

module.exports.errMessage = errMessage;
module.exports.validate = test;

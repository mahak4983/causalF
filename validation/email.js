const errMessage = 'The email-id is invalid!';

const test = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (typeof email !== 'string' || !regex.test(email)) {
        return false;
    }
    return true;
};

module.exports.errMessage = errMessage;
module.exports.validate = test;

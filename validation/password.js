const errMessage = "A password should be Minimum length of 8 characters, At least one uppercase letter, At least one lowercase letter, At least one digit between 0-9, At least one special character ";

const test = (pass) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    if (typeof pass !== "string" || !regex.test(pass)) {
        return false;
    }
    return true;
};

module.exports.validate = test;
module.exports.errMessage = errMessage;

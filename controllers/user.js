const User = require('../schema/User');
const bcrypt = require("bcrypt");
const nameValidator = require('../validation/name');
const usernameValidator = require('../validation/username');
const emailValidator = require('../validation/email');
const passwordValidator = require('../validation/password');

const SALT_ROUNDS = 12;


exports.registerUser = async (req, res) => {
 
    const {
        name, userName, email, password,
    } = req.body;



    try {

         
        if (!usernameValidator.validate(userName)) {
            res.status(400).send({
                message: 'Incorrect parameters',
                password: usernameValidator.errMessage,
            });
            return;
        }
        if (!nameValidator.validate(name)) {
            res.status(400).send({
                message: 'Incorrect parameters',
                password: nameValidator.errMessage,
            });
            return;
        }
        if (!emailValidator.validate(email)) {
            res.status(400).send({
                message: 'Incorrect parameters',
                password: emailValidator.errMessage,
            });
            return;
        }
        // check the password field before hashing
        if (!passwordValidator.validate(password)) {
            res.status(400).send({
                message: 'Incorrect parameters',
                password: passwordValidator.errMessage,
            });
            return;
        }
        // hash the user's password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        console.log(hashedPassword)

        console.log(req.body)
        const userData = {
            userName,
            name,
            email,
            password: hashedPassword,
        };


        const newUser = new User(userData);
        
        // put the user's data in the database
        await newUser.save();

        res.send({ message: 'Successfully registered. Kindly login!' });
    } catch (e) {
        if (e.name === 'MongoError' && e.code === 11000) {
            // duplicate key error
            res.status(400).send({ userId: 'Username unavailable' });
            return;
        }
        res.status(500).send({ message: 'Internal server error!' });
    }


}
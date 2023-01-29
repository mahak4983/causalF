const User = require('../schema/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const nameValidator = require('../validation/name');
const usernameValidator = require('../validation/username');
const emailValidator = require('../validation/email');
const passwordValidator = require('../validation/password');

const { JWT_SECRET } = require('../config/keys')
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

exports.loginUser = async (req, res) => {
    const { uid, password } = req.body;
    // Validate the parameters
    const err = {};
    if (!usernameValidator.validate(uid) && !emailValidator.validate(uid)) {
        err.uid = 'Invalid username/email';
    }
    if (!passwordValidator.validate(password)) {
        err.password = passwordValidator.errMessage;
    }
    if (Object.keys(err).length !== 0) {
        // there are some errors while validating the parameters
        return res.status(400).send(err);
    }

    try {
        // Get the user
        const userInfo = await User.findOne(
            { $or: [{ userName: uid }, { email: uid }] },
            {
                password: 1, _id: 1, name: 1, email: 1, blogsCreated: 1
            },
        );
        
        if (userInfo === null) {
            // user is not registered
            return res.status(404).send({
                message: 'User not registered',
            });
        }
        
        // Check if correct password was entered
        const validatePassword = await bcrypt.compare(password, userInfo.password);
        if (validatePassword === false) {
            return res.status(401).send({
                message: 'Incorrect password!',
            });
        }
        
        // remove the password
        delete userInfo.password;
        
        // Sign the jwt and send back to the user
        const signedToken = await jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                data: userInfo,
            },
            JWT_SECRET,
            );
        res.header('x-auth-token', signedToken);
        return res.send({ message: 'Login successful', userInfo });
    } catch (e) {
        return res.status(500).send({ message: 'Internal server error!' });
    }
}

exports.postForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }
        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
        });
        const link = `http://localhost:8080/api/v1/auth/reset-password/${oldUser._id}/${token}`;
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'polly.damore68@ethereal.email',
                pass: 'HX1RwFTdKxJSbS7mfd'
            }
        });

        var mailOptions = {
            from: "polly.damore68@ethereal.email",
            to: `${email}`,
            subject: "Password Reset",
            text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
                return res.status(200).send({ message: "Email sent" });
            }
        });
        console.log(link);
    } catch (e) {
        
    }
}

exports.getResetPassword = async (req, res) => {

        const { id, token } = req.params;
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }
        const secret = JWT_SECRET + oldUser.password;
        try {
            const verify = jwt.verify(token, secret);
            res.status(200).send({ message: "Verified" });
          //  res.render("index", { email: verify.email, status: "Not Verified" });
        } catch (error) {
            console.log(error);
            res.send("Not Verified");
        }
   
}

exports.postResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );
        res.status(200).send({ message: " Password Updated" });
       
    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
}
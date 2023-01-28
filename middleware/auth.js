const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys')

const auth = async (req, res, next) => {
    const authToken = req.headers['x-auth-token'];

    if (authToken !== undefined) {
        try {
            const decodedInfo = await jwt.verify(
                authToken,
                JWT_SECRET,
            );
            // attach the decodedInfo with the request and call the next middleware
            req.userInfo = decodedInfo.data;
            next();
            return;
        } catch (e) {
            // Invalid token
            res.status(401).send({ message: 'Not authenticated' });
            return;
        }
    }
    // token not found
    res.status(401).send({ message: 'Not authenticated' });
};

module.exports = auth;

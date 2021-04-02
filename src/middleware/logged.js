const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware de verificação se o user está loggado ou se está deslogado e tem sessão e devolve esses valores

const auth = async (req, res, next) => {
    if (req.header('Authorization')) {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'vanesecret123');
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!user) {
            throw new Error()
        }

        req.user = user;
        req.token = token;
    } else if (req.sessionID) {
        const user = {
            _id: req.sessionID
        };

        req.user = user;
        req.token = null;
    }
    next();
}

module.exports = auth;
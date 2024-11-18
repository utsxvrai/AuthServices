const { JWT_KEY } = require("../config/server-config");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const validateUserAuth = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: {},
            message: 'Something went wrong',
            err: 'Email or password missing in the request'
        });
    }
    next();
}

const validateIsAdminRequest = (req, res, next) => {
    if(!req.body.id) {
        return res.status(400).json({
            success: false,
            data: {},
            err: 'User id not given',
            message: 'Something went wrong'
        })
    }
    next();
}
const validateToken = (req, res, next) => {
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            data: {},
            message: 'Something went wrong',
            err: 'Invalid or expired token',
        });
    }
};

module.exports = {
    validateUserAuth,
    validateIsAdminRequest,
    validateToken
}
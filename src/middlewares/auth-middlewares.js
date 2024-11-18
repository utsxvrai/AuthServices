const { JWT_KEY } = require("../config/server-config");

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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({
            success: false,
            data: {},
            message: 'Something went wrong',
            err: 'Authorization header is missing or improperly formatted',
        });
    }
    const token = authHeader.split(' ')[1]; 
    try {
    
        // const decodedPayload = jwt.decode(token);
        // console.log("Decoded Payload:", decodedPayload);
        const decoded = jwt.verify(token, JWT_KEY);
        console.log("Verified Decoded:", decoded);
        req.userId = decoded.id; 
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
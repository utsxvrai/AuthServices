const dotenv = require('dotenv');
const bcrypt = require('bcrypt');


dotenv.config();
module.exports ={
    PORT: process.env.PORT || 3000,
    SALT: bcrypt.genSaltSync(9),
    JWT_KEY: process.env.JWT_KEY
}
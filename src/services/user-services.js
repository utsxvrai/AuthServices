const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {UserRepository} = require('../repositories');
const { JWT_KEY } = require('../config/server-config');
const AppErrors = require('../utils/error-handler');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw error;
            }
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async signIn(email, plainPassword) {
        try {
            const user = await this.userRepository.getByEmail(email);
            const passwordsMatch = this.checkPassword(plainPassword, user.password);

            if(!passwordsMatch) {
                console.log("Password doesn't match");
                throw {error: 'Incorrect password'};
            }
            // step 3-> if passwords match then create a token and send it to the user
            const newJWT = this.createToken({email: user.email,name: user.name,id: user.id});
            console.log('Generated Token:', newJWT);
            return newJWT;
        } catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if(!response) {
                throw {error: 'Invalid token'}
            }
            const user = await this.userRepository.getById(response.id);
            if(!user) {
                throw {error: 'No user with the corresponding token exists'};
            }
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the auth process");
            throw error;
        }
    }

    async getProfile(token) {
        try {
      // Verify the token to extract the user ID

        const decoded = this.verifyToken(token);
        if (!decoded || !decoded.id) {
            throw { error: 'Invalid token' };
        }

      // Fetch the user by ID
        const user = await this.userRepository.getById(decoded.id);
        if (!user) {
            throw { error: 'User not found' };
        }

      // Return the user's profile data
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        } catch (error) {
        console.log('Something went wrong while fetching the profile');
        throw error;
        }
    }


    createToken(user) {
        try {
            console.log('JWT_KEY during token creation:', JWT_KEY);
            const result = jwt.sign(user, JWT_KEY, {expiresIn: '7d'});
            return result;
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong in token validation", error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password comparison");
            throw error;
        }
    }

    isAdmin(userId) {
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }
}

module.exports = UserService;
const User = require('../models/userSchema');

async function createUser (userData) {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

async function getUserByEmail (email) {
    try {
        const user = await User.findOne({ email });
        return user;
    }
    catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

async function getUserById (id) {
    try {
        const user = await User.findById(id);
        return user;
    }
    catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}



module.exports = {
    createUser,
    getUserByEmail,
    getUserById
}
const User = require('../models/userSchema');
const Registration = require('../models/registrationModel');

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

//get users registered events in sorted of events date gte date.now()
async function getRegisteredEvents(userId) {
    try {
        // Get all registrations for the user
        const registrations = await Registration.find({ userId }).populate('eventId');

        // Filter out events with dates in the past and sort remaining events by date
        const now = new Date();
        const upcomingEvents = registrations
            .map(registration => registration.eventId) // Extract eventId from registrations
            .filter(event => event.date >= now) // Filter out past events
            .sort((a, b) => a.date - b.date); // Sort events by date

        return upcomingEvents;
    }
    catch (error) {
        console.error('Error fetching registered events:', error);
        throw error;
    }
}


module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getRegisteredEvents
}
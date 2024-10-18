const User = require('../models/userSchema');
const Registration = require('../models/registrationModel');
const Event = require('../models/schemaDB');
const PasswordReset = require('../models/PasswordReset');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function createUser(userData) {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    }
    catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

async function getUserById(id) {
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
            .filter(event => event && event.date >= now) // Check if event is not null and its date is in the future
            .sort((a, b) => a.date - b.date); // Sort events by date

        return upcomingEvents;
    }
    catch (error) {
        throw error;
    }
}

//check if this event is created by user retrun true or false
async function checkEvent(eventId, userId) {
    try {
        const event = await Event.findOne({ _id: eventId, userId: userId });
        return event ? true : false;
    }
    catch (error) {
        console.error('Error fetching event:', error);
        throw error;
    }
}

async function generatePasswordReset(email) {
    try {
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour
        const reset = new PasswordReset({
            email,
            token,
            expires
        });
        await reset.save();
        return token;
    }
    catch (error) {
        console.error('Error generating password reset:', error);
        throw error;
    }
    
}

//function to get password reset by token
async function getPasswordReset(token) {
    try {
        const reset = await PasswordReset.findOne({
            token,
            expires: { $gt: Date.now() }
        });
        return reset;
    }
    catch (error) {
        console.error('Error fetching password reset:', error);
        throw error;
    }
}

//function to send mail to user with password reset link
async function sendPasswordResetEmail(email, token) {
    try {
        const link = `${process.env.FRONTEND_URL}/password-reset/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset',
            text: `Click on the link to reset your password: ${link}`,
            html: `<p>Click <a href="${link}">here</a> to reset your password</p>`
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
    
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getRegisteredEvents,
    checkEvent,
    generatePasswordReset,
    sendPasswordResetEmail,
    getPasswordReset
}
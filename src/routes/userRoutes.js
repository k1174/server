const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken');
require('dotenv').config()


//Route to register a new user
router.post('/register', async (req, res) => {
    console.log("register")
    try {
        const userData = req.body
        //find if email id already exists
        const user = await userController.getUserByEmail(userData.email);
        if (user) {
            if (user.confirmation) {
                return res.status(400).json({ error: 'User with this email already exists' });
            } else {
                // Resend confirmation email if the account is unconfirmed
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                await userController.sendConfirmationEmail(user.email, token);
                return res.status(400).json({ error: 'Account exists but is unconfirmed. A new confirmation email has been sent.' });
            }
        }

        const savedUser = await userController.createUser(userData);
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //send email to user to confirm email
        await userController.sendConfirmationEmail(savedUser.email, token);

        console.log('User saved successfully:', savedUser);
        res.status(201).json({
            message: 'Check Your Mail to Confirm Your Account',
            savedUser
        });
    }
    catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: err.message });
    }
})

//Route to confirm account
router.post('/confirmaccount', async (req, res) => {
    try {
        const { token } = req.body;        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userController.getUserById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.confirmation = true;
        await user.save();
        res.json({ message: 'Account confirmed successfully' });
    }
    catch (err) {
        console.error('Error confirming Account:', err);
        res.status(500).json({ error: err.message });
    }
})

//Route to login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userController.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ message: 'User logged in successfully', token });
    }
    catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: err.message });
    }
})

//route for foregot password
router.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userController.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = await userController.generatePasswordReset(email);
        await userController.sendPasswordResetEmail(email, token);
        res.json({ message: 'Password reset link sent to email', token });
    }
    catch (err) {
        console.error('Error generating password reset link:', err);
        res.status(500).json({ error: err.message });
    }
})

//route to reset password
router.post('/resetPassword', async (req, res) => {
    try {
        const { token, newpassword } = req.body;
        const reset = await userController.getPasswordReset(token);
        if (!reset) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }
        const user = await userController.getUserByEmail(reset.email);
        user.password = newpassword;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }
    catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ error: err.message });
    }
})

// Route to get the profile of the logged-in user
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userController.getUserById(decoded.id);
        res.json(user);
    }
    catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: err.message });
    }
})

//Route to get user registration events
router.get('/registrations', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const events = await userController.getRegisteredEvents(decoded.id);
        res.json(events);
    }
    catch (err) {
        console.error('Error fetching registered events:', err);
        res.status(500).json({ error: err.message });
    }
})

// Route to update the profile of the logged-in user


//route to check if event is created by user gets true or false
router.post('/checkEvent', async (req, res) => {
    try{
        const {eventId, token} = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const event = await userController.checkEvent(eventId, userId);
        res.json(event);    

    }
    catch(error){
        console.error('Error fetching event:', error);
        res.status(500).json({ error: error.message });
    }
})

//test
router.get('/test', async (req, res) => {
    res.status(201).json({ message: 'User registered successfully' });
})

module.exports = router;
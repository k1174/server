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
        const savedUser = await userController.createUser(userData);
        console.log('User saved successfully:', savedUser);
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({error: err.message});
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
        res.status(500).json({error: err.message});
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
        res.status(500).json({error: err.message});
    }
})

// Route to update the profile of the logged-in user


//test
router.get('/test', async (req, res) => {
    res.status(201).json({ message: 'User registered successfully' });
})

module.exports = router;
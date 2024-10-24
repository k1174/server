const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Event = require('../models/schemaDB');
const Registration = require('../models/registrationModel');
const User = require('../models/userSchema');
const Feedback = require('../models/feedback');


router.get('/test', async (req, res) => {
    res.status(201).json({ message: 'User registered successfully' });
})

// router to get all event ids which are approved
router.get('/getApprovedEvents', async (req, res) => {
    const eventIds = await Event.find({ status: 'approved' }).select('_id');
    res.status(200).json(eventIds);
})

// router to register user for an event
router.post('/registerEvent', async (req, res) => {

    try {
        const { userId, eventId, additionalDetails } = req.body;
        // Check if a registration already exists for this user and event
        const existingRegistration = await Registration.findOne({ userId, eventId });

        if (existingRegistration) {
            return res.status(400).json({ message: 'User is already registered for this event' });
        }

        const registration = new Registration({ userId, eventId, additionalDetails });
        const savedRegistration = await registration.save();
        res.status(201).json({ message: 'User registered for event', savedRegistration });

    }
    catch (err) {
        console.error('Error registering user for event:', err);
        res.status(500).json({ error: err.message });
    }
})

//router to get userId where role is user
router.get('/getUsers', async (req, res) => {
    const users = await User.find({ role: 'user' }).select('_id');
    res.status(200).json(users);
})


//router to get events of an user
router.post('/getEvents', async (req, res) => {
    // const { userId } = req.query;
    const { userId } = req.body;
    try {

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const registrations = await Registration.find({ userId }).populate('eventId');
        if (!registrations.length) {
            return res.status(404).json({ message: 'No events found for this user' });
        }


        // Get today's date 
        const now = new Date();
        // Filter out events based on date 
        const upcomingEvents = registrations
            .map(reg => reg.eventId)
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= now;
            });

        if (upcomingEvents.length === 0) {
            return res.status(404).json({ message: 'No upcoming events found for this user' });
        }

        res.status(200).json(upcomingEvents);
    }
    catch (err) {
        console.error('Error getting events:', err);
        res.status(500).json({ error: err.message });
    }
})

//route to users emailId of an event
router.get('/getUsers/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const registrations = await Registration.find({ eventId }).populate('userId');
        if (!registrations.length) {
            return res.status(404).json({ message: 'No users found for this event' });
        }

        const users = registrations.map(reg => reg.userId.email);
        res.status(200).json(users);
    }
    catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({ error: err.message });
    }
})

//route to get count of users registered for an event
router.get('/getUsersCount/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const count = await Registration.countDocuments({ eventId });
        res.status(200).json({ count });
    }
    catch (err) {
        console.error('Error getting count:', err);
        res.status(500).json({ error: err.message });
    }
})

router.get('/getRegistrations/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const registraions = await Registration.find({ eventId }).select('additionalDetails');
        res.status(200).json(registraions)
    }
    catch (err) {
        console.error('Error fetching registraions', err);
        res.status(500).json({ error: err.message });
    }
})

//route to get feedback from user
router.post('/feedback', async (req, res) => {
    try {
        const { userId, eventId, feedback, rating } = req.body;

        const newFeedback = new Feedback({ userId, eventId, feedback, rating });
        const savedFeedback = await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', savedFeedback });
    }
    catch (err) {
        console.error('Error submitting feedback:', err);
        res.status(500).json({ error: err.message });
    }
})

//router to get report
router.get('/getReport/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const feedbacks = await Feedback.find({ eventId });
        // if (!feedbacks.length) {
        //     return res.status(404).json({ message: 'No feedback found for this event' });
        // }

        // const registrations = await Registration.find({ eventId }).populate('userId');
        // const users = registrations.map(reg => reg.userId.email);

        // const avgRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;
        // const feedbackCount = feedbacks.length;
        const feedbackContent = feedbacks.map(feedback => {
            return `feedback: ${feedback.feedback}, rating: ${feedback.rating}`
        });
        res.status(200).json(feedbackContent);
    }
    catch (err) {
        console.error('Error getting report:', err);
        res.status(500).json({ error: err.message });
    }
})

//router to getFeedbacks
router.get('/getFeedbacks/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const feedbacks = await Feedback.find({ eventId }).populate('userId');
        if (!feedbacks.length) {
            return res.status(404).json({ message: 'No feedback found for this event' });
        }
        res.status(200).json(feedbacks);
    }
    catch (err) {
        console.error('Error getting feedbacks:', err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;
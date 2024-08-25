const mongoose = require("mongoose")

// Define schema for Feedback
const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true },   
    feedbackDate: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
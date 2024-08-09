const mongoose = require("mongoose")

// Define schema for Registration
const registrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registrationDate: { type: Date, default: Date.now },
    // Additional fields such as registration status or payment status can be added if needed
});

// Create a model based on the schema
const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
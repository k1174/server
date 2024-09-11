const mongoose = require("mongoose")

// Define schema for Event
const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    organiserName: { type: String, required: true },
    organiserEmail: { type: String, required: true },
    organiserDepartment: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
});



// Create a model based on the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
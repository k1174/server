const mongoose = require("mongoose")

// Define schema for Event
const eventSchema = new mongoose.Schema({
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
    status: { type: String, default: "pending" }
});



// Create a model based on the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
const mongoose = require("mongoose")
// const Img = require('./ImgModel')

// Define schema for Event
const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    details:{type: String},
    type: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    organiserName: { type: String, required: true },
    organiserEmail: { type: String, required: true },
    organiserDepartment: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
    // image: { type: mongoose.Schema.Types.ObjectId, ref: 'Img' } // Reference to the Img document
    // images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Img' }] // Array of references to Img documents
    images: [{ type: String }],
    formData: { type: [mongoose.Schema.Types.Mixed], default: [] }, // Array of mixed types
    brochure:[{type: String}],
    ActivityReport:[{type:String}]
});



// Create a model based on the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
const Event = require('../models/schemaDB')

async function createEvent(eventData) {

    // Create a new event
    // const newEvent = new Event({
    //     name: 'Sample Event',
    //     location: 'Sample Location',
    //     description: 'Sample Description',
    //     type: 'Sample Type',
    //     department: 'Sample Department',
    //     date: new Date(), // Replace with the actual date
    //     time: '10:00', // Replace with the actual time
    //     price: 0, // Replace with the actual price
    //     organiserName: 'Sample Organiser',
    //     organiserEmail: 'organiser@example.com',
    //     organiserDepartment: 'Organising Department',
    //     status : "approved"
    // });

    try {
        const newEvent = new Event(eventData);//eventData was empty thats why on .save() it was throwing error
        // console.log(eventData)
        const savedEvent = await newEvent.save();
        console.log('Event saved successfully:', savedEvent.name);
        return savedEvent
    }
    catch (error) {
        // console.error('Error saving event:');
        throw error;
    }
}

async function getAllEvents(status) {
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const events = await Event.find({ status: status, date: { $gte: now } })
            .select('-images') // Exclude the images field
            .sort({ date: 'asc' });
        console.log(events.length)
        return events;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

//route to get all pending events
async function getPendingEvents() {
    try {
        const events = await Event.find({ status: "pending" });
        return events;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

async function sortEvents() {
    try {
        const events = await Event.find({ status: "approved" }).sort({ date: 'asc' });
        return events;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

async function getEvents() {
    try {
        const events = await Event.find({ status: "approved" })
            .sort({ date: 1 })  // Sort events by date ascending
            .select('-description')  // Exclude description field
            .lean();  // Return plain JavaScript objects instead of Mongoose documents
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Error fetching events');
    }
}

// Function to get list of types from events
async function getTypes() {
    try {
        // db.events.aggregate([{$group: {_id: "$type"}},{$project:{type:"$_id",_id:0}}])
        const types = await Event.aggregate([
            { $group: { _id: "$type" } },
            { $project: { type: "$_id", _id: 0 } }
        ]);
        return types;
    }
    catch (error) {
        console.error('Error fetching types:', error);
        throw new Error('Error fetching types');
    }
}

async function getEventById(id) {

    try {
        const eventData = await Event.findById(id);
        if (!eventData) {
            throw new Error(`Event with ID ${id} not found`);
        }
        return eventData;
    } catch (error) {
        console.error('Error fetching event:', error);
        throw error;
    }
}

async function updateEvent(id, eventData) {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true });
        return updatedEvent;
    }
    catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}

async function deleteEvent(id) {
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        return deletedEvent;
    }
    catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}

// Function to get past events
async function getPastEvents() {
    try {
        const now = new Date();
        const events = await Event.find({ status: 'approved', date: { $lte: now } }).sort({ date: 'desc' });
        return events;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

//get event created by userId
async function getUserCreatedEvents(userId) {
    try {
        const events = await Event.find({ userId: userId });
        return events;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

//add image to the event
async function addImages(id, imageLinks) {
    if (!Array.isArray(imageLinks)) {
        return res.status(400).json({ message: 'imageLinks must be an array' });
    }
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $push: { images: { $each: imageLinks } } }, // Use $push with $each to add multiple items
            { new: true } // Return the updated document
        );
        return updatedEvent;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//get evnnts by date range
async function getEventsByDateRange(startDate, endDate) {
    try {
        const events = await Event.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 'asc' });
        return events;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    sortEvents,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getPastEvents,
    getUserCreatedEvents,
    getTypes,
    getPendingEvents,
    addImages,
    getEventsByDateRange
};
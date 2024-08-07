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
        console.log(eventData)
        const savedEvent = await newEvent.save();
        console.log('Event saved successfully:', savedEvent);
        return savedEvent
    }
    catch (error) {
        console.error('Error saving event:');
        throw error;
    }
}

async function getAllEvents(status) {
    try {
        const events = await Event.find({ status: status });
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

module.exports = {
    createEvent,
    getAllEvents,
    sortEvents,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
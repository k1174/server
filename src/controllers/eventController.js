const event = require('../models/schemaDB')

async function createEvent(eventData) {

    try {
        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();
        console.log('Event saved successfully:', savedEvent);

    }
    catch (error) {
        console.error('Error saving event:', error);
        throw error;
    }
    // Create a new event
    const newEvent = new Event({
        name: 'Sample Event',
        location: 'Sample Location',
        description: 'Sample Description',
        type: 'Sample Type',
        department: 'Sample Department',
        date: new Date(), // Replace with the actual date
        time: '10:00', // Replace with the actual time
        price: 0, // Replace with the actual price
        organiserName: 'Sample Organiser',
        organiserEmail: 'organiser@example.com',
        organiserDepartment: 'Organising Department'
    });
}

async function getAllEvents(status){
    try{
        const events = await event.find({ status: status });
        return events;
    }
    catch(error){
        console.error('Error fetching events:', error);
        throw error;
    }
}

async function sortEvents(){
    try{
        const events = await event.find({ status: "approved" }).sort({date: 'asc'});
        return events;
    }
    catch(error){
        console.error('Error fetching events:', error);
        throw error;
    }
}

async function getEvents() {
    try {
        const events = await event.find({ status: "approved" })
                                .sort({ date: 1 })  // Sort events by date ascending
                                .select('-description')  // Exclude description field
                                .lean();  // Return plain JavaScript objects instead of Mongoose documents
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Error fetching events');
    }
}



module.exports = {
    createEvent,
    getAllEvents,
    sortEvents,
    getEvents
};
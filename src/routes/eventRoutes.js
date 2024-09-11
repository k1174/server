const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')
const { matchSorter } = require('match-sorter')

router.get('/', (req, res) => {
    res.send("hello")
    // res.sendFile(filePath + '/eventForm.html')
})

// router to get past events
router.get('/events/past', async (req, res) => {
    try {
        const events = await eventController.getPastEvents();
        res.json(events)
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})


router.post('/events/addevent', async (req, res) => {
    console.log("hi");
    try {
        const eventData = req.body
        const savedEvent = await eventController.createEvent(eventData);
        // console.log('Event saved successfully:', savedEvent);
        res.status(200).send('Event saved successfully');
    }
    catch (error) {
        console.error('Error saving event:', error);
        res.status(500).send('Error saving event');
    }
})

router.put('/events/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id", id, " Approved");
        const eventData = req.body;
        const updatedEvent = await eventController.updateEvent(id, eventData);
        res.json(updatedEvent)
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ err: 'Error updating event' })
    }
})

router.delete('/events/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedEvent = await eventController.deleteEvent(id);
        res.json(deletedEvent)
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ err: 'Error deleting event' })
    }
})

router.get('/events', async (req, res) => {

    try {
        let events = await eventController.getAllEvents("approved");
        // res.json(events)

        // get query
        const query = req.query;
        // console.log("get(events)",query.q)
        if (query.q) {
            const filteredEvents = matchSorter(events, query.q);
            events = filteredEvents;
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})

router.get('/events/dates', async (req, res) => {
    try {
        const events = await eventController.sortEvents();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));

    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})

router.get('/admin', async (req, res) => {
    try {

        let events = await eventController.getAllEvents("pending");
        //filter events
        const query = req.query;
        // console.log("get(events)",query.q)
        if (query.q) {
            const filteredEvents = matchSorter(events, query.q);
            events = filteredEvents;
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));

    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})



router.get('/events/test', async (req, res) => {
    try {
        const events = await eventController.getEvents();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));

    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})



router.get('/events/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const event = await eventController.getEventById(id);
        res.json(event)
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ err: 'Error fetching event' })
    }
})

//route to get events of userId
router.get('/events/user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const events = await eventController.getUserCreatedEvents(id);
        res.json(events)
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ err: 'Error fetching event' })
    }
})  

router.get('/admin/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const event = await eventController.getEventById(id);
        res.json(event)
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ err: 'Error fetching event' })
    }
})

module.exports = router;
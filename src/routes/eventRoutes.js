const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')


router.get('/', (req, res) => {
    res.send("hello")
    // res.sendFile(filePath + '/eventForm.html')
})

router.post('/', async (req, res) => {
    try {
        const eventData = req.body
        const savedEvent = await eventController.createEvent(eventData);
        console.log('Event saved successfully:', savedEvent);
        res.redirect('/events')
    }
    catch (error) {
        console.error('Error saving event:', error);
        res.status(500).send('Error saving event');
    }
})

router.get('/events', async (req, res) => {

    try {
        const events = await eventController.getAllEvents("approved");
        // res.json(events)
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})

router.get('/events/dates', async (req, res) => {
    try{
        const events = await eventController.sortEvents();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));

    }
    catch(error){
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})

router.get('/admin', async (req, res) => {
    try{
        const events = await eventController.getAllEvents("pending");
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));

    }
    catch(error){
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})


router.get('/test', async (req, res) =>{
    try{
        const events = await eventController.getEvents();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(events, null, 2));

    }
    catch(error){
        console.error('Error fetching events:', error);
        res.status(500).json({ err: 'Error fetching events' })
    }
})



module.exports = router;
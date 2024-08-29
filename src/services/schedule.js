const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Event = require('../models/schemaDB.js');
const User = require('../models/userSchema.js');
const Registration = require('../models/registrationModel.js');
const dotenv = require('dotenv');
const { sendMail } = require('./mail.js')
dotenv.config();

// Configure mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Helper function to parse time string
const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
};

// Daily cron job to send event reminder
cron.schedule('0 0 * * *', async () => {
    console.log('Running a daily cron job to send event reminders');

    try {
        //get the upcoming event; which are approved
        const events = await Event.find({ status: 'approved', "date": { "$gte": new Date() } });
        //travse each
        for (const event of events) {

            const eventDate = new Date(event.date);
            const time = parseTime(event.time);
            eventDate.setHours(time.hours);
            eventDate.setMinutes(time.minutes);
            eventDate.setSeconds(0);
            eventDate.setMilliseconds(0);

            // Adjust the reminder period (e.g., 1 day before the event)
            const reminderDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);

            if (reminderDate > new Date()) {
                continue;
            }

            // const registration = await Registration.find({ eventId: ObjectId(event._id) });
            // const usersToNotify = registration.map(reg => reg.userId);

            //get userId from registraion having eventId and transfom into array of userid
            const usersToNotify = (await Registration.find({ eventId: event._id }, { userId: 1, _id: 0 })).map(reg => reg.userId);

            const usersEmails = (await User.find({ _id: { $in: usersToNotify } }, { email: 1, _id: 0 })).map(user => user.email);

            const mailOptions = {
                from: process.env.EMAIL,
                to: usersEmails,
                subject: 'Event Reminder',
                text: `Reminder for the event ${event.name} on ${event.date} at ${event.time}`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Reminder email sent for event: ${event.name}`);
        }
    } catch (error) {
        console.error('Error in daily cron job:', error);
    }
});

// Cron job to send event notification 1 hour before the event
cron.schedule('0 * * * *', async () => {
    console.log('Running a cron job to send event notifications 1 hour before the event');

    try {
        const events = await Event.find({ status: 'approved', "date": { "$gte": new Date() } });

        for (const event of events) {

            const eventDate = new Date(event.date);
            const time = parseTime(event.time);
            eventDate.setHours(time.hours);
            eventDate.setMinutes(time.minutes);
            eventDate.setSeconds(0);
            eventDate.setMilliseconds(0);

            const notificationDate = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1 hour before

            if (notificationDate > new Date() || eventDate <= new Date()) {
                continue;
            }


            const usersToNotify = (await Registration.find({ eventId: event._id }, { userId: 1, _id: 0 })).map(reg => reg.userId);
            const usersEmails = (await User.find({ _id: { $in: usersToNotify } }, { email: 1, _id: 0 })).map(user => user.email);

            const mailOptions = {
                from: process.env.EMAIL,
                to: usersEmails,
                subject: 'Event Notification',
                text: `Notification for the event ${event.name} on ${event.date} at ${event.time}`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Notification email sent for event: ${event.name}`);
        }
    } catch (error) {
        console.error('Error in hourly cron job:', error);
    }
});

cron.schedule('1,30 * * * *', async () => {
    console.log('running every minute 1, and 30');
});

// cron.schedule('* * * * *', () => {
//     try {

//         console.log('Cron job is running every minute');
//     } catch (error) {
//         console.error('Error in cron job:', error);
//     }
// });

// cron.schedule('*/10 * * * * *',  ()=>{
//     console.log('running every 10 second');
// })
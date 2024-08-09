import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Event from '../models/event.js';
import User from '../models/user.js';
import Registration from '../models/registration.js';
import { parseTime } from '../utils.js';
import dotenv from 'dotenv';
dotenv.config();

// Configure mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Daily cron job to send event reminder
cron.schedule('0 0 * * *', async () => {
    console.log('Running a daily cron job to send event reminders');
    
    try {
        const events = await Event.find({ status: 'approved' });
        const users = await User.find({ role: 'user' });

        for (const event of events) {
            const registration = await Registration.find({ eventId: event._id });
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

            const usersToNotify = registration.map(reg => reg.userId);
            const usersEmails = users.filter(user => usersToNotify.includes(user._id)).map(user => user.email);

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
        const events = await Event.find({ status: 'approved' });
        const users = await User.find({ role: 'user' });

        for (const event of events) {
            const registration = await Registration.find({ eventId: event._id });
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

            const usersToNotify = registration.map(reg => reg.userId);
            const usersEmails = users.filter(user => usersToNotify.includes(user._id)).map(user => user.email);

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

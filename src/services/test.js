const Event = require('../models/schemaDB');
const Registration = require('../models/registrationModel');
const User = require('../models/userSchema');

// Helper function to parse time string
const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
};

const test = async () => {
    // console.log('test')
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
            console.log('Notification Date:', notificationDate, 'Event Date:', eventDate);
            if (notificationDate > new Date() || eventDate <= new Date()) {
                continue;
            }

            const usersToNotify = registration.map(reg => reg.userId);
            // const usersEmails = users.filter(user => usersToNotify.includes(user._id)).map(user => user.email);

            // Debugging log to see user IDs and emails
            // console.log('Users to notify:', usersToNotify);
            // console.log('Users:', users.map(user => ({ id: user._id.toString(), email: user.email })));


            // Convert userIds to string for comparison
            const usersToNotifyIds = usersToNotify.map(id => id.toString());

            const usersEmails = users
                .filter(user => usersToNotifyIds.includes(user._id.toString()))
                .map(user => user.email);

            console.log('Users to notify:', usersToNotifyIds);
            // console.log('Filtered users:', users.filter(user => usersToNotifyIds.includes(user._id.toString())));
            console.log('Users Emails:', usersEmails);

            // Check the length to make sure emails are being populated
            console.log('usersEmails', usersEmails.length, usersToNotify.length);

            // console.log('usersEmails', usersEmails.length, usersToNotify.length)

            // const mailOptions = {
            //     from: process.env.EMAIL,
            //     to: usersEmails,
            //     subject: 'Event Notification',
            //     text: `Notification for the event ${event.name} on ${event.date} at ${event.time}`
            // };

            // await transporter.sendMail(mailOptions);
            console.log(`Notification email sent for event: ${event.name}`);
        }
    } catch (error) {
        console.error('Error in hourly cron job:', error);
    }
}

const getMails = async () => {
    const events = await Event.find({ status: 'approved',"date": {"$gte": new Date()}});
    const data = []
    for (const event of events) {
        // const eventId = mongoose.Types.ObjectId(event._id);
        const usersToNotify = (await Registration.find({ eventId: event._id }, { userId: 1, _id: 0 })).map(reg => reg.userId);
        const usersEmails = (await User.find({ _id: { $in: usersToNotify } }, { email: 1, _id: 0 })).map(user => user.email);

        // data.push({event.name:usersEmails})
        data.push({[event.name]:usersEmails})
    }
    return data;
}
module.exports = { test, getMails };
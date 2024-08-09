//a test to send mail using nodemailer
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendMail = (mailOptions, callback) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            if (callback) callback(error, null);
        } else {
            console.log('Email sent: ' + info.response);
            if (callback) callback(null, info.response);
        }
    });
};



module.exports = { sendMail };
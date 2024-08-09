const express = require('express')
const router = express.Router()
const {sendMail} = require('../services/mail')
const {test} = require('../services/test')

//route to test send mail
router.get('/sendmail', (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'nijomi9102@biscoine.com',
        subject: 'Test Email',
        text: 'This is a test email with second'
    };

    sendMail(mailOptions, (error, response) => {
        if (error) {
            res.status(500).send('Error sending email');
        } else {
            res.send('Email sent: ' + response);
        }
    });
});

router.get('/test', (req, res) => {
    test();
    res.send('Test function executed');
})

module.exports = router;
const express = require('express')
const router = express.Router()
const {sendMail} = require('../services/mail')
const {test, getMails} = require('../services/test')

//route to test send mail
router.get('/sendmail', (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.TESTEMAILS,
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

//router to test get mails
router.get('/getmails', async (req, res) => {
    //send data
    const mails = await getMails();

    res.send(mails);
})

//route to test test function
router.get('/test', (req, res) => {
    test();
    res.send('Test function executed');
})

module.exports = router;
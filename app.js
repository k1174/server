const express = require('express')

const mongoose = require('mongoose');

const eventRoutes = require('./src/routes/eventRoutes.js')

const app = express()


mongoose.connect('mongodb://127.0.0.1:27017/eventDB')
    .then(() => console.log('DB Connected!'))
    .catch((err) => console.error('DB connection error: ', err))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', eventRoutes);

app.listen(4000, () => {
    console.log("Server is running")
})
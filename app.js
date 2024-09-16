const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const port = process.env.PORT || 4000;

const userRoutes = require('./src/routes/userRoutes.js')
const eventRoutes = require('./src/routes/eventRoutes.js')
const apiRoutes = require('./src/routes/apiRoutes.js')
const testRoutes = require('./src/routes/testRoutes.js')

// Import and run the cron jobs
require('./src/services/schedule.js');

dotenv.config();

const app = express()



mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB Connected!'))
    .catch((err) => console.error('DB connection error: ', err))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', userRoutes);
app.use('/api', apiRoutes);
app.use('/test', testRoutes)

app.use('/', eventRoutes);



app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
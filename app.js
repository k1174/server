const express = require('express')
const mongoose = require('mongoose');

const port = process.env.PORT || 4000;

const userRoutes = require('./src/routes/userRoutes.js')
const eventRoutes = require('./src/routes/eventRoutes.js')
const apiRoutes = require('./src/routes/apiRoutes.js')
const testRoutes = require('./src/routes/testRoutes.js')


const app = express()

const uri = "mongodb+srv://ubutuvaio:kamlesh8391@cluster0.xdie8uj.mongodb.net/eventDB?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(uri)
    .then(() => console.log('DB Connected!'))
    .catch((err) => console.error('DB connection error: ', err))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', userRoutes);
app.use('/api', apiRoutes);
app.use('/test', testRoutes)

app.use('/', eventRoutes);


app.listen(4000, () => {
    console.log(`Server is running on ${port}`)
})
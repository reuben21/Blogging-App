const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_CONNECTION_URL

const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions',
});

const feedRoutes = require('./routes/feed');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message})
});


mongoose.connect(MONGO_DB_URI)
    .then(res => {
        app.listen(4000);
        // app.listen(process.env.PORT || 5000)
    }).catch(err => {
    console.log(err);
});



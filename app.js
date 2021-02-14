const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_CONNECTION_URL

const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions',
});


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('public'));
    },
    filename: (req, file, cb) => {
        const now = new Date().toISOString();
        var date = now.replace(/:/g, '-');
        date = date.replace('.', '-');
        cb(null, date + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const feedRoutes = require('./routes/feed');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(
    multer({storage: fileStorage})
        .single('image')
);
// console.log(express.static(path.join(__dirname, 'public','images')));
// app.use('/static', express.static( 'images'));

// app.use('/static', express.static(path.join(__dirname, 'images')));
// app.use(express.static(path.join(__dirname, 'images')))

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



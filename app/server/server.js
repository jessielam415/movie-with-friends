'use strict';
const log = console.log;
const path = require('path')
// environment
const env = process.env.NODE_ENV

const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON
const TEST_USER_ID = '5fb8b011b864666580b4efe3'
const TEST_USER_EMAIL = 'test@user.com'

// Express
const express = require('express')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());

if (env !== 'production') { app.use(cors()) }

const session = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }));
// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');

const MongoStore = require('connect-mongo')

app.use(
    session({
        secret: process.env.SESSION_SECRET || "our hardcoded secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: 300000,
            httpOnly: true
        },
        // store the sessions on the database in production
        store: env === 'production' ? MongoStore.create({
	                    mongoUrl: process.env.MONGODB_URI || "mongodb+srv://dbUser:dbUserPassword@cluster0.zyky9.mongodb.net/Team12?retryWrites=true&w=majority"
	     }) : null
    })
);

require('./routes/user-route')(app);
require('./routes/movie-route')(app);
require('./routes/post-route')(app);

app.use(express.static(path.join(__dirname, "../../app/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/login", "/main", "/Signup"];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "../../app/build/index.html"));
});


const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
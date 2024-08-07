require('dotenv').config();

const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const connectDB = require('./servers/config/db');

//templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));
connectDB();

const port = process.env.PORT || 3000;

app.use('/', require('./servers/routes/main'));
app.use('/', require('./servers/routes/admin'));

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});



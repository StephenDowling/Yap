require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser'); //helps grab cookies and save cookies, used for storing session info when logging in 
const MongoStore = require('connect-mongo').default;

const { connectDB, mongoose } = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');

//connecting to DB
connectDB();

//middleware for parsing data through forms e.g searching 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
    cookie: {maxAge: 3600000}
}));

app.use(express.static(path.join(__dirname, 'public')));

//templating engine 
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
//for admin pages 
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); 
});
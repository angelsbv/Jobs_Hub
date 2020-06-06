'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MySQLSessionStore = require('express-mysql-session');
const layouts = require('express-ejs-layouts');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

require('./db');
require('./auth/local.auth');

const { database: dbOpts } = require('./db');
const storeSession = new MySQLSessionStore(dbOpts);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(express.static(path.join(__dirname, 'assets')));
app.use(morgan('dev'));
app.use(session({
    secret: 'qiwhr0iqwhfadb1141-014124_',
    store: storeSession,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(layouts);
app.use((req, res, next) => {
    app.locals.err = req.flash('err');
    app.locals.user = req.user;
    next();
});

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/job', require('./routes/jobs.routes'));

// Error 404
app.use((req, res, next) => {
    // res.status(404).render('layout', {
    //     page: 'error/error-404',
    //     title: 'Error 404'
    // });
    res.status(404).send('Error 404');
});

// Starting server
app.listen(app.get('port'), () => console.log(`Server on port ${app.get('port')}`))
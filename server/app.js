const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

require('dotenv').config();

let currentDb = undefined;

// Models
const User = require('./models/user.model');

// insecure Routes
const insecureRoutes = [
    '/api',
    '/api/help',
    '/api/users/login',
    '/api/users/register',
    '/api/users/reset-password'
 ]

// Environment
app.set('env', process.env.NODE_ENV || 'development');
app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 8080);

// Routes
const controllers = require('./controllers/controllers');

// Logging
app.use(logger('common', {
    stream: fs.createWriteStream('./access.log', {
        flags: 'a'
    })
}));
app.use(logger('dev'));

// Body Parser Middleware
app.use(bodyParser.json());
// parse application/w-xxx-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie Parser Middleware
app.use(cookieParser());

// CORS Middleware
app.use((req, res, next) => {
    let allowedOrigins = ['https://cablechanwedding.win', 'https://www.cablechanwedding.win'];
    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});


// JWT AUTH
app.use(jwt({secret: process.env.JWT_SECRET})
.unless({
    path: insecureRoutes
}));

app.use( async ( req, res, next ) => {
    if( req.method === 'OPTIONS' || isInsecurePage(req.path) ) {
        return next();
    } 
    try {
        const authHeader = req.get( 'Authorization' );
        const token = authHeader ? authHeader.split( ' ' )[ 1 ].split('.')[1] : null;
        const tokenBase64 = new Buffer(token, 'base64');
        const tokenData = JSON.parse(tokenBase64.toString('ascii'));
        if ( !tokenData.id ) {
            throw new Error();
        }
        const user = await User.findById( tokenData.id );
        if ( !user || user.secStamp !== tokenData.secStamp ) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch( e ) {
        let err = new Error( 'Token Invalid' );
        err.name = 'UnauthorizedError';
        next( err );
    }
});

// public dir 
app.use(express.static(__dirname + '/public'));

// Mongoose Connection Logic
mongoose.connect(process.env.DEVELOPMENT_DATABASE);

mongoose.connection.on('connected', (req, res, next) => {
    console.log('Connected to ' + app.get('env') + ' database');
});

mongoose.connection.on('error', (err, next) => {
    console.error('Error connecting to ' + app.get('env') + ' database');
}); 

// set route-prefix
app.use('/api', controllers);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development Error Handler -- will print stack trace
if(app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.code || 500)
            .json({
                status: 'error',
                message: err
            })
    });
}

// Production Error Handler -- will not print stack trace
if(app.get('env') === 'production') {
    app.use((err, req, res, next) => {
        res.status(err.code || 500)
            .json({
                status: 'error',
                message: err.message
            })
    });
}

// Start Server
app.listen(app.get('port'), () => {
    console.log('Listening on Port ' + app.get('port'));
});

// Utility Functions
let isInsecurePage = (loc) => {
    if(insecureRoutes.includes(loc)) {
        return true;
    } else {
        return false;
    }
}


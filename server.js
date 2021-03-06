const express = require('express'); //our server
const logger = require('morgan'); //logging
const bodyParser = require('body-parser'); //for parsing http request body
const app = express();
const path = require('path');

const history = require('connect-history-api-fallback');

//jwt for authentication
const jwt = require('jsonwebtoken');

app.use(express.static('client'));

require('dotenv').config(); // to access SECRET_KEY in .env file

app.set('SECRET_KEY', process.env.SECRET_KEY); // jwt secret key used for signing/verification

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(history({
    index: '/'
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

// our api endpoints for teachers and students
const teachers = require('./server/routes/teachers');
const teacherManagement = require('./server/routes/teacherManagement');
const pupils = require('./server/routes/pupils');


function verifyTeacher(req, res, callback) {
    jwt.verify(req.headers['x-access-token'], req.app.get('SECRET_KEY'), function(err, decoded) {
        if (err) {
            res.json({ success: false, message: err.message, data: null });
        } else {
            // add id to request
            req.body.teacherId = decoded.id;
            // allow app.use to execute the next function if successful
            callback();
        }
    });
}

app.use('/api/v1/teachers', teachers);

// this route contains confidential information, so we
// validate the teacher trying to access it
app.use('/api/v1/pupils', verifyTeacher, pupils);

// this route is used to manage teacher accounts, so we
// must validate the teacher trying to access it
app.use('/api/v1/teachers/manage', verifyTeacher, teacherManagement);

// by default 404 is not considered an error, so make it an error
app.use(function(req, res, callback) {
    let err = new Error('Not Found');
    err.status = 404;
    callback(err); //pass error over to express error handling
});

//handle 404 and other errors
app.use(function(err, req, res) {
    console.log(err);

    if (err.status === 404) {
        res.status(404).json({ message: "Not found" });
    } else {
        res.status(500).json({ message: "something's gone wrong" });

    }
});

// allow glitch to run the server
const listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
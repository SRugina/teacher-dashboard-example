const express = require('express'); //our server
const logger = require('morgan'); //logging
const bodyParser = require('body-parser'); //for parsing http request body
const app = express();

//jwt for authentication
const jwt = require('jsonwebtoken');

// our api endpoints for teachers and students
const teachers = require('./server/routes/teachers');
const pupils = require('./server/routes/pupils');

require('dotenv').config(); // to access SECRET_KEY in .env file

app.set('SECRET_KEY', process.env.SECRET_KEY); // jwt secret key used for signing/verification

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.json({ "test": "this should appear if it works" });
});

app.use('/api/teachers', teachers);

// this route contains confidential information, so we
// validate the teacher trying to access it
app.use('/api/pupils', validateTeacher, pupils);

function validateTeacher(req, res, callback) {
    jwt.verify(req.headers['x-access-token'], req.app.get('SECRET_KEY'), function (err, decoded) {
        if (err) {
            console.log(req.headers['x-access-token']);
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add id to request
            req.body.teacherId = decoded.id;
            // allow app.use to execute the next function if successful
            callback();
        }
    });

}

// by default 404 is not considered an error, so make it an error
app.use(function (req, res, callback) {
    let err = new Error('Not Found');
    err.status = 404;
    callback(err);
});

//handle 404 and other errors
app.use(function (err, req, res, callback) {
    console.log(err);

    if (err.status === 404) {
        res.status(404).json({ message: "Not found" });
    } else {
        res.status(500).json({ message: "something's gone wrong" });
    }
});

// allow glitch to run the server
const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const s3 = require('./s3upload.js');
const config = require('../config.json');


var connection = mysql.createConnection({
    host: 'fishr-database.cgdpyeanjdf4.us-east-2.rds.amazonaws.com',
    user: config.databaseUser,
    password: config.databasePassword,
    database: 'fishrDB',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


// parse application/json
app.use(bodyParser.json({
    limit: '100mb'
}));


app.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.get('/search/:text', (req, res) => {
    console.log(`Searching on : ${req.params.text}`);
    connection.query(`SELECT * FROM users WHERE locate('${req.params.text}',first_name)>0 or locate('${req.params.text}',last_name) or locate('${req.params.text}',username) limit 30`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to search by: ' + req.params.text + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Search on ${req.params.text} successful`);
            res.send(rows);
        }
    });
});

app.get('/searchEmpty', (req, res) => {
    console.log(`Searching on empty`);
    connection.query(`SELECT * FROM users`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to search all:' + err.code);
            res.send(err.code);
        } else {
            console.log(`Searched all successful`);
            res.send(rows);
        }
    });
});

app.post('/makeuser', (req, res) => {
    console.log('Making user: ' + req.body.userID);
    connection.query('INSERT INTO users (first_name, last_name, username, email, userkey, phone_number,profile_picture, created, last_login) VALUES ("' + req.body.first + '","' + req.body.last + '","' + req.body.username + '","' + req.body.email + '","' + req.body.userID + '","' + req.body.phone + '","' + req.body.profilePicture + '","' + Date.now().toString() + '","' + Date.now().toString() + '")', function (err, rows, fields) {
        if (err) {
            console.log('Unable to make user: ' + req.body.userID + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log('Made user: ' + req.body.userID);
            res.send('Good');
        }
    });

});

app.post('/makePost', s3.upload.array('picturesAndVideos'), function (req, res, next) {
    var i = 0;
    var columnNames = "";
    var columnData = "";
    req.files.forEach((value) => {
        if (i % 2 == 0) {
            columnNames += `image${(i/2)+1}, `;
        } else {
            columnNames += `video${(i/2)+0.5}, `;
        }
        columnData += value.location + '","';
        i++;
    });
    connection.query(`INSERT INTO posts (userkey, title, description, ${columnNames} time) VALUES ("${req.body.userID}","${req.body.title}"," ${req.body.description} "," ${columnData}${Date.now().toString()}")`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to make post: ' + req.body.userID + ', ' + err.code);
            res.send(err.code);
            return;
        } else {
            console.log('Made post: ' + req.body.title);
            res.send('Good');
            return;
        }
    });
});
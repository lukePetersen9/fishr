const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'fishr-database.cgdpyeanjdf4.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'zmZMGOOIqHV7t4cP0VBV',
    database: 'fishrDB',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.post('/makeuser', (req, res) => {
    console.log('Making user: ' + req.body.userID);
    connection.query('INSERT INTO users (first_name, last_name, username, email, userkey,phone_number,profile_picture, created) VALUES ("' + req.body.first + '","' + req.body.last + '","' + req.body.username + '","' + req.body.email + '","' + req.body.userID + '","' + req.body.phone + '","' + req.body.profilePicure + '","' + Date.now().toString() + '")', function (err, rows, fields) {
        if (err) {
            console.log('Unable to make user: ' + req.body.userID + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log('Made user: ' + req.body.userID);
            res.send('Good');
        }
    });

});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'fishr-database.cgdpyeanjdf4.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'zmZMGOOIqHV7t4cP0VBV',
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
    console.log('got something...');
    console.log(req.body);
    res.send({
        'hello': 'yolo'
    });
});
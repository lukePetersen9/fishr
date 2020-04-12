const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'fishr-database.cgdpyeanjdf4.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'zmZMGOOIqHV7t4cP0VBV',
    database: 'test',
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
    connection.query('SELECT * FROM books', function (err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows[0]);
    });
    console.log(req.body);
    res.send({
        'hello': 'yolo'
    });
});
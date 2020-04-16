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

app.post('/makeuser', (req, res) => {
    console.log('Making user: ' + req.body.userID);
    connection.query('INSERT INTO users (first_name, last_name, username, email, userkey,phone_number,profile_picture, created, last_login) VALUES ("' + req.body.first + '","' + req.body.last + '","' + req.body.username + '","' + req.body.email + '","' + req.body.userID + '","' + req.body.phone + '","' + req.body.profilePicture + '","' + Date.now().toString() + '","' + Date.now().toString() + '")', function (err, rows, fields) {
        if (err) {
            console.log('Unable to make user: ' + req.body.userID + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log('Made user: ' + req.body.userID);
            res.send('Good');
        }
    });

});

app.post('/makePost', s3.upload.array('picture', 8), function (req, res, next) {
    res.send('Successfully uploaded ' + ' files!');
});

// app.post('/makePost', (req, res) => {
//     console.log('makePost: ' + req.body.userID);
//     var image1, image2, image3, image4, video1, video2, video3, video4;
//     try {
//         console.log('started image 1');
//         image1 = s3.uploadFile(req.body.image1, req.body.userID);
//         console.log('finished image 1');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started image 2');
//         image2 = s3.uploadFile(req.body.image2, req.body.userID);
//         console.log('finished image 2');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started image 3');
//         image3 = s3.uploadFile(req.body.image3, req.body.userID);
//         console.log('finished image 3');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started image 4');
//         image4 = s3.uploadFile(req.body.image4, req.body.userID);
//         console.log('finished image 4');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started video 1');
//         video1 = s3.uploadFile(req.body.video1, req.body.userID);
//         console.log('finished video 1');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started video 3');
//         video2 = s3.uploadFile(req.body.video2, req.body.userID);
//         console.log('finished video 2');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started video 3');
//         video3 = s3.uploadFile(req.body.video3, req.body.userID);
//         console.log('finished video 3');
//     } catch (err) {
//         res.send(err);
//         return;
//     }
//     try {
//         console.log('started video 4');
//         video4 = s3.uploadFile(req.body.video4, req.body.userID);
//         console.log('finished video 4');
//     } catch (err) {
//         res.send(err);
//         return;
//     }

//     console.log(req.body.title);
//     console.log(req.body.description);

//     connection.query('INSERT INTO posts (userkey, title, description, image1, image2, image3, image4, video1, video2, video3, video4, time) VALUES ("' + req.body.userID + '","' + req.body.title + '","' + req.body.description + '","' + image1 + '","' + image2 + '","' + image3 + '","' + image4 + '","' + video1 + '","' + video2 + '","' + video3 + '","' + video4 + '","' + Date.now().toString() + '")', function (err, rows, fields) {
//         if (err) {
//             console.log('Unable to make post: ' + req.body.userID + ', ' + err.code);
//             res.send(err.code);
//             return;
//         } else {
//             console.log('Made post: ' + req.body.title);
//             res.send('Good');
//             return;
//         }
//     });

// });
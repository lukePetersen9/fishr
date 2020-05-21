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

app.get('/user/:key', (req, res) => {
    console.log(`Fetching user data for: ${req.params.key}`);
    connection.query(`SELECT * FROM users WHERE userkey = '${req.params.key}' limit 1`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to fetch user data for: ' + req.params.key + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Fetched data on ${req.params.key} successful`);
            console.log(rows[0]);
            res.send(rows[0]);
        }
    });
});

app.get('/search/:text', (req, res) => {
    console.log(`Searching on: ${req.params.text}`);
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

app.get('/privatePosts/:uid', (req, res) => {
    console.log(`Retrieving private posts for: ${req.params.uid}`);
    connection.query(`Select * from following_posts where following_posts.follower = '${req.params.uid}' ORDER BY time DESC`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to find posts that you follow by: ' + req.params.uid + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Found posts from people that ${req.params.uid} follows`);
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/privatePostsAfter/:uid/:time', (req, res) => {
    console.log(`Retrieving private posts for: ${req.params.uid} after ${req.params.time}`);
    connection.query(`Select * from following_posts where following_posts.follower = '${req.params.uid}' and time > ${req.params.time} ORDER BY time DESC`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to find posts that you follow by: ' + req.params.uid + ' after: ' + req.params.time + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Refreshed posts from people that ${req.params.uid} follows after ${req.params.time}`);
            res.send(rows);
        }
    });
});

app.post('/like/:postID/:uid', (req, res) => {
    console.log(`Liking post id ${req.params.postID}: ${req.params.uid}`);
    connection.query(`INSERT INTO likes (likedBy, postID, time) VALUES ("${req.params.uid}","${req.params.postID}","${Date.now().toString()}")`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to like post ' + req.params.postID + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Liked post ${req.params.postID} by ${req.params.uid}`);
            res.send('good');
        }
    });

});

app.post('/unlike/:postID/:uid', (req, res) => {
    console.log(`Liking post id ${req.params.postID}: ${req.params.uid}`);
    connection.query(`DELETE FROM likes WHERE postID = "${req.params.postID}" AND likedBy = "${req.params.uid}"`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to unlike post ' + req.params.postID + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Unliked post ${req.params.postID} by ${req.params.uid}`);
            res.send('good');
        }
    });
});

app.get('/getLikeList/:postID', (req, res) => {
    console.log(`Getting like list post id ${req.params.postID}`);
    connection.query(`SELECT * FROM users, likes AS l WHERE users.userkey = l.likedBy and l.postID = "${req.params.postID}"`, function (err, rows, fields) {
        if (err) {
            console.log('Unable to get like list ' + req.params.postID + ', ' + err.code);
            res.send(err.code);
        } else {
            console.log(`Got like list for post ${req.params.postID}`);
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

app.post('/makeUser', (req, res) => {
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
    console.log('got something');
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

app.post('/follow/:users', (req, res) => {
    var follower = req.params.users.substring(0, req.params.users.indexOf(' '));
    var followed = req.params.users.substring(req.params.users.indexOf(' ') + 1);
    console.log(`Trying to matchmake: ${follower} --> ${followed}`);
    connection.query(`INSERT INTO follow (follower, following, time) VALUES ( "${follower}", "${followed}", "${Date.now().toString()}")`, function (err, rows, fields) {
        if (err) {
            console.log(`Unable to follow: ${follower} --> ${followed} ${err.code}`);
            res.send(err.code);
        } else {
            console.log(`Followed: ${follower} --> ${followed}`);
            res.send('Good');
        }
    });

});

app.post('/unfollow/:users', (req, res) => {
    var follower = req.params.users.substring(0, req.params.users.indexOf(' '));
    var followed = req.params.users.substring(req.params.users.indexOf(' ') + 1);
    console.log(`Trying to unfollow: ${follower} --> ${followed}`);
    connection.query(`delete from follow where follower = "${follower}" and following = "${followed}"`, function (err, rows, fields) {
        if (err) {
            console.log(`Unable to unfollow: ${follower} --> ${followed} ${err.code}`);
            res.send(err.code);
        } else {
            console.log(`Unfollowed: ${follower} --> ${followed}`);
            res.send('Good');
        }
    });

});

app.get('/getFollowing/:user', (req, res) => {
    console.log(`Searching on empty`);
    connection.query(`select * from follower_list where following = '${req.params.user}'`, function (err, rows, fields) {
        if (err) {
            console.log(`Unable to get who ${req.params.user} is following`);
            res.send(err.code);
        } else {
            console.log(`Got following list for ${req.params.user}`);
            res.send(rows);
        }
    });
});

app.get('/getFollowers/:user', (req, res) => {
    console.log(`Searching on empty`);
    connection.query(`select * from follower_list where follower = '${req.params.user}'`, function (err, rows, fields) {
        if (err) {
            console.log(`Unable to get who follows ${req.params.user}`);
            res.send(err.code);
        } else {
            console.log(`Got followers list for ${req.params.user}`);
            res.send(rows);
        }
    });
});
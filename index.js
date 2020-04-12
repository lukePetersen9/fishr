const express = require('express');
const bodyParser = require('body-parser')
const app = express();



app.use(bodyParser.bodyParser());


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




/*
cognito: 4n3s8jd85je5prosfh7lsk39a8
https://fishrauth.auth.us-east-2.amazoncognito.com
 */
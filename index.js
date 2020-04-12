const express = require('express');
const app = express();

app.post('/makeuser', (req, res) => {
    console.log('got something...');
    console.log(req.body);
    res.send({
        'hello': 'yolo'
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

/*
cognito: 4n3s8jd85je5prosfh7lsk39a8
https://fishrauth.auth.us-east-2.amazoncognito.com
 */
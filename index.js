const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hi claire, your boyfriend is a genius');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
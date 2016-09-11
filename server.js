const express = require('express');
const app = express();
const port = 3000;

const beacon = require('./app/beacon');

app.use(express.static('public'));

app.post('/beacon/broadcast', function (request, response) {
    beacon.broadcast();
    response.end(JSON.stringify({
        status: 200,
        success: 'beacon advertised successfully'
    }));
});

app.listen(port, function (err) {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log('server is listening on ' + port);
});
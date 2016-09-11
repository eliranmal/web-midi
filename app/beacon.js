
const beacon = require('eddystone-beacon');
const url = 'http://bit.ly/2ceqH0d';
// http://goo.gl/WgcLXv

module.exports = {
    broadcast: function () {
        beacon.advertiseUrl(url);
        console.log('beacon url advertised: [' + url + ']');
    }
};

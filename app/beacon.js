const beacon = require('eddystone-beacon');
console.log('beacon required!');
const url = 'http://bit.ly/2ceqH0d';
beacon.advertiseUrl(url);
console.log('beacon url advertised: [' + url + ']');

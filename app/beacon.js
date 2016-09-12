
const beacon = require('eddystone-beacon');

const eliranmalWebMidiGithubUrl = 'http://bit.ly/2ceqH0d'; // or http://goo.gl/WgcLXv
const presentationUrl = 'http://bit.ly/2cnoHnK'; // https://docs.google.com/a/liveperson.com/presentation/d/1XmXtF8rpU_jbd8Qjm_rjeNC-7z6CGJcqwBIPWQdD0do/edit?usp=sharing

const url = eliranmalWebMidiGithubUrl;

module.exports = {
    broadcast: function () {
        // todo - pass url in request
        beacon.advertiseUrl(url);
        console.log('beacon url advertised: [' + url + ']');
    }
};

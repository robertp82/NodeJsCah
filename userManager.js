var https = require('https');
var baseUser = require("./baseUser");
var storedUser = require("./storedUser");
var constants = require("./constants");
var querystring = require("querystring");

var authParseUser = function (username, password, response, callback) {
    var options = {
	host: constants.ParseUrl,
	port: 443,
	path: '/1/login?username='+ username + '&password='+password,
	method: 'GET',
	headers: constants.ParseHeaders
    };

    var getData = querystring.stringify({ 'username':username, 'password':password});

    //options.data = getData;

    console.log(JSON.stringify(options));
    console.log('getParseUserByLogin');

    https.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('error', function (error) { console.log(error.message);  return null;}),
	res.on('data', function (chunk) {
	    var json = JSON.parse(chunk);
	    console.log('BODY: ' + JSON.stringify(json));
	    callback(json, response);
	    
	});
    }).end();
}

var getParseUser = function (userId, callback) {
    var options = {
	host: constants.ParseUrl,
	port: 443,
	path: '/1/users/' + userId,
	method: 'GET',
	headers: constants.ParseHeaders
    };

    console.log('getParseUser');

    https.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('error', function (error) { console.log(error.message);  return null;}),
	res.on('data', function (chunk) {
	    var json = JSON.parse(chunk);
	    console.log('BODY: ' + JSON.stringify(json));
	    callback(new storedUser.StoredUser(userId, json.username, json.admin));
	    
	});
    }).end();
}

var addParseUser = function (username, password, email, callback) {
    var options = {
	host: constants.ParseUrl,
	port: constants.ParsePort,
	path: '/1/users/',
	method: 'POST',
	headers: constants.ParseHeaders
    };
    var postData = querystring.stringify({ 'username':username, 'password':password, 'email': email});

    var postReq =  https.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('error', function (error) { console.log(error.message);  return null;}),
	res.on('data', function (chunk) {
	    var json = JSON.parse(chunk);
	    console.log('BODY: ' + json.username);
	    callback(new storedUser.StoredUser(userId, json.username, false));
	    
	});
    });
    postReq.write(postData);
    postReq.end();
}

exports.getParseUser = getParseUser;
exports.authParseUser = authParseUser;
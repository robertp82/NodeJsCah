var http = require("http");
var urlLib = require("url");
var connect = require("connect");
var router = require('./router');
var sessionManager = require('./sessionManager');
var constants = require('./constants.js');

var apiPrefix = constants.ApiPrefix;

function authenticateUser(request, response, next) {   
    var ru = request.url;
    
    if (ru === '/favicon.ico') {
	response.writeHead(200, {'Content-Type': 'image/x-icon'} );
	response.end();
//	console.log('favicon requested');
	return;
    }

    if (ru == "/logout" ) {
	console.log('logging out');
	request.session.destroy();
	router.route(request, '/login', response);
	return;
    }

    //don't authenticate api requests
    if (ru.indexOf(apiPrefix) > -1 || ru.indexOf('/register') > -1 || ru.indexOf('/auth') > -1) {
	next();
	return;
    }

    console.log(JSON.stringify(ru));
   
    if (request.session && request.session.uid != undefined) {
	if (ru.indexOf('/login') == 0) {
	    router.route(request, '/', response);
	    return;
	}
	next();
	return;
    }

    if (ru.indexOf('/login?uid') == 0) {
	//console.log('get here');
	var uid = ru.substring(11, ru.length);
	console.log(uid);
	request.session.uid = uid;
	router.route(request, '/', response);
	return;
    }

    if (ru.indexOf('/join?sid=') == 0) {
	//console.log('get here join');
	var uid = ru.substring(10, ru.length);
//	console.log(uid);
	var uidStart = uid.indexOf('uid=');
	uid = uid.substring(uidStart + 4, uid.length);
	console.log(uid);
	request.session.uid = uid;
//	router.route(request, ru, response);
	next();
	return;
    }

    router.route(request, '/login', response);
}

function handleRequest(request, response, next) {
    var pathname = urlLib.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");
    
    if (request.method == "GET") {
	router.route(request, pathname, response);
	return;
    }

    var postData = "";

    request.addListener("data", function(postDataChunk) {
	postData += postDataChunk;
	console.log("Received POST data chunk '"+ postDataChunk + "'.");
    });

    request.addListener("end", function() {
	console.log(pathname);
	router.route(request, pathname, response, postData);
    });
}

function start() {
//    http.createServer(onRequest).listen(constants.WebPort);
    var server = connect.createServer(
	connect.cookieParser(),
	connect.session({ secret: 'foobar' }),
	authenticateUser, handleRequest);
    server.listen(constants.WebPort);
    console.log("Server has started on port: " + constants.WebPort + '.');
}

exports.start = start;
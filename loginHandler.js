var constants = require("./constants");
var https = require('https');
var fs = require('fs');
var _ = require('underscore');
var userManager = require('./userManager');

//var lobbyHandler = require('./lobbyHandler');

//var lobbyWebClient = new lobbyHandler.LobbyWebClient();

var LoginWebClient = function() { 
    this.loginTemplate = fs.readFileSync('./templates/login.html', 'utf8');
    this.registerTemplate = fs.readFileSync('./templates/register.html', 'utf8');
};

function redirectLogin(response, args) {

//    return lobbyWebClient.getLobby(response, args);
    
    console.log('attempting redirect');
    var newHost = constants.HostUrl + ':' + constants.WebPort;
    var newPath = "/login?uid="+args.objectId;
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write('<html><head><script>document.location.href = "' + newHost + newPath + '";</script></head></html>');
    response.end();
}

function redirectLoginFail(response, args) {
    console.log('attempting fail');
    var newHost = constants.HostUrl + ':' + constants.WebPort;
    var newPath = "/login";
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write('<html><head><script>document.location.href = "' + newHost + newPath + '";</script></head></html>');
    //response.write('<script>alert("fail");</script>');
    response.end();
}

LoginWebClient.prototype.populateLoginTemplate = function(response, args) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(_.template ( this.loginTemplate, { constants:constants}));
}

LoginWebClient.prototype.populateRegisterTemplate = function(response, args) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(_.template ( this.registerTemplate, { constants:constants, registered:false}));
}

var authResult = function(data, response) {
    console.log('auth result');
    console.log(JSON.stringify(data));
    if (data.username != undefined) {
	redirectLogin(response, data);
	return;
    }

    redirectLoginFail(response, data);
	
}

LoginWebClient.prototype.auth = function(response, args) {
    userManager.authParseUser(args.username, args.password, response, authResult);
}

LoginWebClient.prototype.login = function(response, args) {
    this.populateLoginTemplate(response, args);
}

LoginWebClient.prototype.register = function(response, args) {
    console.log(JSON.stringify(args));
    var username = args.username;
    var password = args.password;
    if (username && username.length > 0 && password && password.length >0) {
	this.registerUser(response, args, this.registerTemplate);
	return;
    }

    this.populateRegisterTemplate(response, args);
}

LoginWebClient.prototype.registerUser = function(response, args, template) {  
    var pData = { "username" : args.username, "password": args.password, "email": args.email };

    var options = {
	host: constants.ParseUrl,
	port: constants.ParsePort,
	path: '/1/users',
	method: 'POST',
	dataType: 'json',
	data: pData,
	headers: constants.ParseHeaders
    };

    console.log(JSON.stringify(options));
    
    var httpReq =  https.request(options, function(res) {
//	console.log(JSON.stringify(res));
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('error', function (error) { console.log(error.message); registerError(response, args, template);}),
	res.on('data', function (chunk) {
	    var json = JSON.parse(chunk);
	    console.log('BODY: ' + json.username);
	    //callback(new storedUser.StoredUser(userId, json.username));
	    registerOk(response, args, template);
	});
    });

    httpReq.write(JSON.stringify(pData));
    httpReq.end();
}

function registerOk(response, args, template) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(_.template ( template, { constants:constants, registered:true}));
}

function registerError(response, args, template) {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(_.template ( template, { constants:constants, registered:false}));
}

exports.LoginWebClient = LoginWebClient;
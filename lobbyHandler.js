var constants = require("./constants");
var sessionHandler = require("./sessionHandler");
var fs = require('fs');
var _ = require('underscore');

var LobbyWebClient = function() { 
    this.lobbyTemplate = fs.readFileSync('./templates/lobby.html', 'utf8');
};

LobbyWebClient.prototype.populateTemplate = function(response, args, template) {
    response.writeHead(200, { "Content-Type": "text/html" });
       
    var sessionTypes = [];

    for (var i in constants.DisplaySessionType) {
	if (constants.DisplaySessionType.hasOwnProperty(i)) {
	    var type = constants.DisplaySessionType[i];
	    var sessionType = { id : i, text : type };
	    sessionTypes.push(sessionType);
	}
    }   

    response.end(_.template ( template, { constants:constants, uid:args.uid, sessionTypes:sessionTypes}));
}

LobbyWebClient.prototype.getLobby = function(response, args) {
    console.log('loading the lobby');
    this.populateTemplate(response, args, this.lobbyTemplate);
}

LobbyWebClient.prototype.addGame = function(response, args) {
    console.log('addGame called');
    var type = parseInt(args.type);
    var session = [];
    console.log('type:' + type);

    var newSession = sessionHandler.createCustomSession(type);

    response.writeHead(200, {
        "Content-Type": "text/html"
    });

    if (newSession) {
//	response.write(JSON.stringify(newSession.id));
	response.write('Created new game: ' + newSession.id + ', please join it from the <a href="/lobby">Lobby</a>.');
    }
    else {
	response.write('Unable to create new game, please retry or contact help.');
    }
    response.end();
}


exports.LobbyWebClient = LobbyWebClient;
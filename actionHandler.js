var constants = require("./constants");
var fs = require('fs');
var sessionManager = require("./sessionManager");
var userManager = require('./userManager');
var socketServer = require('./socketServer');

var ActionWebClient = function() {};

function redirectSession(response, args) {
    console.log('attempting redirect');
    var newHost = constants.HostUrl + ':' + constants.WebPort;
    var newPath = "/web?sid=" + args.sid;// + '&uid=' + args.uid;
    console.log(newHost +  newPath);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write('<html><head><script>document.location.href = "' + newHost + newPath + '";</script></head></html>');

    response.end();
}

function redirectLobby(response, args) {
    console.log('attempting redirect');
    var newHost = constants.HostUrl + ':' + constants.WebPort;
    var newPath = "/lobby";
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write('<html><head><script>document.location.href = "' + newHost + newPath + '";</script></head></html>');
    response.end();
}

ActionWebClient.prototype.joinSession = function(response, args) {
    var session = sessionManager.getSession(args.sid);
    var uid = args.uid;

    var user = session.getUser(uid);
    if (user == undefined)
    {
        console.log('joining the game');
        var user = userManager.getParseUser(uid, function(user) { session.addUser(user); redirectSession(response, args);});
        return;
    }

    console.log('already in game');
    redirectSession(response, args);
}

ActionWebClient.prototype.leaveSession = function(response, args) {
    var session = sessionManager.getSession(args.sid);
    if (session == undefined) return;
    var user = session.getUser(args.uid);
    if (user == undefined) return;
    session.removeUser(args.uid);
    redirectLobby(response, args);
}

ActionWebClient.prototype.adminAction = function(response, args) {
    var session = sessionManager.getSession(args.sid);
    if (session == undefined) return;
    var user = session.getUser(args.uid);
    if (user == undefined || !user.isAdmin) return;
    var targetUser = session.getUser(args.tuid);
    if (targetUser == undefined) return;
    
    switch (args.action) {
    case "Pause":this.pauseUser(response,args); break;
    case "Kick": this.kickUser(response, args); break;
    case "Admin": this.giveAdminUser(response, args); break;
    }

    redirectSession(response, args);
}

ActionWebClient.prototype.kickUser = function(response, args) {
    var session = sessionManager.getSession(args.sid);
    var targetUser = session.getUser(args.tuid);
    session.removeUser(targetUser.id);
}

ActionWebClient.prototype.pauseUser = function(response, args) {
    var session = sessionManager.getSession(args.sid);
    var targetUser = session.getUser(args.tuid);
    targetUser.isPaused = true;
}

ActionWebClient.prototype.giveAdminUser = function(response, args) {
    var session = sessionManager.getSession(args.sid);
    var targetUser = session.getUser(args.tuid);
    targetUser.isAdmin = true;
}

exports.ActionWebClient = ActionWebClient;
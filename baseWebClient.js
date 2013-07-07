var constants = require("./constants");
var fs = require('fs');
var _ = require('underscore');

var BaseWebClient = function() { 
    this.collapseCards = false;
    this.embedChatInLog = true;
    this.updateScriptLine = undefined;
    this.baseTemplate = fs.readFileSync('./templates/baseWebClient.html', 'utf8');
    this.updateTemplate = fs.readFileSync('./templates/baseWebUpdate.html', 'utf8');
    this.headerTemplate = fs.readFileSync('./templates/webClientHeader.html', 'utf8');
    this.jsIncludes = '';
};

BaseWebClient.prototype.populateTemplate = function(response, args, template) {
    var uid = args.uid;
    var sid = args.sid;
    var session = args.session;

    var user = session.getUser(uid);
    if (!user) {
	response.writeHead(404, { "Content-type": "text/html" });
	response.write('Invalid user');
	response.end();
       // console.log('Unable to resolve user');
        return;
    }

    response.writeHead(200, { "Content-Type": "text/html" });

    var users = session.getUserStatuses();
    var main = this.getInstructions(args);
    var priorInfo = session.getPriorWinner();
        
    response.end(_.template ( template, { main: main,  users: users, priorInfo: priorInfo, sid: sid, uid: uid, collapseCards: this.collapseCards,jsIncludes: this.jsIncludes, constants:constants, user: user}));
}

BaseWebClient.prototype.getWebUpdate = function(response, args) {
    this.populateTemplate(response, args, this.updateTemplate);
}

BaseWebClient.prototype.getWebClient = function(response, args) {
    this.populateTemplate(response, args, this.baseTemplate);
}


BaseWebClient.prototype.getCustomHeader = function(userStatus) {
    return '?';
}

BaseWebClient.prototype.getHeader = function(user, userStatus, userStatuses) {
    var header = '';
    console.log(JSON.stringify(userStatus));
    console.log(JSON.stringify(userStatuses));
    switch(userStatus) {
    case userStatuses.SelectCards :
        header = 'It is your turn to pick responses.';
        break;
    case userStatuses.WaitSelect:
        header ='You are waiting for everyone to submit their cards.';
        break;
    case userStatuses.WaitDealer:
        header ='You are awaiting a winner';
        break;
    case userStatuses.DealerSelectCards:
        header = 'It\'s your turn to select a winner.';
        break;
    case userStatuses.DealerWaitSelect:
        header = 'You are waiting for everyone to submit their cards.';
        break;
    case userStatuses.OwnerWaitJoin:
    case userStatuses.WaitJoin:
        header = 'You are waiting for the game to start.';
        break;
    case userStatuses.GameOver: header = 'The game is over.'; break;

    default: console.log('custom header'); header = this.getCustomHeader(user, userStatus, userStatuses); break;
 
    }
    return user.name +', ' + header;

}

exports.BaseWebClient = BaseWebClient;
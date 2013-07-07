var constants = require("./constants");
var socketServer =require("./socketServer");
var socketHandlers = require("./baseWebSocketApi");
var querystring = require("querystring");
var cardManager = require("./sessionHandler");
var fs = require('fs');

var BaseSession = function () {
    this.type = 0;
    this.socketHandler = socketHandlers.handle;
};

BaseSession.prototype.init = function(id) {
    this.sessionLog = [];
    this.id = id;
    this.users = [];
    this.status = this.SessionStatus.Waiting;
    this.activeSelectorUserIndexId = 0;
    this.ownerUid = 0;
    this.minUsers = 2;
    this.maxUsers = 10;
    this.cardsPerUser = 0; //set in child classes
}

BaseSession.prototype.getId = function () {
    return this.id;
};

BaseSession.prototype.getParsedSubmissions = function(responses) {
    return querystring.parse(responses);   
}

BaseSession.prototype.getParsedSelections = function(responses) {
    return querystring.parse(responses);
}

BaseSession.prototype.start = function () {
    if (this.status != this.SessionStatus.Waiting) {
        this.log("Session already started.");
        return;
    }
  
    if (this.users.length < this.minUsers) {
	this.log("We need at least " + this.minUsers + " players to start.");
	return;
    }

    this.startCustom();

    this.status = this.SessionStatus.Active;
    this.sendSocketUpdate();   
};

BaseSession.prototype.sendSocketUpdate = function() {
    socketServer.sendUpdates(this.id, 'update', '');
}

BaseSession.prototype.dealCards = function (deck) {
    for (var x = this.users.length - 1; x > -1; x--) {
        this.users[x].initialize();
        for (var y = this.cardsPerUser; y > -1; y--) {
	    var cardId = deck.pop();
	    var card = cardManager.getAnswerCard(this.type, cardId);
            this.users[x].addCard(card);
        }
    }
};

BaseSession.prototype.log = function(event) {   
    console.log(event);

//    this.sessionLog.push(event);
    socketServer.sendUpdates(this.id, 'log', event);
    this.logFile(event);
}

BaseSession.prototype.logFile = function(event) {   
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var filepath = constants.LogPath + 'game_' + this.id + '_'  + year + '_' + month + '_' + day + '.log';
    console.log('writing to: ' + filepath);
    fs.open(filepath, 'a', 0777, function( e, id ) {
	fs.write( id, event +'\r\n', undefined, undefined, function(){
	    fs.close(id, function(){
//	console.log('file closed');
	    });
	});
    });
}

BaseSession.prototype.getUser = function (userId) {
    for (var i = this.users.length - 1; i > -1; i--) {
	var user = this.users[i];
        if (user.id == userId) {
            return user;
        }
    }
    return;
};

BaseSession.prototype.getUsersCards = function (userId) {
    //console.log('in get cards');
    var user = this.getUser(userId);
    if (user == undefined) return undefined;
    var cards = [];
    for (var x = user.cards.length -1; x > -1; x--) {
//	console.log(JSON.stringify(user.cards[x]));
        cards.push(user.cards[x]);
    }
 //   console.log('guc ' + JSON.stringify(cards));
    return cards;
}

BaseSession.prototype.addUser = function (user) {
    if (this.status != this.SessionStatus.Waiting) {
        this.log("Unable to add " + user.name + " because game has started.");
        return;
    }
    if (this.users.length == this.maxUsers) {
	this.log("Unable to add " + user.name + " because max players of " + this.maxUsers + " met.");
	this.start();
	return;
    }
    if (this.users.length == 0)
	this.ownerUid = user.id;

    for (var i = this.users.length -1; i > -1; i--) {
	if (this.users[i].id == user.id) {
	    console.log('Got dupe add user to session id: '+ this.id);
	    return;
	}
    }
    
    this.addCustomUser(user);
    this.log(user.name + " has joined the game.");
};

BaseSession.prototype.removeCustomUser = function(user, isDealer) {
    console.log('removeCustomUser to be implemented by child class.');
}

BaseSession.prototype.removeUser = function(userId) {
    var user;
    var isDealer = false;
    for (var i = this.users.length - 1; i > -1; i--) {	
	if (this.users[i].id == userId) {
	    if (this.dealerId == i) {
		isDealer = true;
	    }
	    user = this.users[i];
	    this.users.splice(i, 1);
	}
    }
    if (user == undefined) return;
    if (this.isGameOver()) {
	this.log(user.name + " has left the game, not enough players to continue.");
	this.sendSocketUpdate();
	return;
    }
    this.removeCustomUser(user, isDealer);
    this.log(user.name + " has left the game.");
}

BaseSession.prototype.isGameOver = function() {
    if (this.status == this.SessionStatus.Complete) {
	return true;
    }
    if (this.status == this.SessionStatus.Waiting) {
	return false;
    }

    if (this.users.length < this.minUsers || (this.deck && this.deck.length == 0)) {
	this.status = this.SessionStatus.Complete;
	return true; 
    }
    return this.isCustomGameOver();
};

BaseSession.prototype.isCustomGameOver = function() {
    console.log('isCustomGameOver to be implemented by child class.');
    return false;
}

BaseSession.prototype.getUserStatuses = function () {
    var results = [];

    for (var x = 0, xx = this.users.length; x < xx; x++) {
	var userStatus = {};
        
        var user = this.users[x];
	userStatus.name = user.getName();
	
	var userStatusEnum = this.getUserStatusEnum(user.id);
	switch (userStatusEnum) {
	case this.UserStatus.WaitJoin:
	case this.UserStatus.WaitSelect:  userStatus.status = 'is waiting.'; break;
	case this.UserStatus.OwnerWaitJoin: userStatus.status ='has not started the game yet.'; break;
	case this.UserStatus.GameOver: userStatus.status = 'is done.'; break; 
	case this.UserStatus.Left: userStatus.status = 'left the game.'; break;
      	default: userStatus.status = this.getCustomUserStatus(userStatusEnum); break;    
	}
	userStatus.score = user.getScore();
	userStatus.connectStatus = user.connectStatus;
	if (this.ownerUid == user.id) {
	    userStatus.own = 1;
	}
	else { userStatus.own = 0; }
	userStatus.id = user.id;
        results.push(userStatus);
    }

    return results;
}

BaseSession.prototype.getUserStatusEnum = function (userId) {
    if (this.isGameOver()) {
	return this.UserStatus.GameOver;
    }

    if (this.status == this.SessionStatus.Waiting) { 
	if (userId == this.ownerUid) { 
	    return this.UserStatus.OwnerWaitJoin; 
	}
    
	return this.UserStatus.WaitJoin; 
    }

    var user = this.getUser(userId);
    if (user == undefined)
	return this.UserStatus.Undefined;

    return this.getCustomUserStatusEnum(user);
}


BaseSession.prototype.getNextDealer = function() {
    this.users[this.dealerId].isSelector = false;
    this.dealerId = (this.dealerId + 1) % this.users.length;  
    this.users[this.dealerId].isSelector = true;
    this.log("Next dealer is: " + this.users[this.dealerId].name + ".");
}

BaseSession.prototype.getNextDealerLeave = function() {  
    this.dealerId = (this.dealerId) % this.users.length;  
    this.users[this.dealerId].isSelector = true;
    this.log("Next dealer is: " + this.users[this.dealerId].name + ".");
}

BaseSession.prototype.returnOk = function() {
    var result ={};
    result.errors = [];
    result.result = true;
    return result;
}

BaseSession.prototype.returnError = function(message) {
    var result ={};
    result.errors = [];
    result.errors.push(message);
    result.result = false;
    return result;
}


BaseSession.prototype.SessionStatus = { Waiting : 1, Active : 2, Complete : 3};

BaseSession.prototype.UserStatus = {
    Undefined : 0,
    OwnerWaitJoin : 1,
    WaitJoin : 2,
    Timeout: 3,
    GameOver : 4,
    Left : 5,
    SelectCards : 6,
    WaitSelect : 7,
    Paused : 8
}

BaseSession.prototype.UserConnection = {
    Undefined : 0,
    Active : 1,
    Disconnected : 2
}

exports.BaseSession = BaseSession;
exports.SessionStatus = this.SessionStatus;
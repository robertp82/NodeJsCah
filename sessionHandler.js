var sessionManager = require("./sessionManager");
var userManager = require("./userManager");
var humSession = require("./humSession");
var fishSession = require("./fishSession");
var constants = require("./constants");
var humAnswerCards = require("./configs/humAnswerCards");
var humQuestionCards = require("./configs/humQuestionCards");

var humAnswers = new humAnswerCards.HumAnswerCards();
var humQuestions = new humQuestionCards.HumQuestionCards();

function createCustomSession(type) {
    switch (type) {
      case constants.SessionType.Humanity:
    	  session = new humSession.HumSession(0, type); break;
      case constants.SessionType.GoFish: 
      	session = new fishSession.FishSession(0); break;
      default: console.log('fail'); return;
    }
    
    var newSession = sessionManager.addSession(session);
    return newSession;
}

function getAnswerCard(type, i) {
    switch (type) {
    case constants.SessionType.Humanity: return humAnswers.getCard(i);
    }
}

function getAnswerLength(type) {
    switch (type) {
    case constants.SessionType.Humanity: return humAnswers.getLength();
    }
}

function getQuestionCard(type, i) {
    switch (type) {
    case constants.SessionType.Humanity: return humQuestions.getCard(i);
    }
}

function getQuestionLength(type, i) {
    switch (type) {
    case constants.SessionType.Humanity: return humQuestions.getLength();
    }
}

function createSession(response, args) {
    console.log('creating new session');
    var type = parseInt(args.type);
    var session = [];
    console.log('type:' + type);

    var newSession = createCustomSession(type);

    response.writeHead(200, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(newSession.id));
    response.end();
}

function addUser(response, args) {
    var session = sessionManager.getSession(args.sid);
    var user = userManager.getUser(args.uid);
    session.addUser(user);
}

function removeUser(response, args) {
    var session = sessionManager.getSession(args.sid);
    var user = session.getUser(args.uid);
    session.removeUser(user.id);
}

function startSession(response, args) {
    var session = sessionManager.getSession(args.sid);
    session.start();
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end();
}

function getSessionTypes(response, args) {
    response.writeHead(200, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(constants.DisplaySessionType));
    response.end();    
}

function listSessions(response, args) {
    response.writeHead(201, {
        "Content-Type": "application/javascript",
	"Access-Control-Allow-Origin" : "*"
    });
    var results = [];
    var sessions = sessionManager.getSessions();

    for (var i in sessions) {
    	if (sessions.hasOwnProperty(i)) {
        var session = sessions[i];
	      if (session.users == undefined) continue; //FIX THIS CRAPPY CODE
  	    if (session.status == 3) continue;
        
        var userList = [];
        for (var j = 0, jj = session.users.length; j < jj; j++) {
      		var user = session.users[j];
      		var userInfo = {id :user.id, name:user.name};
      		userList.push(userInfo);
        }
        
  	    var sessionInfo = {id: session.id, type: session.type, status: session.status, userList : userList };
	    results.push(sessionInfo);
    	}
    }
    
    response.write('func(' + JSON.stringify(results) + ')');
    response.end();		          
}

exports.createSession = createSession;
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.startSession = startSession;
exports.listSessions = listSessions;
exports.getSessionTypes = getSessionTypes;
exports.createCustomSession = createCustomSession;

exports.getAnswerCard = getAnswerCard;
exports.getAnswerLength = getAnswerLength;

exports.getQuestionCard = getQuestionCard;
exports.getQuestionLength = getQuestionLength;

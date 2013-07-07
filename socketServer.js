var sockets = [];

var sessionManager = require('./sessionManager');
var constants = require('./constants');
var io = require('socket.io'); 

function socketLogin(socket, data) {
    sockets.push(socket);
    console.log('login received with: ' + JSON.stringify(data));
    socket.set('uid', data.uid);
    socket.set('sid', data.sid);
    socket.get('uid', function(err, uid) {
	userId = uid; 
    });

    var session = sessionManager.getSession(data.sid);
    if (session == undefined) return;
    var user = session.getUser(data.uid);
    if (user == undefined) return;
    user.connectStatus = 1;
    
    sendUpdates(data.sid, 'connected', user.name);
    //console.log('sent from user Id: ' + userId);
}

function socketGameAction(socket, action, data) {
    //console.log('received websocket sendResponse');
    socket.get('uid', function(err, uid) {
        userId = uid;
    });
    socket.get('sid', function(err, sid) {
        sessionId = sid;
    });
    //console.log('received from: ' + userId + ' on: ' + sessionId);	
    //console.log(data);
    var session = sessionManager.getSession(sessionId);
    var result = session.socketHandler[action](userId, sessionId, data.response);

    if (result.result) {
	sendUpdates(sessionId, 'update', '');
    }
    else {
	var validationMessage = 'Invalid submission';
	if (result.errors != undefined && result.errors.length > 0) {
	    validationMessage = result.errors[0];
	}
	sendUserUpdate(sessionId, userId, 'validation', validationMessage);
    }
}

function socketChatMessage(socket, data) {
    var sendMessage = data.message;
    //console.log(JSON.stringify(sendMessage));
    socket.get('uid', function(err, uid) {
        userId = uid;
    });
    socket.get('sid', function(err, sid) {
        sessionId = sid;
    });

    var session = sessionManager.getSession(sessionId);
    if (!session) return;       
    
    var user = session.getUser(userId);
    if (user == undefined) return;
    var userName = user.name;

    session.logFile(userName + ": " + sendMessage);

    var contents = { name: userName, message: sendMessage };

    sendUpdates(sessionId, 'chat', contents);
}

function socketDisconnect(socket, data) {
    socket.get('uid', function(err, uid) {
        userId = uid;
    });
    socket.get('sid', function(err, sid) {
        sessionId = sid;
    });

    var session = sessionManager.getSession(sessionId);
    if (!session) return;
    
    var user = session.getUser(userId);
    if (user == undefined) return;
    user.connectStatus = 2;

    sendUpdates(sessionId, 'disconnected', user.name);
}

function sendUpdates(sessionId, channel, contents) {
    console.log('sending updates');
//    for (var i = 0; i < sockets.length; i++) {
    for (var i = sockets.length - 1; i > -1; i--) {
	var socket = sockets[i];
	
	socket.get('sid', function(err, sid) {
            socketSessionId = sid;
	});

	if (socketSessionId == sessionId) {
	    socket.emit(channel, contents);
	}
    } 
}

function sendUserUpdate(sessionId, userId, channel, contents) {
    console.log('sending user updates to ' + userId);
//    for (var i = 0; i < sockets.length; i++) {
    for (var i = sockets.length - 1; i > -1; i--) {
	var socket = sockets[i];
	
	socket.get('sid', function(err, sid) {
            socketSessionId = sid;
	});

	socket.get('uid', function(err, uid) {
            socketUserId = uid;
	});

	if (socketSessionId == sessionId && socketUserId == userId) {
	    socket.emit(channel, contents);
	}
    } 
}


function start() {
    var server = io.listen(constants.SocketIoPort);
    server.sockets.on('connection', function (socket) {
	socket.on('login', function(data) { socketLogin(socket, data) });

	socket.on('sendResponse', function(data) { socketGameAction(socket, 'sendResponse', data); });

	socket.on('selectResponse', function(data) { socketGameAction(socket, 'selectResponse', data); });

	socket.on('chat', function(data) { socketChatMessage(socket, data) });
	socket.on('disconnect', function(data) { socketDisconnect(socket, data) });
    });

}

exports.start = start;
exports.sendUpdates = sendUpdates;
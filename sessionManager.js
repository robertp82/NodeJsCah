
gameSessions = {};
nextSessionId = 1;

gameSessions.addSession = function(session) {
    session.id = nextSessionId++;
    gameSessions[session.id] = session;
    return session;
}

gameSessions.getSession = function (sessionId) {
    return gameSessions[sessionId];
}

gameSessions.getSessions = function() {
    return gameSessions;
}

exports.addSession = gameSessions.addSession;
exports.getSession = gameSessions.getSession;
exports.getSessions = gameSessions.getSessions;
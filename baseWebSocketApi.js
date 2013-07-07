var sessionManager = require("./sessionManager");
var handle = {};

//add validation
handle["sendResponse"] = function submitResponseSocket(userId, sessionId, responses) {
    var session = sessionManager.getSession(sessionId);
    if (session == undefined) return false;
    var user = session.getUser(userId);
    if (user == undefined) return false;

    var parsedResponses = session.getParsedSubmissions(responses);
    console.log(JSON.stringify(parsedResponses));
    if (parsedResponses == undefined) return false;
    console.log('setting up response for: ' + JSON.stringify(parsedResponses));


    var isValid = session.isValidSubmission(userId, parsedResponses);
    console.log('socket validation: ' + isValid.result);
    console.log('results: ' + JSON.stringify(isValid.errors));
    if (!isValid.result) return isValid;
    session.submitResponses(userId, parsedResponses);
    //user.submitResponses(parsedResponses);
    session.log(user.name + ' submits cards.');
    return isValid;
}

//add validation
handle["selectResponse"] = function selectResponseSocket(userId, sessionId, responses) {
    var session = sessionManager.getSession(sessionId);
    if (session == undefined) return false;
    var user = session.getUser(userId);
    if (user == undefined) return false;

    var parsedResponses = session.getParsedSelections(responses);
    if (parsedResponses == undefined) return false;

    var isValid = session.isValidSelection(user, parsedResponses);
    console.log('submitting:' + JSON.stringify(parsedResponses));
    console.log('isval: ' + JSON.stringify(isValid));
    if (!isValid.result) return isValid;
    session.completeRound(parsedResponses);
    return isValid;
}

exports.handle = handle;
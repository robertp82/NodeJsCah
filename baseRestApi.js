var sessionManager = require("./sessionManager");

var BaseRestApi = function() {};

BaseRestApi.prototype.getUserCards = function(response, args) {
    response.writeHead(200, {"Content-Type": "application/json"  });

    var session = args.session;
    var cards = session.getUsersCards(args.uid);

    if (cards == undefined) {
        response.write('Could not find cards for user: ' + args.uid);
        response.end();
        return;
    }

    response.write(JSON.stringify(cards));
    response.end();
}

BaseRestApi.prototype.getUserStatuses = function(response, args) {
   response.writeHead(200, { "Content-Type": "application/json" });
    var session = args.session;
    var statuses = session.getUserStatuses();
    response.write(JSON.stringify(statuses));
    response.end();
}

BaseRestApi.prototype.getPriorWinner = function(response, args) {
    response.writeHead(200, {
        "Content-Type": "application/json"
    });

    var session = args.session
    var priorWinner = session.getPriorWinner();
    if (priorWinner != undefined)
	response.write(JSON.stringify(priorWinner));
    response.end();
}

BaseRestApi.prototype.getAllUpdates = function(response, args) {
    response.writeHead(200, { "Content-Type": "application/json" });

//    var session = args.session;
    var session = sessionManager.getSession(args.sid);
    var user = session.getUser(args.uid);
    if (user == undefined) return;
    //console.log('requesting guc');
    var cards = session.getUsersCards(user.id);
    //console.log(JSON.stringify(cards) + '< guc');
    var statuses = session.getUserStatuses();
    var priorWinner = session.getPriorWinner();

    var results = {};
    results.cards = cards;
    results.statuses = statuses;
    results.priorWinner = priorWinner;

    response.end(JSON.stringify(results));
}


exports.BaseRestApi = BaseRestApi;

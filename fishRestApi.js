var sessionManager = require("./sessionManager");
var baseRestApi = require("./baseRestApi");

var FishRestApi = function() {
};

FishRestApi.prototype = new baseRestApi.BaseRestApi;

FishRestApi.prototype.getResponseCards = function(response, args) {
    console.log("Request handler 'responseCards' was called.");
    response.writeHead(200, {
       "Content-Type": "application/json"
    });

    if (args.session != undefined) {
	response.write(JSON.stringify(args.session.responseCardList));
    }
    response.end();
}

FishRestApi.prototype.getRequestCards = function(response, args) {
    console.log("Request handler 'responseCards' was called.");
    response.writeHead(200, {
        "Content-Type": "application/json"
    });

    if (args.session != undefined) {
	response.write(JSON.stringify(args.session.requestCardList));
    }    
    response.end();
}

FishRestApi.prototype.getResponseSubmissions = function(response, args) {
    console.log("Request handler 'getResponseSubmissions' was called.");
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });

    var session = args.session;
    var results = session.getPendingResponses();
    if (results.length == 0) {
        response.write('Not all users have submitted results.');
    } else {
        response.write(JSON.stringify(results));
    }

    response.end();
}

FishRestApi.prototype.getRequestCard = function(response, args) {
    response.writeHead(200, {
        "Content-Type": "application/json"
    });
    console.log('helo');

    var session = args.session;
    if (session != undefined) {
	if (session.activeRequestCard != undefined) {
	    response.write(JSON.stringify(session.activeRequestCard));
	}
    }
    response.end();
}

FishRestApi.prototype.submitResponse = function(response, args) {
    console.log("Request handler 'submitResponse' was called.'");
    response.writeHead(200, {
        "Content-Type": "application/json"
    });
 
    var session = args.session;
    var userId = args.uid;
    var response_card_ids = args.cards;

    var results =[];
    var isValid =  isValidSubmission(session, userId, responseCards, results);
    if (!isValid) {
	for (var i = 0; i < results.length; i++) {
	    response.write(results[i]);
	}
	response.end();
	return;
    }

    console.log('user id: ' + userId);
    console.log('response: ' + response_card_ids);

    console.log(results);
 //   user.submitResponses(results);
    user.submitResponses(response_card_ids);
    response.write(JSON.stringify("OK"));
    response.end();
}

FishRestApi.prototype.selectResponse = function(response, args) {
    console.log("Request handler 'selectResponse' was called.'");
    var session = args.session;

    //console.log(postData);
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    
    var user = session.getUser(args.user_id);
    var selectedResponses = args.cards;
    
    var results = [];
    var isValid = isValidSelection(session, user, selectedResponses, results);

    if (!isValid) {
	for (var i = 0; i < results.length; i++) {
	    response.write(results[i]);
	}

	response.end();
    }

    console.log('user id: ' + user_id);
    console.log('response: ' + response_card_ids);

    console.log(results);
//    session.completeRound(results);
    session.completeRound(selectedResponses);
    response.write(JSON.stringify('OK'));
    response.end();
}

exports.FishRestApi = FishRestApi;
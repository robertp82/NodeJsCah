var baseWebClient = require("./baseWebClient");
var fs = require('fs');
var _ = require('underscore');

var WebClient = function () {
    baseWebClient.BaseWebClient.call(this);
    this.humTemplate = fs.readFileSync('./templates/humWebClient.html', 'utf8');
    this.collapseCards = true;
};

WebClient.prototype = new baseWebClient.BaseWebClient;

WebClient.prototype.getInstructions = function(args) {
    var session = args.session;
    var user = session.getUser(args.uid);

    var activeCard = session.activeRequestCard;

    var userStatus = session.getUserStatusEnum(args.uid);
  
    var cards = [];
    var pendingResponses = [];
    var submittedCards = [];
    var userStatuses = session.UserStatus;
  
    console.log(userStatus);
    if (userStatus == userStatuses.SelectCards ) {
	cards = user.cards;
    }
    if (userStatus == userStatuses.DealerSelectCards || userStatus == userStatuses.WaitDealer) {
	pendingResponses = session.getPendingResponses();
    }
    if (userStatus == userStatuses.WaitSelect || userStatus == userStatuses.WaitDealer) {
	submittedCards = user.pendingCards;
    }

    var header = this.getHeader(user, userStatus, userStatuses);
    var headerContent = _.template(this.headerTemplate, {userStatus:userStatus, user:user, userStatuses:userStatuses, header:header});
 
    results = _.template(this.humTemplate, {activeCard:activeCard, cards:cards, userStatus:userStatus, user:user, userStatuses:userStatuses, pendingResponses:pendingResponses, submittedCards:submittedCards, header:header});

    return headerContent + results;
}

exports.WebClient = WebClient;

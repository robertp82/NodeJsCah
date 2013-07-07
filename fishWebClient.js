var baseWebClient = require("./baseWebClient");
var fs = require('fs');
var _ = require('underscore');


var FishWebClient = function () {
    this.collapseCards = false;
    this.fishTemplate = fs.readFileSync('./templates/fishWebClient.html', 'utf8');
    this.updateScriptLine = 'if (true) {';
//    baseWebClient.BaseWebClient.call(this);
};

FishWebClient.prototype = new baseWebClient.BaseWebClient;

FishWebClient.prototype.getInstructions = function(args) {
    var session = args.session;
    var user = session.getUser(args.uid);

    var userStatus = session.getUserStatusEnum(args.uid);
    var userStatuses = session.UserStatus;
    var targetCards = [];
    var targetUsers = [];
  
    if (userStatus == userStatuses.SelectCards || userStatus == userStatuses.SelectCardsAgain || userStatus == userStatuses.SelectCardsAgainDraw ) {
	targetCards = user.getHandValues()
	targetUsers = session.getTargetUsers(user.id);
    }

    var header = this.getHeader(user, userStatus, userStatuses);
    console.log('header: ' + JSON.stringify(header));

    var headerContent = _.template(this.headerTemplate, {userStatus:userStatus, user:user, userStatuses:userStatuses, header:header});
 
    var results = _.template(this.fishTemplate, {userStatus:userStatus, user:user, userStatuses:userStatuses, targetUsers:targetUsers, targetCards:targetCards, header:header, uid:user.id});

    return headerContent + results;
}

FishWebClient.prototype.getCustomHeader = function(user, userStatus, userStatuses) {
    switch(userStatus) {
    case userStatuses.SelectCardsAgain:
       return 'You received ' + user.lastSelect.length + ' ' + user.lastSelect[0].value + ' cards, now pick again.';
    case userStatuses.SelectCardsAgainDraw:
	return 'Go fish! You draw ' + user.lastDraw.text + '. You get to go again!';
    case userStatuses.PriorDealerFish:
        return 'Go fish! You draw ' + user.lastDraw.text + '. Now waiting for your next turn.';
    }
    return '?';
}

exports.FishWebClient = FishWebClient;

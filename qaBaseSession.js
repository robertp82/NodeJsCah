var baseSession = require("./baseSession");
var cardManager = require("./sessionHandler");

var QaBaseSession = function (id) {
    baseSession.BaseSession.call(this);
    this.init(id);
    this.deck = [];
    this.answerCards = [];
    this.activeRequestCard = 0;
    this.priorUrl = undefined;
    this.priorWinner = 0;
    this.priorWinningPhrase = 0;
    this.minRequestSlots = 1;
};

QaBaseSession.prototype = new baseSession.BaseSession;

QaBaseSession.prototype.startCustom = function () {
    this.prepareDeck();
    this.dealInitialPlayerCards();
    this.dealerId = 0;
    this.users[this.dealerId].isSelector = true;
    this.drawNewRequest();
    this.log("Starting a new game with: " + this.users[this.dealerId].name + " as dealer.");
};

QaBaseSession.prototype.removeCustomUser = function(user, isDealer) {
    if (isDealer) {	
	this.returnCustomPendingCards();
	this.getNextDealerLeave();
	this.sendSocketUpdate();
	return;
    }

    if (this.completeRoundSubmission()) {
	this.completeRound();
    }
}

QaBaseSession.prototype.returnCustomPendingCards = function() {
    for (var i = this.users.length -1 ; i > -1; i--) {
	var user = this.users[i];
	for (var j = user.pendingCards.length - 1; j > -1; j--) {
	    user.cards.push(user.pendingCards.pop());
	}
    }
}

QaBaseSession.prototype.drawNewRequestLog = function(dealer) {
    this.log(dealer.name + " draws '" + this.activeRequestCard.getBlankText() + "\'.");
}

QaBaseSession.prototype.drawNewRequest = function () {
    var foundValidCard = false;
    var dealer = this.users[this.dealerId];
    while (!foundValidCard) {
	var cardId = this.deck.pop();
//        this.activeRequestCard = this.deck.pop();
	this.activeRequestCard = cardManager.getQuestionCard(this.type, cardId);
	this.drawNewRequestLog(dealer);
        foundValidCard = this.minRequestSlots <= this.activeRequestCard.getQuestionCount();
    }
}

QaBaseSession.prototype.prepareDeck = function () {
    console.log('prepareDeck handled by child classes');
}

QaBaseSession.prototype.dealInitialPlayerCards = function () {
    this.dealCards(this.answerCards);  
}

QaBaseSession.prototype.completeRoundSubmission = function () {
    for (var x = 0, xx = this.users.length; x < xx; x++) {
	var user = this.users[x];
        if (user.isSelector) continue;
        if (user.pendingCards.length > 0) continue;
	//console.log(user.name + user.isSelector);
	//console.log(user.pendingCards.length);
	//console.log('round not showing as over');
        return false;
    }
    
    return true;
}

QaBaseSession.prototype.doRoundCleanup = function() {
    this.log(this.priorWinner + ' wins with: \'' + this.priorWinningPhrase + '\'.');
    this.getNextDealer();
    this.drawNewRequest(); 
}

QaBaseSession.prototype.getCustomUserStatus = function (status) {
    switch (status) {
      case this.UserStatus.SelectCards: return 'is selecting a response.';
      case this.UserStatus.DealerSelectCards: return 'is selecting a winner.'; 
      case this.UserStatus.DealerWaitSelect: return 'is waiting for everyone to submit cards.';
      case this.UserStatus.WaitDealer: return 'is waiting on a winner.';
    }
    return '';
}

QaBaseSession.prototype.getPendingResponses = function () {
    if (!this.completeRoundSubmission()) {
        return [];
    } else {
        var results = [];
        for (var x = 0, xx = this.users.length; x < xx; x++) {
            if (this.users[x].pendingCards.length > 0) {
                results.push(this.users[x].pendingCards);
            }
        }

	//randomize order of results
	results.sort(function () {
            return 0.5 - Math.random()
	});

        return results;
    }
}

QaBaseSession.prototype.getPriorWinner = function () {
    var results = {};

    if (this.priorWinningPhrase == 0) {
	return undefined;
    }
    
    if (this.priorUrl) {
	results.priorUrl = this.priorUrl;
    }

    results.priorWinner = this.priorWinner;
    results.priorPhrase = this.priorWinningPhrase;

    return results;
}    

QaBaseSession.prototype.getCustomUserStatusEnum = function (user) {
    if (user.isSelector) {
        if (this.completeRoundSubmission()) {
	    return this.UserStatus.DealerSelectCards;                    
	} 
	else {
	    return this.UserStatus.DealerWaitSelect;
        }
    } 
    else if (this.completeRoundSubmission()) {
	return this.UserStatus.WaitDealer;
            
    } 
    else if (user.pendingCards.length == 0) {
	return this.UserStatus.SelectCards;            
    } 
    else {
	return this.UserStatus.WaitSelect;
    }

    return this.UserStatus.Undefined;
}

QaBaseSession.prototype.isValidSelection = function(user, selectedResponses, results) {    
    if (!user.isSelector) {
	return this.returnError(user.name + ' is not the dealer.'); 
    }
   
    if (!this.completeRoundSubmission()) {
        return this.returnError('Not all users have submitted results.');   
    }
   
    return this.returnOk();
}

var addStatus = {
    WaitDealer : 21,
    DealerSelectCards : 22,
    DealerWaitSelect : 23,
}

QaBaseSession.UserStatus = QaBaseSession.prototype.UserStatus;

Object.keys(addStatus).forEach(function (item) {
    QaBaseSession.UserStatus[item] = addStatus[item];
});

exports.QaBaseSession = QaBaseSession;
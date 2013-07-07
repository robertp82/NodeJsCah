var stdCard = require("./stdCard");
var stdCards = require("./stdCards");
var constants = require("./constants");
var baseSession = require("./baseSession");
var fishUser = require("./fishUser");
var handlers = require("./fishHandlers");
var querystring = require("querystring");

var FishSession = function (id) {
    baseSession.BaseSession.call(this);
    this.init(id);
    this.deck = [];
    this.type = constants.SessionType.GoFish;
    this.handler = handlers.handle;
    this.priorDealerId = 0;
    this.cardsPerUser = 5;
    this.maxUsers = 6;
};

FishSession.prototype = new baseSession.BaseSession;

FishSession.prototype.getParsedSubmissions = function(responses) {
    var responses = querystring.parse(responses);
    return responses;
}

FishSession.prototype.submitResponses = function(userId, responses) {
    var user = this.getUser(userId);
    if (user == undefined) return;
    console.log('submitting fish resp');

    var results = this.submitResponse(userId, responses.player, responses.cards);
    if (results == undefined) {
       this.completeRound(responses.cards);
    }
}

FishSession.prototype.addCustomUser = function (user) {
    var fUser = new fishUser.FishUser(user.id, user.name, user.isAdmin);
    this.users.push(fUser);
};

FishSession.prototype.startCustom = function () {    
    this.prepareDeck();
    this.dealInitialPlayerCards();
    this.dealerId = 0;
    this.users[this.dealerId].isSelector = true;
    this.log("Starting a new Go Fish game with: " + this.users[this.dealerId].name + " as dealer.");
};

FishSession.prototype.isCustomGameOver = function() {   
    for (var i = this.users.length - 1; i > -1; i--) {
	if (this.users[i].cards.length == 0)  {
	    this.status = this.SessionStatus.Complete;
	    return true;
	}
    }
    return false;
};

FishSession.prototype.prepareDeck = function () {    
    for (var i = stdCards.StdCards.length - 1; i > -1; i--) { 
	var card = stdCards.StdCards[i];
        this.deck.push(card);
    }
    this.deck.sort(function () {
        return 0.5 - Math.random()
    });
};

FishSession.prototype.dealInitialPlayerCards = function () { 
    if (this.users.length <= 4) {
	this.cardsPerUser = 7;
    }

    this.dealCards(this.deck);
    
    //try to sort these
    for (var x = this.users.length - 1; x > -1; x--) {
	var user = this.users[x];
	user.cards.sort(sortCards);
    }
}

function sortCards(a,b) {
    //console.log(a.value);
    return a.value - b.value;
}

FishSession.prototype.submitResponse = function(fromUserId, toUserId, cardValue) {
    //console.log('start submitResponse');

    if (this.isGameOver()) 
	return undefined;

    var fromUser = this.getUser(fromUserId);
    var toUser = this.getUser(toUserId);

    this.log(fromUser.name + ' asks ' + toUser.name + ' for ' + cardValue + ' cards.')

    var toUserCards = toUser.getCardsByValue(cardValue);
    if (toUserCards.length == 0)
    {
	//console.log('GO FISH!');
	this.log(toUser.name + ' tells ' + fromUser.name + ' to \'GO FISH!\'');
	return undefined; //go fish
    }

    this.log(toUser.name + ' gives ' + fromUser.name + ' ' + toUserCards.length + ' ' + cardValue + ' cards');

    //console.log('win of size: ' + toUserCards.length);
    for (var x =0; x < toUserCards.length; x++)
    {
	fromUser.cards.push(toUserCards[x]);
    }
    this.getBooks(fromUser, cardValue);
//    fromUser.getBooks(cardValue);
    fromUser.lastSelect = toUserCards;
    fromUser.cards.sort(sortCards);
    return toUserCards;
}

FishSession.prototype.getBooks = function(user, cardValue) {
    var gotBook = user.getBooks(cardValue);
    if (gotBook) {
	this.log(user.name + ' wins a book of ' + cardValue + '.');
    }
}

FishSession.prototype.completeRound = function (cardValue) {
//    if (!this.completeRoundSubmission) return false;

    //console.log(JSON.stringify(winning_response_ids))

    if (this.deck.length == 0) return; //game over without full check

    var dealer = this.users[this.dealerId];

    var drawnCard = this.deck.pop();
    
    dealer.addCard(drawnCard);   
    this.getBooks(dealer, drawnCard.value);
    dealer.cards.sort(sortCards);

    if (this.deck.length == 0) return; //game over without full check

    dealer.lastDraw = drawnCard;

    if (drawnCard.value == cardValue)
    {
	dealer.lastDrawMatch = true;
	//console.log('user gets another shot, draws a ' + cardValue);
	this.log(dealer.name + ' draws a ' + cardValue + ' and gets to go again.');
	return;
    }
    dealer.lastDrawMatch = false;

    dealer.lastSelect = [];
    
    //check if user has any books
    
    //draw a new card  

    this.priorDealerId = dealer.id;
   
    this.getNextDealer();
    //console.log ('new:' + this.dealerId + ' old: ' + this.priorDealerId);
}

FishSession.prototype.getPriorWinner = function () {
    var results = {};

    return undefined;

    if (this.priorWinningPhrase == 0) {
	return undefined;
    }

    results.priorWinner = this.priorWinner;
    results.priorPhrase = this.priorWinningPhrase;

    return results;
}    

FishSession.prototype.getCustomUserStatus = function (status) {	
    switch (status) 
    {
    case this.UserStatus.SelectCards : return 'is fishing.';
    case this.UserStatus.SelectCardsAgain: return 'is fishing again after choosing wisely.';
    case this.UserStatus.SelectCardsAgainDraw: return 'is fishing again after drawing the right card.';
    case this.UserStatus.PriorDealerFish: return 'is waiting after going fish.';
    }
    return '';
}

FishSession.prototype.getCustomUserStatusEnum = function (user) {
    if (user.isSelector) {
	if (user.lastSelect.length == 0) {
	    //console.log('last draw' + user.lastDrawMatch);
	    if (user.lastDrawMatch == true && user.lastDraw != undefined) {
		return this.UserStatus.SelectCardsAgainDraw;
	    }
	    else {
		return this.UserStatus.SelectCards;
	    }
	}
	else {
	    return this.UserStatus.SelectCardsAgain;
	}
    } 
    else if (user.id == this.priorDealerId) {
	return this.UserStatus.PriorDealerFish;
    }
    else {
	return this.UserStatus.WaitSelect;
    }

    return this.UserStatus.Undefined;
};

FishSession.prototype.getTargetUsers = function (userId) {
    var results = [];
    for (var i = this.users.length - 1; i > -1;  i--) {
	var user = this.users[i];
	if (user.id != userId) {
	    var userInfo = [user.id, user.name];
	    results.push(userInfo);
	}
    }
    return results;
};

FishSession.prototype.isValidSubmission = function(userId, responseIds, results) {
    return this.returnOk();
}

var addStatus = {
    SelectCardsAgain : 31,
    SelectCardsAgainDraw : 32,
    PriorDealerFish : 33
}

FishSession.UserStatus = FishSession.prototype.UserStatus;

Object.keys(addStatus).forEach(function (item) {
    FishSession.UserStatus[item] = addStatus[item];
});

exports.FishSession = FishSession;
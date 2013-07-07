var constants = require("./constants");
var humUser = require("./humUser");
var humCard = require("./humCard");
var qaBaseSession = require("./qaBaseSession");
var handlers = require("./humHandlers");
var querystring = require("querystring");
var cardManager = require("./sessionHandler");

var HumSession = function (id, type) {
    qaBaseSession.QaBaseSession.call(this);
    this.deck = [];
    this.minRequestSlots = 1;
    this.type = type;
    this.handler = handlers.handle;
    this.minUsers = 2;
    this.maxUsers = 20;
    this.cardsPerUser = 10;
};

HumSession.prototype = new qaBaseSession.QaBaseSession;

HumSession.prototype.getParsedSubmissions = function(responses) {
    var args = querystring.parse(responses);
    //console.log('args ' + JSON.stringify(args));
//    var responses = args.response_card_ids;                                   
    var cards = [];
    cards.push(args.card0);
    if (args.card1 != undefined) {
        cards.push(args.card1);
        if (args.card2 != undefined) {
            cards.push(args.card2);
	}
    }
    //console.log('out args: ' + JSON.stringify(cards));
    return cards;
}

HumSession.prototype.getParsedSelections = function(responses) {
    var args = querystring.parse(responses);
    var responses = args.responseCardIds;
    if (responses == undefined) return undefined;
    var cards = responses.split(',');
    return cards;
}

HumSession.prototype.addCustomUser = function (user) {
    var hUser = new humUser.HumUser(user.id, user.name, user.isAdmin);
    this.users.push(hUser);
};

HumSession.prototype.returnCustomPendingCards = function() {
    for (var i = this.users.length -1 ; i > -1; i--) {
	var user = this.users[i];
	for (var j = user.pendingCards.length - 1; j > -1; j--) {
	    user.cards.push(user.pendingCards.pop());
	}
    }
}

HumSession.prototype.prepareDeck = function () {
    for (var i = cardManager.getAnswerLength(this.type) - 1; i > -1; i--) {
        this.answerCards.push(i);
    }
    this.answerCards.sort(function () {
        return 0.5 - Math.random()
    });

    for (var i = cardManager.getQuestionLength(this.type) - 1; i > -1; i--) {
        this.deck.push(i);
    }

    this.deck.sort(function () {
        return 0.5 - Math.random()
    })
}

HumSession.prototype.submitResponses = function (userId, selectedResponses) {
    var user = this.getUser(userId);
    if (user == undefined) return;
    if (user.isSelector) return false;
    if (user.pendingCards.length > 0) return false;
    if (selectedResponses.length == 0) return false;

    var selectedCards = [];
    for (var x = selectedResponses.length - 1; x > -1; x--) {
        for (var y = user.cards.length - 1; y > -1; y--) {
	    var card = user.cards[y];
            if (selectedResponses[x] == card.id) {
                selectedCards.push(card);
            }
	}
    }

    for (var x = selectedResponses.length - 1; x > -1; x--) {
        user.pendingCards.push(selectedCards[x]);
        for (var y = user.cards.length-1; y > -1; y--) {
            if (user.cards[y].id == selectedCards[x].id) {
                user.cards.splice(y, 1);
            }
        }
    }
    console.log(user.name + ' submits a response.');
    return true;
};

HumSession.prototype.completeRound = function (winningResponseIds) {
    if (!this.completeRoundSubmission) return false;

    console.log(JSON.stringify(this));

    var winningUser = 0;
    var winningResponses = [];
    for (var z = this.users.length - 1; z > -1; z--) {
        var user = this.users[z];
        for (var x = 0, xx = winningResponseIds.length; x < xx; x++) {
	    if (user != undefined && user.pendingCards != undefined) {
		for (var y = 0, yy = user.pendingCards.length; y < yy; y++) {
                    if (winningResponseIds[x] == user.pendingCards[y].id) {
			winningResponses.push(user.pendingCards[y]);
			winningUser = user;
                    }
		}
	    }
        }
    }

    if (winningUser == 0) {
        return false;
    }
    winningUser.winningRequestCards.push(this.activeRequestCard);

    this.priorWinner = winningUser.name;
    this.priorWinningPhrase = this.activeRequestCard.getFullPhrase(winningResponses);

    this.doRoundCleanup();

    for (var x = 0, xx = this.users.length; x < xx; x++) {
	var user = this.users[x];
        if (user.pendingCards.length > 0) {
            user.pendingCards = [];
            for (var y = 0, yy = winningResponses.length; y < yy; y++) {
		var cardId = this.answerCards.pop();
		console.log('card id: ' +cardId);
		var card = cardManager.getAnswerCard(this.type, cardId);
		user.cards.push(card);
//                user.cards.push(this.answerCards.pop());
            }
        }
    }
}

HumSession.prototype.isValidSubmission = function(userId, responseIds) {
    var expectedAnswerCount = this.activeRequestCard.getQuestionCount();

    if (expectedAnswerCount != responseIds.length) {
        return this.returnError('You need to submit: ' + expectedAnswerCount + ' answers for this round.');
    }

    var user = this.getUser(userId);
    if (user == undefined || user.pendingCards == undefined) return false;
    if (user.pendingCards.length > 0) {
        return this.returnError('You already submitted cards.');
    }

    var foundCount = 0;
    for (var x = responseIds.length - 1; x > -1; x--) {
        var responseCardId = responseIds[x];
        if (responseIds.indexOf(responseCardId) != x) {
            return this.returnError('Submit unique cards'); 
        }
        for (var y = user.cards.length - 1; y > -1; y--) {
            if (responseCardId == user.cards[y].id) {
                foundCount++;
            }
        }
    }

    if (foundCount != expectedAnswerCount) {
        return this.returnError('Please submit valid card id(s).');
    }
    return this.returnOk();
}

exports.HumSession = HumSession;
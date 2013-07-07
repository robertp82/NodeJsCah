var baseUser = require("./baseUser");

var FishUser = function (id, name, isAdmin) {
    baseUser.BaseUser.call(this);
    this.init(id, name, isAdmin);
    this.books = [];
    this.lastDraw = undefined;
    this.lastSelect = [];
    this.lastDrawMatch = false;
};

FishUser.prototype = new baseUser.BaseUser;

FishUser.prototype.initialize = function () {
    this.cards = [];
};

FishUser.prototype.getScore = function() {
    return this.books.length;
};

FishUser.prototype.getHandValues = function() {
    var results = [];
    for (var i = this.cards.length - 1; i > -1; i--) {
	//console.log(JSON.stringify(this.cards[i]));
	var cardValue = this.cards[i].value;
	if (results.indexOf(cardValue) == -1) {
	    results.push(cardValue);
	}
    }    

    return results.sort();
}

FishUser.prototype.getBooks = function (cardValue) {
    var cardCount = 0;

    for (var i = this.cards.length -1 ; i > -1; i--) {
	if (this.cards[i].value == cardValue) {
	    cardCount++;
	}
    }
    if (cardCount == 4) {
	console.log('Book acquired for: ' + cardValue);
	for (var i = this.cards.length - 1; i > -1; i--) {
	    if (this.cards[i].value == cardValue) {
		this.cards.splice(i, 1);
	    }
	}
	this.books.push(cardValue);   	
	return true;
    }
    return false;
}

FishUser.prototype.getCardsByValue = function (cardValue) {
    var results = [];
    for (var i = this.cards.length - 1; i > -1; i--) {
//	console.log(this.cards[i].value);
	if (this.cards[i].value == cardValue) {
	    results.push(this.cards[i]);	  
	}
    }
    for (var i = results.length - 1; i > -1; i--) {
	for (var j = this.cards.length - 1; j > -1; j--)
	{
	    if (results[i].id == this.cards[j].id) {
//		console.log('splce');		
		this.cards.splice(j, 1);
	    }
	}
    }
//    console.log('get here');
    return results;
};

exports.FishUser = FishUser;
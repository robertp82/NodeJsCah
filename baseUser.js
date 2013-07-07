var BaseUser = function (id, name, isAdmin) {
    this.cards = [];
    this.isSelector = false;
    this.connectStatus = 0;
    this.isPaused = false;
};

BaseUser.prototype.init = function(id, name, isAdmin) {
    this.id = id;
    this.name = name;
    if (isAdmin == undefined) {
	this.isAdmin = false;
    }
    else {
	this.isAdmin = isAdmin;
    }
}

BaseUser.prototype.getId = function () {
    return this.id;
};

BaseUser.prototype.getName = function () {
    return this.name;
};

BaseUser.prototype.getScore = function () {
//    return this.winning_request_cards.length;
};

BaseUser.prototype.logCards = function () {
    for (var x = 0; x < this.cards.length; x++) {
        console.log(this.cards[x].id + ": " + this.cards[x].text);
    }
};

BaseUser.prototype.logScore = function () {
    console.log(this.getScore());
};

BaseUser.prototype.addCard = function (card) {
    this.cards.push(card);
};

BaseUser.prototype.initialize = function () {
    this.cards = [];
//    this.pending_cards = [];
//    this.winning_request_cards = [];
};

exports.BaseUser = BaseUser;


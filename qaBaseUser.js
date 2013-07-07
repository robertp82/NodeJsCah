var baseUser = require("./baseUser");

var QaBaseUser = function (id, name, isAdmin) {
    baseUser.BaseUser.call(this);
    this.init(id, name, isAdmin);
    this.pendingCards = [];
    this.winningRequestCards = [];
};

QaBaseUser.prototype = new baseUser.BaseUser;

QaBaseUser.prototype.initialize = function () {
    this.cards = [];
    this.pendingCards = [];
    this.winningRequestCards = [];
};

QaBaseUser.prototype.getScore = function () {
    return this.winningRequestCards.length;
};

QaBaseUser.prototype.startNewRound = function (isSelector, newCards) {
    this.isSelector = isSelector;
    this.pendingCards = [];
    this.dealCards(newCards);
};

exports.QaBaseUser = QaBaseUser;
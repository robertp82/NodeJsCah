var baseCard = require("./baseCard");

if (typeof Object.beget !== 'function') {
    Object.beget = function (o) {
	var F = function() {};
	F.prototype = o;
	return new F();
    };
}

//var StdCard = Object.beget(baseCard.BaseCard);


var StdCard = function(id, value, suit)
{
    baseCard.BaseCard.call(this);
    this.value = value;
    this.suit = suit;
    this.init(id, value + ' ' + suit);
    //this.text = value +  ' ' + suit;
 }

StdCard.prototype = new baseCard.BaseCard;


//StdCard.value = 0;
//StdCard.suit = 0;


//console.log(JSON.stringify(GameCard));

exports.StdCard = StdCard;
exports.SuitsEnum = {
//    Undefined : 'Undefined',
    Club : 'Clubs',
    Spade : 'Spades',
    Heart : 'Hearts',
    Diamond : 'Diamonds'
}

exports.CardEnum = {
    2 : '2',
    3 : '3',
    4 : '4',
    5 : '5',
    6 : '6',
    7 : '7',
    8 : '8',
    9 : '9',
    10 : '10',
    J : 'Jack',
    Q : 'Queen',
    K : 'King',
    A : 'Ace'
}
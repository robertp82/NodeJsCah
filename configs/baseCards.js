
var BaseCards = function() {    
    this.cardArray = new Array();
    this.data = [];
}

BaseCards.prototype.createArray = function() {
    for (var i = this.data.length -1; i > -1; i--) {
	this.cardArray[i] = this.data[i];
    }
}

BaseCards.prototype.getLength = function() {
    return this.data.length;
}


exports.BaseCards = BaseCards;
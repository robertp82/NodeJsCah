var baseCard = require("./baseCard");

QaBaseCard = function(id, text) {
    baseCard.BaseCard.call(this);
    this.init(id, text);
}

QaBaseCard.prototype = new baseCard.BaseCard;

QaBaseCard.prototype.getBlankText = function (  ) {
    return this.text.replace(/%s/g, "___");
};

QaBaseCard.prototype.getQuestionCount = function() {
    var c = 0;
    var token = "%s";
    for (var i = 0, ii = this.getText().length; i < ii; i++) { 
	if (token == this.text.substr(i, token.length)) 
	    c++; 
    } 
    return c;
};

QaBaseCard.prototype.getFullPhrase = function(submitCards) {
    var phrase = this.text;
    
    for (var j = 0, jj = submitCards.length; j < jj; j++) {
	phrase = phrase.replace("%s", submitCards[j].getText());
    }
    
    return phrase;
}

exports.QaBaseCard = QaBaseCard;

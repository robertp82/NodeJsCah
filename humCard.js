var qaBaseCard = require("./qaBaseCard");

HumCard = function(id, text) {
    qaBaseCard.QaBaseCard.call(this);
    this.init(id, text);
}

HumCard.prototype = new qaBaseCard.QaBaseCard;

exports.HumCard = HumCard;

var BaseCard = function (id, text) {
    this.init(id, text);
};

BaseCard.prototype.init = function(id, text) {
   this.id = id;
   this.text = text;
}

BaseCard.prototype.getId = function (  ) {
    return this.id;
};

BaseCard.prototype.getText = function (  ) {
    return this.text;
};

exports.BaseCard = BaseCard;

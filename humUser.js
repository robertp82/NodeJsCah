var qaBaseUser = require("./qaBaseUser");

var HumUser = function (id, name, isAdmin) {
    qaBaseUser.QaBaseUser.call(this);
    this.init(id, name, isAdmin);
};

HumUser.prototype = new qaBaseUser.QaBaseUser;

exports.HumUser = HumUser;
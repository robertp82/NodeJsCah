var baseUser = require("./baseUser");

var StoredUser = function (id, name, isAdmin) {
    baseUser.BaseUser.call(this);
    this.password = 0;
    this.email = 0;
    this.init(id, name, isAdmin);
};

StoredUser.prototype = new baseUser.BaseUser;

StoredUser.prototype.getEmail = function () {
    return this.email;
};

StoredUser.prototype.setEmail = function(email) {
    this.email = email;
}

exports.StoredUser = StoredUser;


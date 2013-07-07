var restApi = require("./fishRestApi");
var webClient = require("./fishWebClient");
var constants = require("./constants.js");
var handle = {}

var web = new webClient.FishWebClient();
var restApi = new restApi.FishRestApi();

var apiPrefix = constants.ApiPrefix;

handle["/web"] = function(response, args) { web.getWebClient(response, args); };
handle["/webUpdate"] = function(response, args) { web.getWebUpdate(response, args); };

handle[apiPrefix + "cards"] = function(response, args) { restApi.getUserCards(response, args); };
handle[apiPrefix + "users"] = function(response, args) { restApi.getUserStatuses(response, args); };
handle[apiPrefix + "allUpdates"] = function(response, args) { restApi.getAllUpdates(response, args); };

exports.handle = handle;
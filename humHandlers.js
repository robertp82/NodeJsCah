var restApi = require("./humRestApi");
var webClient = require("./humWebClient");
var constants = require("./constants");

var handle = {}

var web = new webClient.WebClient();
var restApi = new restApi.HumRestApi();

var apiPrefix = constants.ApiPrefix;


handle["/web"] = function(response, args) { web.getWebClient(response, args); };
handle["/webUpdate"] = function(response, args) { web.getWebUpdate(response, args); };


handle[apiPrefix + "responseCards"] = function(response, args) { restApi.getResponseCards(response, args); };
handle[apiPrefix + "requestCards"] = function(response, args) { restApi.getRequestCards(response, args); };
handle[apiPrefix + "requestCard"] = function(response, args) { restApi.getRequestCard(response, args); };
handle[apiPrefix +"cards"] = function(response, args) { restApi.getUserCards(response, args); };
handle[apiPrefix + "users"] = function(response, args) { restApi.getUserStatuses(response, args); };
handle[apiPrefix + "priorWinner"] = function(response, args) { restApi.getPriorWinner(response, args); }; 
handle[apiPrefix + "allUpdates"] = function(response, args) { restApi.getAllUpdates(response, args); };

handle[apiPrefix + "submitResponse"] = function(response, args) { restApi.submitResponse(response, args); };
handle[apiPrefix + "selectResponse"] = function(response, args) { restApi.selectResponse(response, args); };

exports.handle = handle;
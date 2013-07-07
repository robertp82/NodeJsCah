var sessionHandler = require("./sessionHandler");
var userHandler = require("./userHandler");
var webLogin = require("./loginHandler");
var webLobby = require("./lobbyHandler");
var webAction = require("./actionHandler");
var constants = require("./constants");

var handle = {}

var loginWeb = new webLogin.LoginWebClient();
var lobbyWeb = new webLobby.LobbyWebClient();
var actionWeb = new webAction.ActionWebClient();

var apiPrefix = constants.ApiPrefix;

handle["/"] = function(response, args) { lobbyWeb.getLobby(response, args); };
handle["/lobby"] =  function(response, args) { lobbyWeb.getLobby(response, args); };
handle["/lobby/game"] =  function(response, args) { lobbyWeb.addGame(response, args); };


handle["/login"] = function(response, args) { loginWeb.login(response, args); };
handle["/auth"] = function(response, args) { loginWeb.auth(response, args); };
handle["/register"] =  function(response, args) { loginWeb.register(response, args); };


handle["/join"] = function(response, args) { actionWeb.joinSession(response, args); };
handle["/leave"] = function(response, args) { actionWeb.leaveSession(response, args); };
handle["/adminAction"] = function(response, args) { actionWeb.adminAction(response, args); };


handle[apiPrefix + "user/create"] = userHandler.createUser;
handle[apiPrefix + "user/update"] = userHandler.updateUser;
handle[apiPrefix + "user/auth"] = userHandler.authUser;


handle[apiPrefix + "session/create"] = sessionHandler.createSession;
handle[apiPrefix + "session/addUser"] = sessionHandler.addUser;
handle[apiPrefix + "session/removeUser"] = sessionHandler.removeUser;
handle[apiPrefix + "session/start"] = sessionHandler.startSession;
handle[apiPrefix + "session/list"] = sessionHandler.listSessions;
handle[apiPrefix + "session/types"] = sessionHandler.getSessionTypes;

exports.handle = handle;
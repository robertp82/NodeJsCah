var server = require("./server");
var socketServer = require("./socketServer");
var startupScript = require ("./startup");

startupScript.start();
socketServer.start();
server.start();
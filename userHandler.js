var userManager = require("./userManager");

//console.log('user handler');

function authUser(response, args) {
    userManager.authParseUser(args.username, args.password, response, function(data, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
 
	if (data.username == undefined) {
	    response.write(''); }
	else { 
	    response.write(data.objectId);

	}
	//response.write(JSON.stringify(data));
    response.end();
    });
}

function createUser(response, args) {
    console.log('creating user: ' + args.name);
    var user_id = userManager.addUser(args.name);
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(user_id));
    response.end();
}

function updateUser(response, args) {
}

function listUsers(response, args) {
    response.writeHead(200, {"Content-Type": "application/json"});
    var users = userManager.getUsers();
    for (var i = 0; i < users.length; i++) {
	var user = users[i];
	var userInfo = [user.id, user.name];
	response.write(JSON.stringify(userInfo));
    }
    response.end();
}

exports.createUser = createUser;
exports.updateUser = updateUser;
exports.listUsers = listUsers;
exports.authUser = authUser;
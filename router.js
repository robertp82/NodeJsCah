var sessionManager = require("./sessionManager");
var url = require("url");
var globalHandlers = require("./globalHandlers");
var querystring = require("querystring");

function route(request, pathname, response, postData) {
    console.log(pathname);
        
    var args = {};
    var activeHandler = {};
  
    if (request.method == 'POST' ) {
	postData = querystring.parse(postData);
	console.log('post data: ' + JSON.stringify(postData));
	args = postData;	
    }
    else {
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	console.log(JSON.stringify(query));
	args = url_parts.query;
    }

    if (args.sid != undefined) {
	args.session = sessionManager.getSession(args.sid);
    }
    
    if (pathname in globalHandlers.handle) {
	activeHandler = globalHandlers.handle;
    }
    else if (args.session != undefined && pathname in args.session.handler) {
	activeHandler = args.session.handler;
    }
    else {
	return;
    }

    if (request.session && request.session.uid != undefined) {
	args.uid = request.session.uid;
    }

    activeHandler[pathname](response, args); 
   
    //console.log(pathname);
    if (pathname.indexOf('favicon.ico') != -1) {
        console.log('ignore favicon.ico request.');
        return;
    }
}
exports.route = route;
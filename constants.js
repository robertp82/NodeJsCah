var config = require("./config");

HostUrl = config.HostUrl;
SocketIoPort = config.SocketIoPort;
WebPort = config.WebPort;
StaticUrl = config.StaticUrl;

exports.ParseEnv = config.ParseEnv;
exports.ApiPrefix = "/api/1/";
exports.SocketIoPort = SocketIoPort;
exports.WebPort = WebPort;
exports.HostUrl =  HostUrl;
exports.StaticUrl = StaticUrl;
exports.AppName = config.AppName;
exports.LogPath = config.LogPath;

exports.SessionType = {
    Humanity : 1,
    GoFish : 2
}

exports.DisplaySessionType = {
    1 : "Cards Against Humanity",
    2 : "Go Fish"
}

exports.CssIncludes = '<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css" />\n<link rel="stylesheet" href="' + StaticUrl + 'demo.css"/>';

//exports.JQueryIncludes = '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>\n<script type="text/javascript" src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js"></script>';


exports.JQueryIncludes = '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>\n<script type="text/javascript" src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js"></script>';


exports.IconLoading = config.ImageUrl + "user--arrow.png";
exports.IconActive = config.ImageUrl + "user.png";
exports.IconOwner = config.ImageUrl + "user-black.png";
exports.IconTimeout = config.ImageUrl + "clock--minus.png";
exports.IconKick = config.ImageUrl + "shoe--minus.png";
exports.IconPause = config.ImageUrl + "hourglass--minus.png";

exports.SocketIoIncludes = '\n<script src="' + HostUrl + ':' + SocketIoPort + '/socket.io/socket.io.js"></script>\n';

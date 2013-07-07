#TODO: Set Urls
exports.AppName = "Games Against Humanity";
exports.HostUrl = "http://localhost";
exports.StaticUrl = "http://localhost/node/";
exports.ImageUrl = "http://localhost/node/images/";
exports.SocketIoPort = 8889;
exports.WebPort = 8888;
exports.ParseEnv = 'D';

#TODO: Set Log paths
exports.LogPath = '/home/user/dev/node/cah/gamelogs/';

#TODO: Set Parse AppID and RestId

ParseAppId = 'CONFIG REQUIRED';
ParseRestId = 'CONFIG REQUIRED';

exports.ParseAppId = ParseAppId;
exports.ParseRestId = ParseRestId;
exports.ParseUrl = 'api.parse.com';
exports.ParsePort = 443;
exports.ParseHeaders = { 'X-Parse-Application-Id': ParseAppId , 'X-Parse-REST-API-Key': ParseRestId, 'Content-Type':'application/json' };

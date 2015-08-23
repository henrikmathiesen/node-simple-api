var http = require('http');


var routes = {
	getEvents: "/getevents"
};

var send404Response = function (res) {
	res.writeHead(200, { 'Context-Type': 'text/plain' });
	res.write('404: Not found');
	res.end();
};

var sendEvents = function (res) {
	res.writeHead(200, { 'Context-Type': 'text/plain' });
	res.write('Hi there!');
	res.end();
};

http.createServer(function (req, res) {

	if((req.method == 'GET') && (req.url == routes.getEvents)) {
		sendEvents(res);
	}
	else {
		send404Response(res);
	}


}).listen(1338);
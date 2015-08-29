var http = require('http');
var qs = require('querystring');

var events = require('./events.js');

var routes = {
	getEvents: '/getevents',
	getEvent: '/getevent?id=',
	postEvent: '/postevent'
};

var send404Response = function (res) {
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.write('404: Not found');
};

var setCorsHeaders = function (res, save) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1337');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (save) {
		res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	}
};

var sendEvents = function (res) {
	setCorsHeaders(res);
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(events));
};

var sendEvent = function (res, id) {
	setCorsHeaders(res);

	id = parseInt(id);
	var eventToSend = events[id];

	if (!eventToSend) {
		send404Response(res);
		return;
	}

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(eventToSend));
};

var preflightResponse = function (res) {
	setCorsHeaders(res, true);
	res.writeHead(200);
};

var saveEvent = function (req, res) {
	setCorsHeaders(res, true);

	var data = null;

	req.on('data', function (payload) {
		data += payload;
	});
	req.on('end', function () {
		data = qs.parse(data);
		//data = JSON.parse(data);
		
	});

	res.writeHead(200);
};

http.createServer(function (req, res) {

	if ((req.method == 'GET') && (req.url == routes.getEvents)) {
		sendEvents(res);
	}
	else if ((req.method == 'GET') && (req.url.indexOf(routes.getEvent) != -1)) {
		var id = req.url.split('?id=')[1];
		sendEvent(res, id);
	}
	else if ((req.method == 'OPTIONS') && (req.url == routes.postEvent)) {
		// Preflight check from browser
		preflightResponse(res);
	}
	else if ((req.method == 'POST') && (req.url == routes.postEvent)) {
		saveEvent(req, res);
	}
	else {
		send404Response(res);
	}

	res.end();

}).listen(1338);
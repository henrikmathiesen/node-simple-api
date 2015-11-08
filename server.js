var http = require('http');
var events = require('./events.js');

var routes = {
	getEvents: '/getevents',
	getEvent: '/getevent?id=',
	postEvent: '/postevent'
};

var setCorsHeaders = function (res, save) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1337');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (save) {
		res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
	}
};

var send404Response = function (res) {
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.write('404: Not found');
	res.end();
};


// SEND EVENT/S
// =============================================================================================
var sendEvents = function (res) {
	setCorsHeaders(res);
	res.writeHead(200, { 'Content-Type': 'application/json' });
	
	//DEBUG
	//setTimeout(function(){}, 2000);
	res.write(JSON.stringify(events));
	res.end();
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
	
	// DEBUG
	// setTimeout(function(){}, 2000);
	res.write(JSON.stringify(eventToSend));
	res.end();
	
};
// =============================================================================================


// SAVE EVENT
// =============================================================================================
var preflightResponse = function (res) {
	setCorsHeaders(res, true);
	res.writeHead(200);
	res.end();
};

var saveEvent = function (req, res) {
	setCorsHeaders(res, true);

	var event = '';

	req.on('data', function (payload) {
		event += payload;
	});
	req.on('end', function () {
		event = JSON.parse(event);
		event.id = events.length;
		events.push(event);
		
		res.writeHead(200);
		res.end();
	});
};
// =============================================================================================


http.createServer(function (req, res) {

	if ((req.method == 'GET') && (req.url == routes.getEvents)) {
		sendEvents(res);
	}
	else if ((req.method == 'GET') && (req.url.indexOf(routes.getEvent) != -1)) {
		var id = req.url.split('?id=')[1];
		sendEvent(res, id);
	}
	else if ((req.method == 'OPTIONS') && (req.url == routes.postEvent)) {
		preflightResponse(res);
	}
	else if ((req.method == 'POST') && (req.url == routes.postEvent)) {
		saveEvent(req, res);
	}
	else {
		send404Response(res);
	}
}).listen(1338);
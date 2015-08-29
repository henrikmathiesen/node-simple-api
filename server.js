var http = require('http');

var events = require('./events.js');

var routes = {
	getEvents: "/getevents",
	getEvent: "/getevent?id="
};

var send404Response = function (res) {
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.write('404: Not found');
};

var setCorsHeaders = function (res){
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:1337");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

var sendEvents = function (res) {
	setCorsHeaders(res);
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(events));
};

var sendEvent = function(res, id){
	setCorsHeaders(res);
	
	id = parseInt(id);
	var eventToSend = events[id];
	
	if(!eventToSend) {
		send404Response(res);
		return;
	}
	
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(eventToSend));
};

http.createServer(function (req, res) {
	
	if((req.method == 'GET') && (req.url == routes.getEvents)) {
		sendEvents(res);
	}
	else if((req.method == 'GET') && (req.url.indexOf(routes.getEvent) != -1 )) {
		var id = req.url.split('?id=')[1];
		sendEvent(res, id);
	}
	else {
		send404Response(res);
	}
	
	res.end();
	
}).listen(1338);
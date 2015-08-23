var http = require('http');

http.createServer(function(req, res){
	
	res.writeHead(200, {'Context-Type': 'text/plain'});
	res.write('Hi there!');
	res.end();
	
}).listen(1338);
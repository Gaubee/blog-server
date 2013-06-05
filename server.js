var http = require("http");
var url = require("url");

var router = require("./router").router;

http.createServer(function (request, response) {
	console.log(url.parse(request.url))
	var urlArgument = url.parse(request.url);
	router(urlArgument.pathname)(urlArgument.query);

}).listen(2013, '127.0.0.1');

console.log('Server running at http://127.0.0.1:2013/');
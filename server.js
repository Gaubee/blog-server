var http = require("http");
var url = require("url");
var get = require("./res/lib/get").Get;
var router = require("./router").router;
function start(){
	var server = http.createServer(function (request, response) {
		console.log(url.parse(request.url))
		var urlArgument = url.parse(request.url);

		router(urlArgument.pathname)(urlArgument.query,request,response);

	});
	server.listen(2013, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:2013/');
	return true;
}


start();

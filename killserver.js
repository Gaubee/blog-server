
var get = require("./res/lib/get").Get;
get({
	url:"http://127.0.0.1:2013/kill",
	endFun:function(data){
		console.log(data);
	}
})
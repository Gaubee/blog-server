
function router (path) {
	
}
function routerPathname(pathname){
	try{
		return require("./router"+pathname)[pathname.substr(1)];
	}catch(e){
		return require("./router/error_404").err;
	}
}
exports.router = routerPathname;
var querystring = require("querystring");
var fs = require("fs");

var blogInfo = require("../res/blog/blog.json");

function extend() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
var config;
function mode_essay(request,response){
	var id = config.id;
	var Length = blogInfo.length;
	var i;
	var essay;
	var blogData;
	for(i=0;i<Length;i+=1){
		essay = blogInfo[i];
		if (essay.id===id) {
			break;
		}
	}
	response.writeHead(200, {"Content-Type": "application/x-javascript"});

	try{
		blogData = require("../res/blog/"+essay.filePath+"/"+essay.title);
		response.write(config.callback+"("+JSON.stringify(blogData)+")");
	}catch(err){
		console.log(err.message);
		response.write(err.message);
	}

	response.end();
}
function mode_list(require,response){
	var list = [];
	var i;
	var Length = Math.min(config.length,blogInfo.length);
	for(i=0;i<Length;i+=1){
		list[i] = blogInfo[i];
	}

	response.writeHead(200, {"Content-Type": "application/x-javascript"});
	try{
		response.write(config.callback+"("+JSON.stringify(list)+")");
	}catch(err){
		console.log(err.message);
		response.write(err.message);
	}
	response.end();
}

function correspondingResponse(request,response){
	if (config.mode === "essay") {};
	switch(config.mode){
		case "essay":
			mode_essay(request,response);
			break;
		case "list":
			mode_list(request,response);
			break;
		default:
			mode_list(request,response);
			break;
	}
}
function blog (query,request,response) {
	config = {
		id:0,
		mode:"list",
		length:20,
		callback:"parselist"
	};
	console.log("query is:");
	extend.call(config,querystring.parse(query));
	console.log(config);
	// console.log(blogInfo);
	correspondingResponse(request,response);
}
exports.blog = blog;
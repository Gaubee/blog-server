var fs = require("fs");
var moment = require("moment");
var get = require("./get").Get;
var baseUrl = "https://api.github.com/repos/gaubee/blog/issues";
var basePath = "../blog/";
var data = {
	state:"open",
	creator:"gaubee"
};
function getTime(body){
	try{
		var filePath = body.trim().split("**");
		filePath = filePath[filePath.length-2].trim().split(" ")[0];
		filePath = moment(filePath)
		if (filePath.isValid()) {
			return filePath.format("YYYY-MM-DD");
		}else{
			return false;	
		}
	}catch(e){
		return false;
	}
}
function endFunBase (data) {
	var dataObj = eval(data);
	var filesJSON = [];
	var id,
		title,
		baseUrl,
		comments_url,
		labels,
		body,
		created_at,
		updated_at,
		i,
		Length = dataObj.length,
		issues
		;
	for(i = 0;i<Length;i+=1){
		issues = dataObj[i];
		id = issues.id;
		title = issues.title;
		baseUrl = issues.html_url;
		comments_url = issues.comments_url;
		labels = issues.labels;
		body = issues.body;
		created_at = getTime(body)||issues.created_at.split("T")[0];
		updated_at = issues.updated_at.split("T")[0];

		issues = {
			id:id,
			title:title,
			baseUrl:baseUrl,
			comments_url:comments_url,
			labels:labels,
			content:body,
			filePath:created_at,
			lastUpdatedTime:updated_at
		}

		writeFile(fs,basePath+created_at+"/",title+".json",JSON.stringify(issues),function(fs,filePath,fileName,data){
			console.log("in "+filePath+", the <"+fileName+"> write ok");
		});

		filesJSON[i] = {
			id:id,
			title:title,
			baseUrl:baseUrl,
			comments_url:comments_url,
			labels:labels,
			filePath:created_at,
			lastUpdatedTime:updated_at
		}
	}
	writeFile(fs,basePath,"blog.json",JSON.stringify(filesJSON),function(fs,filePath,fileName,data){
		console.log("blog json is ok");
	});
}


function mkdirSync(fs,url,mode,cb){
	var path = require("path"), arr = url.split("/");
	mode = mode || 0755;
	cb = cb || function(){};
	if(arr[0]==="."){//处理 ./aaa
		arr.shift();
	}
	if(arr[0] == ".."){//处理 ../ddd/d
		arr.splice(0,2,arr[0]+"/"+arr[1])
	}
	function inner(cur){
		if(!fs.existsSync(cur)){//不存在就创建一个
			fs.mkdirSync(cur, mode)
		}
		if(arr.length){
			inner(cur + "/"+arr.shift());
		}else{
			cb();
		}
	}
	arr.length && inner(arr.shift());
}
function writeFile(fs,filePath,fileName,data,callback){
	mkdirSync(fs,filePath,0,function(e){
		if (e) {return};
		fs.open(filePath+fileName,"w",0644,function(err,fd){//open or create
			if(err) throw err;
			if ((typeof data).toString()==="object") {
				data = JSON.stringify(data);
			}else{
				data = data.toString();
			}
			fs.write(fd,data,0,"utf8",function(err){
				if(err){
					console.log(err);
				}else{
					callback&&callback(fs,filePath,fileName,data);
				}
				fs.closeSync(fd);
			})
		})
	})
};

get({
	url:baseUrl,
	data:data,
	endFun:endFunBase
});
var http = require('http'), app = exports = module.exports = {}, webstack = [], url = require('url'), parsedUrl, path, qString, method, reqHandler, foundHandler;
var str='',parser=require('./parser');
app.start = function(port, callback) {
	if (callback) {
		if ( typeof callback !== 'function') {
			throw Error('function Expected but find Something Else')
		}
	}
	http.createServer(function(req, res) {
		app.req = req;
		app.res = res;
		str='';
		req.on('data',function(chunck){
			str+=chunck;
			app.handle(req, res,str);
		});		
	}).listen(port, callback());
};

app.get = function(path, callback) {
	webstack.push({
		'path' : path,
		'callback' : callback,
		'method' : 'GET'
	});
};

app.put = function(path, callback) {
	webstack.push({
		'path' : path,
		'callback' : callback,
		'method' : 'PUT'
	});
};

app.post = function(path, callback) {
	webstack.push({
		'path' : path,
		'callback' : callback,
		'method' : 'POST'
	});
};

app.delete = function(path, callback) {
	webstack.push({
		'path' : path,
		'callback' : callback,
		'method' : 'DELETE'
	});
};

app.handle = function(req, res,data) {
	parsedUrl = url.parse(req.url, true);
	path = parsedUrl.pathname;
	qString = parsedUrl.query;
	method = req.method;
	reqHandler = {};
	foundHandler = false;
	for (var i = 0; i < webstack.length; i++) {
		if (webstack[i].path === path && webstack[i].method === method) {
			reqHandler.handle = webstack[i].callback;
			foundHandler = true;
			break;
		}
	}
	req['body']=parser.parse(data,req.headers['content-type']);
	if (foundHandler) {
		reqHandler.handle(req, res);
	} else {
		res.end("Can't " + method + ' path');
	}
};

var http = require('http');
var app = exports = module.exports = {};
var webstack = [];
var url = require('url');
var parser = require('./parser');
var querystring = require('querystring');

app.start = function(port, callback) {
	if (callback) {
		if ( typeof callback !== 'function') {
			throw Error('function Expected but find Something Else')
		}
	} else {
		callback = function() {

		};
	}
	http.createServer(function(req, res) {
		app.req = req;
		app.res = res;
		str = '';
		req.on('data', function(chunck) {
			str += chunck;
			if (str.length > 1e6) {
				response.writeHead(413, {
					'Content-Type' : 'text/plain'
				}).end();
				req.connection.destroy();
			}
		});
		req.on('end', function() {
			app.handle(req, res, str);
		})
	}).listen(port, callback());
};

app.get = function(path, callback) {
	webstack.push({
		'path' : pathparse(path).path,
		'actualpath' : path,
		'callback' : callback,
		'method' : 'GET'
	});
};

app.put = function(path, callback) {
	webstack.push({
		'path' : pathparse(path).path,
		'actualpath' : path,
		'callback' : callback,
		'method' : 'PUT'
	});
};

app.post = function(path, callback) {
	webstack.push({
		'path' : pathparse(path).path,
		'actualpath' : path,
		'callback' : callback,
		'method' : 'POST'
	});
};

app.delete = function(path, callback) {
	webstack.push({
		'path' : pathparse(path).pathname,
		'actualpath' : path,
		'callback' : callback,
		'method' : 'DELETE'
	});
};

app.handle = function(req, res, data) {

	var path = pathparse(req.url).path;
	var qString = pathparse(req.url).query;
	var method = req.method;
	var reqHandler = {};
	var foundHandler = false;
	var swPath = '';
	var sPath = '';

	for (var i = 0; i < webstack.length; i++) {
		if (webstack[i].path === path && webstack[i].method === method) {

			reqHandler.handle = webstack[i].callback;
			foundHandler = true;
			break;

		} else if (webstack[i].method === method) {

			swPath = webstack[i].path;
			swPath = swPath.slice(0, swPath.lastIndexOf('/'));
			sPath = path.slice(0, path.lastIndexOf('/'));
			if (swPath === sPath) {
				swPath = webstack[i].path;
				req.params = {};
				req.params[swPath.slice(swPath.lastIndexOf('/') + 2, swPath.length)] = path.slice(path.lastIndexOf('/') + 1, path.length);
				reqHandler.handle = webstack[i].callback;
				foundHandler = true;
				break;

			}
		}
	}

	req['body'] = parser.parse(data, req.headers['content-type']);

	if (qString) {
		req['query'] = qString;
	}
	if (foundHandler) {
		reqHandler.handle(req, res);
	} else {
		res.end("Can't " + method + ' path');
	}
};

function pathparse(path) {
	var obj = {};
	obj.path = url.parse(path, true).pathname;
	if (obj.path.lastIndexOf('/') === obj.path.length - 1) {
		obj.path = obj.path.slice(0, obj.path.length - 1);
	}
	obj.query = url.parse(path, true).query;
	return obj;
}

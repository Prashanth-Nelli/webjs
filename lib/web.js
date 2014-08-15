var server = require('http');
var app = exports = module.exports = {};
var webstack = [];
var url = require('url');
var parser = require('./parser');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');

app.start = function() {
	var str = '';
	return server.createServer(function(req, res) {
		str = '';
		req.on('data', listener);
		function listener(chunk) {
			str += chunk;
			req.removeListener('data', listener);
			var buff = new Buffer(str, 'utf8');
			req.unshift(buff);
		}
		req.on('end', function() {
			app.handle(req, res, str);
		});
	});
};

app.static = function(dir) {
	app.staticset = true;
	app.dir = dir;
	fs.stat(dir, function(err, stat) {
		if (!stat.isDirectory()) {
			throw Error('Expected directory path but received something else')
		}
	});
};

app.get = function(path, callback) {
	webstack.push({
		'path' : parser.parsepath(path).path,
		'callback' : callback,
		'method' : 'GET'
	});
};

app.put = function(path, callback) {
	webstack.push({
		'path' : parser.parsepath(path).path,
		'callback' : callback,
		'method' : 'PUT'
	});
};

app.post = function(path, callback) {
	webstack.push({
		'path' : parser.parsepath(path).path,
		'callback' : callback,
		'method' : 'POST'
	});
};

app.delete = function(path, callback) {
	webstack.push({
		'path' : parser.parsepath(path).pathname,
		'callback' : callback,
		'method' : 'DELETE'
	});
};

app.handle = function(req, res, data) {
	var pathurl = parser.parsepath(req.url).path;
	var qString = parser.parsepath(req.url).query;
	var method = req.method;
	var reqHandler = {};
	var foundHandler = false;
	var filename = path.join(app.dir || __dirname, req.url);
	var fileStream;
	var jobdone = true;
	try {
		if (app.staticset && fs.existsSync(filename)) {
			fileStream = fs.createReadStream(filename);
			fileStream.pipe(res);
			jobdone = false;
		}
	} catch(Ex) {
		jobdone = true;
	}
	if (jobdone) {
		for (var i = 0; i < webstack.length; i++) {
			if (webstack[i].path === pathurl && webstack[i].method === method) {
				reqHandler.handle = webstack[i].callback;
				foundHandler = true;
				break;
			} else if (webstack[i].method === method) {
				if (parser.parseParams(req, webstack[i].path, pathurl)) {
					reqHandler.handle = webstack[i].callback;
					foundHandler = true;
				}
			}
		}
		if (!req['body']) {
			req['body'] = parser.parse(data, req.headers['content-type']);
		}
		if (qString && !req['query']) {
			req['query'] = qString;
		}
		if (foundHandler) {
			reqHandler.handle(req, res);
		} else {
			res.writeHead(404, {
				'content-type' : 'text/html'
			});
			res.end('<html><head></head><body>Not found on the server</body></html>');
		}
	}
};
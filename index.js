var server = require('http');
var app = exports = module.exports = {};
var webstack = [];
var url = require('url');
var parser = require('./parser');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');

app.start = function() {

	return server.createServer(function(req, res) {
		str = '';
		app.req = req;
		app.res = res;

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
	});

};

app.static = function(dir) {
	app.dir = dir;
	fs.stat(dir, function(err, stat) {
		if (!stat.isDirectory()) {
			throw Error('Expected directory path but received something else')
		}
	});
}

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
	var pathurl = pathparse(req.url).path;
	var qString = pathparse(req.url).query;
	var method = req.method;
	var reqHandler = {};
	var foundHandler = false;
	var swPath = '';
	var sPath = '';
	var isStatic = false;
	var filename = path.join(app.dir, req.url);
	var fileStream;

	if (fs.existsSync(filename)) {
		fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	} else {

		for (var i = 0; i < webstack.length; i++) {
			if (webstack[i].path === pathurl && webstack[i].method === method) {

				reqHandler.handle = webstack[i].callback;
				foundHandler = true;
				break;

			} else if (webstack[i].method === method) {

				swPath = webstack[i].path;
				swPath = swPath.slice(0, swPath.lastIndexOf('/'));
				sPath = pathurl.slice(0, pathurl.lastIndexOf('/'));
				if (swPath === sPath) {
					swPath = webstack[i].path;
					req.params = {};
					req.params[swPath.slice(swPath.lastIndexOf('/') + 2, swPath.length)] = pathurl.slice(pathurl.lastIndexOf('/') + 1, pathurl.length);
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
			res.writeHead(404, {
				'content-type' : 'text/html'
			});
			res.end('<html><head></head><body>Not found on the server</body></html>');
		}
	}

};

function pathparse(pathurl) {
	var obj = {};
	obj.path = url.parse(pathurl, true).pathname;
	if (obj.path.lastIndexOf('/') === obj.path.length - 1) {
		obj.path = obj.path.slice(0, obj.path.length - 1);
	}
	obj.query = url.parse(pathurl, true).query;
	return obj;
}


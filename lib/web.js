var server = require('http');
var url = require('url');
var parser = require('./parser');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var methods = require('./methods');
var handler = require('./handler').handle;
var webstack = require('./handler').webstack;
var router = require('./route');

var app = exports = module.exports = {};

app.start = function() {
	var str = '';
	return server.createServer(function(req, res) {
		handler(req, res);
	});
};

app.static = function(dir) {
	app.staticset = true;
	app.dir = dir;
	fs.stat(dir, function(err, stat) {
		if (!stat.isDirectory() || err) {
			throw Error('Expected directory path but received something else')
		}
		webstack['static'].push(dir);
	});
};

methods.forEach(function(obj) {
	app[obj.key] = function(path, callback) {
		webstack['api'].push({
			'path' : parser.parsepath(path).path,
			'callback' : callback,
			'method' : obj.type
		});
	};
});

app.use = function(middleware) {
	if ('function' !== typeof middleware) {
		throw Error('Expected a function but find something else in use() function');
	}
	webstack['middleware'].push(middleware);
};

app.route = router.route; 
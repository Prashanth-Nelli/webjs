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
var response = require('./response');


var app = exports = module.exports = {};

app.start = function() {
	var str = '';
	return server.createServer(function(req, res) {
		
		for(var key in response){
			res[key]=response[key].bind(res);	
		}
				
		handler(req, res,app.settings)();
	});
};

app.static = function(dir) {
	app.staticset = true;
	app.dir = dir;
	if (fs.statSync(dir).isDirectory()) {
		webstack.push({
			'type' : 'static',
			'dir' : dir
		});
	} else {
		throw Error('Expected directory path but received something else in static() function');
	}
};

methods.forEach(function(obj) {
	app[obj.key] = function(path, callback) {
		webstack.push({
			'type' : 'api',
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
	webstack.push({
		'type' : 'middleware',
		'callback' : middleware
	});
};

app.route = router.route;

app.settings = {
	'providebody' : true,
	'limit':1024*100
};


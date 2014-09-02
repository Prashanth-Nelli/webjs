var fs = require('fs');
var path = require('path');
var parser = require('./parser');

var webstack = {
	'middleware' : [],
	'static' : [],
	'api' : [],
};

exports = module.exports = handler = {};

handler.webstack = webstack;

handler.handle = function(req, res) {
	var pathurl = parser.parsepath(req.url).path;
	var qString = parser.parsepath(req.url).query;
	var method = req.method;
	var fileStream;
	var done = false;

	var layers = [{
		key : 'middleware',
		length : webstack['middleware'].length
	}, {
		key : 'static',
		length : webstack['static'].length
	}, {
		key : 'api',
		length : webstack['api'].length
	}]; out:
	for (var i = 0; i < layers.length; i++) {
		for (var j = 0; j < layers[i].length; j++) {
			switch(layers[i].key) {
			case 'middleware':
				for (var k = 0; k < webstack['middleware'].length; k++) {
					done = webstack['middleware'][k](req, res);
					if (done == true) {
						break out;
					}
				}
				break;
			case 'static':
				for (var k = 0; k < webstack['static'].length; k++) {
					var filename = path.join(webstack['static'][k], req.url);
					if (fs.existsSync(filename)) {
						done = true;
						fileStream = fs.createReadStream(filename);
						fileStream.pipe(res);
						break out;
					}
				}
				break;
			case 'api':
				for (var k = 0; k < webstack['api'].length; k++) {
					if (webstack['api'][k].path === pathurl && webstack['api'][k].method === method) {
						done = true;
						webstack['api'][k].callback(req, res);
						break out;
					} else if (webstack['api'][k].method === method) {
						if (parser.parseParams(req, webstack['api'][k].path, pathurl)) {
							done = true;
							webstack['api'][k].callback(req, res);
							break out;
						}
					}
				}
			}
		}
	}
	if (!done) {
		res.writeHead(404, {
			'content-type' : 'text/html'
		});
		res.end('<html><head></head><body>Not found on the server</body></html>');
	}
};

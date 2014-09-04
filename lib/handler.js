var fs = require('fs');
var path = require('path');
var parser = require('./parser');

var webstack = [];

exports = module.exports = handler = {};

handler.webstack = webstack;

handler.handle = function(req, res) {
	var layercount = -1;
	var pathurl = parser.parsepath(req.url).path;
	var method = req.method;
	var fileStream;
	var done = false;
	req.query = parser.parsepath(req.url).query;

	return function cb(err) {++layercount;
		if (err) {
			throw new err;
		}
		if (layercount < webstack.length) {
			switch(webstack[layercount].type) {
			case 'middleware':
				webstack[layercount].callback(req, res, cb);
				break;
			case 'static':
				var filename = path.join(webstack[layercount].dir, req.url);
				if (fs.existsSync(filename)) {
					fileStream = fs.createReadStream(filename);
					fileStream.pipe(res);
					fileStream.on('error', cb);
				} else {
					cb();
				}
				break;
			case 'api':
				if (webstack[layercount].path === pathurl && webstack[layercount].method === method) {
					webstack[layercount].callback(req, res);
				} else if (webstack[layercount].method === method) {
					if (parser.parseParams(req, webstack[layercount].path, pathurl)) {
						webstack[layercount].callback(req, res);
					} else {
						cb();
					}
				} else {
					cb();
				}
				break;
			case 'default':
				cb()
			}
		} else {
			res.end("can't get the route " + req.url);
		}
	}
};

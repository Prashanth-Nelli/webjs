var fs = require('fs');
var path = require('path');
var parser = require('./parser');
var mime = require('./mime');
var webstack = [];

exports = module.exports = handler = {};

handler.webstack = webstack;

handler.handle = function(req, res, settings) {
	var layercount = -1;
	var pathurl = parser.parsepath(req.url).path;
	var method = req.method;
	var fileStream;
	var body = '';
	req.query = parser.parsepath(req.url).query;
	var getbody = settings.providebody;
	var limit = settings.limit;

	if (getbody && limit > req.headers['content-length']) {
		req.setEncoding = 'utf8';
		req.on('data', function(chunk) {
			body += chunk;
		})
		req.on('end', function() {
			req.body = parser.parse(body, req.headers['content-type']);
			body = null;
		});
	}

	return function cb(err) {++layercount;
		if (err) {
			throw err
		}
		if (layercount < webstack.length) {
			switch(webstack[layercount].type) {
			case 'middleware':
				webstack[layercount].callback(req, res, cb);
				break;
			case 'static':
				var filename = path.join(webstack[layercount].dir, req.url);
				fs.exists(filename, function(exists) {
					if (exists) {
						if (fs.statSync(filename).isFile()) {
							if (method == 'GET') {
								res.setHeader("Content-Type", mime.lookup(filename));
								fileStream = fs.createReadStream(filename);
								fileStream.pipe(res);
								fileStream.on('error', cb);
							} else if (method == 'HEAD') {
								res.writeHead(200, {
									'Content-Type' : mime.lookup(filename)
								});
								res.end();
							} else {
								cb();
							}
						} else {
							cb();
						}
					} else {
						cb();
					}
				});
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
			res.writeHead(404, {
				'Content-Type' : mime.lookup(filename)
			});
			res.end();
		}
	}
};

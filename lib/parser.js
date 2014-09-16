var parser = exports = module.exports = {};
var querystring = require('querystring');
var url = require('url');
var data;

parser.parse = function(data, encoding) {
	switch(encoding) {
	case 'application/json':
		try {
			data = JSON.parse(data);
		} catch(ex) {
			data = {};
		}
		return data;
		break;
	case 'application/x-www-form-urlencoded':
		try {
			data = querystring.parse(data);
		} catch(ex) {
			data = {};
		}
		return data;
		break;
	default:
		return null;
	}
};

parser.parsepath = function(pathurl) {
	var obj = {};
	obj.path = url.parse(pathurl, true).pathname;
	if (obj.path.lastIndexOf('/') === obj.path.length - 1) {
		obj.path = obj.path.slice(0, obj.path.length - 1);
	}
	obj.query = url.parse(pathurl, true).query;
	return obj;
};

parser.parseParams = function(req, swPath, sPath) {
	swPath = swPath.slice(1);
	sPath = sPath.slice(1);
	swPath = swPath.split('/');
	sPath = sPath.split('/');
	if (swPath.length === sPath.length) {
		var parIndexes = [];
		var matched = true;
		for (var j = 0; j < swPath.length; j++) {
			if (swPath[j].indexOf(':') === -1) {
				if (swPath[j] !== sPath[j]) {
					matched = false;
				}
			} else {
				parIndexes.push(j);
			}
		}
		if (matched) {
			req.params = {};
			for ( j = 0; j < parIndexes.length; j++) {
				req.params[swPath[parIndexes[j]].slice(1)] = sPath[parIndexes[j]];
			}
			return true;
		}
	}
	return false;
};

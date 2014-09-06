var methods = require('./methods');
var webstack = require('./handler').webstack;
var parser = require('./parser');

exports = module.exports = router = {};

methods.forEach(function(obj) {
	router[obj.key] = function(callback) {
		if ('function' !== typeof callback) {
			throw new Error('Expected function find some thing else in route');
		}
		webstack.push({
			'type' : 'api',
			'path' : this._path,
			'callback' : callback,
			'method' : obj.type
		});
		return router;
	}
});

router.route = function(path) {
	if (('string' == typeof path)) {
		router._path = parser.parsepath(path).path;
		return router;
	} else {
		throw new Error('Expected string find some thing else in route');
	}
}


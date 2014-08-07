var parser = exports = module.exports={};
var querystring=require('querystring');

parser.parse=function(data,encoding){
	switch(encoding){
		case 'application/json':
			return JSON.parse(data);
		break;
		case 'application/x-www-form-urlencoded':
			return querystring.parse(data);
		break;
		default:
			return data;
	}	
};


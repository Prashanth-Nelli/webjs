var parser = exports = module.exports={}
	,resObj={}
	,length=0
	,keyValue='';
parser.parse=function(data,encoding){
	switch(encoding){
		case 'application/json':
			return JSON.parse(data);
		break;
		case 'application/x-www-form-urlencoded':
		length=data.split('&').length;
		data=data.split('&');
		for(var i=0;i<length;i++){
			keyValue=data[i].split('=');
			resObj[keyValue[0]]=keyValue[1];
		}
		return resObj;
		break;
		defalut:
	}	
};


var res = {};

exports=module.exports=res;

res.send=function(data){
	
	if(typeof data == 'string'){
		this.writeHead(200,{'Content-Type':'text/html'});
		this.end(data);
	}else if(typeof data =='object' && !Buffer.isBuffer(data)){
		try{
			data = JSON.stringify(data);	
		}catch(ex){
			data={};
			console.log('responds data is not a proper object');		
		}
		this.writeHead(200,{'Content-Type':'application/json'});
		this.end(data);		
	}else if(typeof data =='object' && Buffer.isBuffer(data)){
		this.writeHead(200,{'Content-Type':'application/octet-stream'});
		this.end(data);
	}else{
		this.writeHead(200,{'Content-Type':'text/html'});
		this.end(data.toString());
	}		
};



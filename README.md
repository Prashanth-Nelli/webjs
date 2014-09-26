server-js
=========

light weight web framework for node.js

[![NPM Version](https://img.shields.io/npm/v/server-js.svg?style=flat)](https://www.npmjs.org/package/server-js)
[![Build Status](https://travis-ci.org/Prashanth-Nelli/webjs.svg?branch=master)](https://travis-ci.org/Prashanth-Nelli/webjs)

###Documentation

installing server-js using npm

```bash

$ npm install server-js

```
### server-js api
```javascript

var server = require('server-js');

```

####server.use()

you can insert middleware using server.use() method

example:-

```javascript
      
  server.use(morgan());
  server.use(bodyparser());

```
####server.static();

you can serve static contents using with 'static' method input to the static method should be a directory.
you can server static content form different directories by passing different directories to server.static().

example:-

```javascript

  server.static(__dirname);
  server.static(__dirname+'/test');

```

####server.settings

it is an object it has two propeties their default values are given below

```javscript

  server.settings={
    providebody:true,
    limit:100*1024
  }

```
if providebody set to false 'server-js' will not parse the body.
you can use any other middleware to achieve that,
if providebody set to true you can set limit of request body length using settings object limit property.
it defaults to 100kb.

example:-

```javscript
      
  server.settings={
    providebody:true,
    limit:10*1024
  }
      
```

####server.verb();

supported verbs:- get,put,delete,post,trace,connect

example:-

```javascript

  server.get('/path1',function(req,res){
        res.end('get path1')
  });

```

####server.route('path');

if you want to use different methods on single path you can do that with server.route

example: - 

```javascript

  server.route('path2').get(function(req,res){
             //request handling code       
  }).put(function(req,res){  
      //request handling code
  }).post(function(req,res){
      //request handling code
  }).delete(function(req,res){
      //request handling code
  });

```

####server.start() 

returns a httpserver instance

you can you this instance when ever required with other modules like socket.io

example:-

```javascript
          
  var app = require('server-js').start();
  var io = require('socket.io')(app);
  app.listen(3000,funciton(){
      console.log('Server started and listening on 3000 port');
  });

```

#### server.start().listen()
  
  this is equivalent to http module [listen](nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback)

```javascript

 var app = require('server-js');
  app.start().listen(3000,funciton(){
        console.log('Server started and listening on 3000 port');
  });
    
```
#### request api

##### req.params

This property is an object containing properties mapped to the named route "parameters".
For example, if you have the route /user/:name, then the "name" property is available to you as req.params.name.
This object defaults to {}. 

u can define path's with parameters like the following

```javascript
    
    example:-
    
    //single parameter
    
  server.get('/path/:id',function(req,res){
      res.end(req.params.id);
  });
  
  //multiple parameters
  
  server.get('/path/:id/:value',function(req,res){
      console.log(req.params.id+''+req.params.value);
      res.end('request parameters');
  });
    
    
```

#### response api

##### res.send()

you can send strings,objects and buffers using res.send method 

it automatically sets the response content-type header based on the data passed to the method

u can use res.send method in following ways

Examples:-

```javascript

	server.get('route',function(req,res){
		res.send({data:'response'}); //sending an object
		//automaticallys sets the header application/json
	});
	
	server.get('route',function(req,res){
		res.send('data'); //sending an object
		//automatically sets the header text/html
	});
	
	server.get('route',function(req,res){
		res.send(new Buffer(3)); //sending an object
		//automatically sets the header application/octet-stream
	});
	
```



####Sample server written using server-js

```javascript

var server = require('server-js');


/*   server.use();   
  *   
*   here you can write the middleware code like checking whether the user has login etc.
*   here you can use all the middlewares supported by the express webframework
*   like for example :- 
*      
*     server.use(morgan());//it is a logging middleware
*
*   u should always write your middleware at the top request will traverse in the order
*   you written your server so your middleware should be at the top.
*   you can use more than one middleware like the following.
*
*     server.use(morgan());
*     server.use(bodyparser());
*     
*      server.use(function(req,res,next)){
*       if you are using a function as a middleware you should call next() at
*        the end of the function otherwise the request will not reach other layers
*        in your server.
*      }
*
*    example:- 
*              
*               server.use(function(req,res,next){
*                    // --middleware code--
*                     next();               
*               });
*
*    
*    if you are handled the request in middleware based on condition like this you should not call
*    next() after u handled the request,if you do an exception will be thrown.
*                
*     server.use(function(req,res,next){
*                         
*         if(somecondition){
*             res.end('Error');
*             //you should not call next() here because you already handled request
*         }else{
*             next(); 
*         }                  
*                         
*    });
*
*/

server.use(function(req,res,next){
  
  //middleware code
  
	next();
});

server.static(__dirname);

server.static(__dirname+'/test');


server.get('/path', function(req, res) {
	res.end('path get');
})

server.get('/path/:id', function(req, res) {
	res.end('path get with param' + req.params.id);
});

server.route('/route').get(function(req, res) {
	res.end('received');
}).put(function(req, res) {
	res.end('received put');
}).delete(function(req, res) {
	res.end('received delete');
});

server.route('/route2').get(function(req, res) {
	res.end('received route2 get');
}).put(function(req, res) {
	res.end('route put');
});

server.start().listen(3000, function() {
	console.log('server started');
});



```



License
======
![MIT](LICENSE)

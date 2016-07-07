var config 		= require('./config.js')
var express		= require('express'),
	_ 			= require('lodash'),
	_lang		= require('lodash/lang'),
	_collecton	= require('lodash/collection');
	
var	DbClient 	= require(config.modules_dir+"/dbclient"),
	Auth 		= require(config.modules_dir+"/auth"),
	Chat 		= require(config.app_dir+'/chat');

var app = express();
app.use(express.static(config.public_dir));
var server  = app.listen(config.api_port, function(){
	var port  = server.address().port;
	console.log('Server running at port', port);
});
var io = require('socket.io')(server);

// lets start here
var dbclient 	= new DbClient(config.mongodb_url),
	auth_ctrl 	= undefined,
	chat 		= new Chat(config);

dbclient.connect(function(db, error){
	auth_ctrl = new Auth(db);
});

app.get('/', function(req, res){
	res.sendFile(config.views_dir + '/index.html');
});

app.get('/messaging', function(req, res){
	io.on('connection', function(socket){

		socket.on('join', function(chatname){
			var user_socket = io.sockets.connected[socket.id];
			if(user_socket){
				var user = chat.processJoin(user_socket, chatname);
				chat.notifyAllNewUser(socket, user);
			}
		});

		socket.on('send message', function(message){
			chat.processNewMessage(socket, message);
		});

		socket.on('disconnect', function(){
			var user = chat.processUserLogout(socket);
			if(user){
				chat.notifyAllUserLogout(socket, user);
			}
		});

		socket.on('get online users', function(){
			chat.processOnlineUsers(socket);
		});
	});

	res.sendFile(config.views_dir + '/index.html');
});

app.get('/api', function(req, res){
	res.send('Welcome');
});
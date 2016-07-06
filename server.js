var API_PORT 			= 8082;
var APP_DIR 			= __dirname + '/app';
var MODULES_DIR 		= APP_DIR + '/modules';
var VIEWS_DIR			= APP_DIR + '/views';
var PUBLIC_DIR			= __dirname + '/public';
var MONGODB_URL_DB		= "mongodb://localhost:27017/nekochat";

var express		= require('express'),
	DbClient 	= require(MODULES_DIR+"/dbclient"),
	Auth 		= require(MODULES_DIR+"/auth"),
	Users 		= require(MODULES_DIR+"/users"),
	_ 			= require('lodash'),
	_lang		= require('lodash/lang'),
	_collecton	= require('lodash/collection');

var app = express();
app.use(express.static(PUBLIC_DIR));
var server  = app.listen(API_PORT, function(){
	var port  = server.address().port;
	console.log('Server running at port', port);
});
var io = require('socket.io')(server);

// lets start here
var dbclient 	= new DbClient(MONGODB_URL_DB),
	users_ctrl 	= new Users(),
	auth_ctrl 	= undefined;

dbclient.connect(function(db, error){
	auth_ctrl = new Auth(db);
});

io.on('connection', function(socket){
	var whoseOnlineCron = setInterval(function(){
		var users = _lang.clone(users_ctrl.users);
		var online_users = [];
		_(users).forEach(function(user){
			if(user){
				online_users.push({username: user.username});
			}
		});

		var _socket = io.sockets.connected[socket.id];
		if(_socket){
			_socket.emit('send online users', online_users);
		}
	}, 2000);

	socket.on('join', function(chatname){
		var user = {
			socketId: socket.id,
			session: Math.ceil(Math.random(0, 1) * 100000) + '_' + (new Date()).getTime(),
			username: chatname,
			isAuth: true
		}
		users_ctrl.addUser(user);
		io.sockets.connected[socket.id].emit('send redirect messaging', user);
		socket.broadcast.emit('send new user', user);
	});

	socket.on('send message', function(msg){
		var user = users_ctrl.findBySocket(socket.id);
		if(user){
			user = user.user;
			var data = {
				user: {
					username: user.username
				}, 
				message: msg
			};
			socket.broadcast.emit('send new message', data);
		}
	});

	socket.on('disconnect', function(){
		var user = users_ctrl.findBySocket(socket.id);
		if(user){
			var user = _lang.clone(user);
			var response = { username: user.username };
			socket.broadcast.emit('send user disconnect', response);
			
			users_ctrl.removeUser(user);
		}
	});
});

app.get('/', function(req, res){
	res.sendFile(VIEWS_DIR + '/index.html');
});

app.get('/messaging', function(req, res){
});

app.get('/api', function(req, res){
	res.send('Welcome');
});
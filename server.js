var config 		= require('./config.js')
var express		= require('express'),
	bodyParser 	= require('body-parser'),
	_ 			= require('lodash'),
	_lang		= require('lodash/lang'),
	_collecton	= require('lodash/collection'),
	exhbs		= require('express-handlebars');
	
var	DbClient 	= require(config.modules_dir+"dbclient"),
	Auth 		= require(config.modules_dir+"auth"),
	Chat 		= require(config.app_dir+'chat');

var app = express();
app.set('views', config.views_dir);
app.engine('.html', 
	exhbs({
		defaultLayout: 'main',
		layoutsDir: config.app_dir + 'views/layouts/',
		partialsDir: config.app_dir + 'views/partials/',
		extname: '.html'
	})
);
app.set('view engine', '.html');
app.use(express.static(config.public_dir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var server  = app.listen(config.api_port, function(){
	var port  = server.address().port;
	console.log('Server running at port', port);
});

var io = require('socket.io')(server);


// lets start here
var	chat 		= new Chat(config);

io.use(function(socket, next){
	console.log('-----------------');
	chat.globalSocketLog();

	return next();
});

app.get('/', function(req, res){
	res.render('index', {title: 'Chat Application'});
});

app.get('/api', function(req, res){
	res.send('Welcome');
});

app.get('/messenger', function(req, res){
	res.redirect('/');
});

var username = undefined;

app.post('/messenger', function(req, res){
	username = req.body.username;
	res.render('messenger');
});

io.on('connection', function(socket){
	console.log('new connection');
	if(username){
		var user_socket = io.sockets.connected[socket.id];
		var user = chat.processJoin(user_socket, username);
		chat.notifyAllNewUser(socket, user);
	}
	username = undefined;

	socket.on('send message', function(message){
		console.log('receiving message');
		chat.processNewMessage(socket, message);
	});

	socket.on('disconnect', function(){
		console.log('disconnecting user');
		var user = chat.processUserLogout(socket);
		if(user){
			chat.notifyAllUserLogout(socket, user);
		}
	});

	socket.on('get online users', function(){
		console.log('getting online users');
		chat.processOnlineUsers(socket);
	});
});
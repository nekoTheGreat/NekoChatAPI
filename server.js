var API_PORT 			= 8082;
var APP_DIR 			= __dirname + '/app';
var MODULES_DIR 		= APP_DIR + '/modules';
var VIEWS_DIR			= APP_DIR + '/views';
var PUBLIC_DIR			= __dirname + '/public';
var MONGODB_URL_DB		= "mongodb://localhost:27017/nekochat";

var express		= require('express'),
	DbClient 	= require(MODULES_DIR+"/dbclient"),
	Auth 		= require(MODULES_DIR+"/auth"),
	Users 		= require(MODULES_DIR+"/users");

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

	socket.on('join', function(chatname){
		var user = {
			session: Math.ceil(Math.random(0, 1) * 100000) + '_' + (new Date()).getTime(),
			username: chatname 
		}
		users_ctrl.addUser(user);
		console.log(user);
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
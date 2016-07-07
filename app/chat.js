var _ 			= require('lodash'),
	_lang		= require('lodash/lang'),
	_collecton	= require('lodash/collection');

function Chat(config){
	// module loader
	var self 		= this,
		DbClient 	= require(config.modules_dir+"/dbclient"),
		Auth 		= require(config.modules_dir+"/auth"),
		Users 		= require(config.modules_dir+"/UserMgr/users");

	// module initialization
	self.config 	= config;
	self.dbclient 	= new DbClient(config.mongodb_url),
	self.users_mgr	= new Users(),
	self.auth_ctrl 	= undefined;
	self.dbclient.connect(function(db, error){
		auth_ctrl = new Auth(db);
	});

	self.processOnlineUsers = function(socket){
		var online_users = self.users_mgr.getOnlineUsers();
		socket.emit('send online users', online_users);
	}
	self.processJoin = function(socket, chatname){
		var userData = {
			username: chatname,
			session: socket.id
		}
		var user = self.users_mgr.addUser(userData);
		if(user){
			socket.emit('send redirect messaging', user.getInfo());
		}
		return user;
	}
	self.notifyAllNewUser = function(socket, user){
		if(user){
			socket.emit('send new user', user.getInfo());
		}
	}
	self.processNewMessage = function(socket, message){
		var user = self.users_mgr.findUser(socket.id);
		if(user){
			var data = {
				user: user.getInfo(), 
				message: message
			};
			socket.broadcast.emit('send new message', data);
		}
	}
	self.processUserLogout = function(socket){
		var user = self.users_mgr.findUser(socket.id);
		if(user){
			self.users_mgr.removeUser(user);
			return user;
		}
		return false;
	}
	self.notifyAllUserLogout = function(socket, user){
		var user = self.users_mgr.findUser(socket.id);
		if(user){
			socket.broadcast.emit('send user disconnect', user.getInfo());
		}
	}
}

module.exports = Chat;

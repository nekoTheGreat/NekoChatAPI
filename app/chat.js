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
		self.users_mgr.getOnlineUsers(function(online_users){
			socket.emit('send online users', online_users);
		});
	}
	self.processJoin = function(socket, chatname){
		var userData = {
			username: chatname,
			session: socket.id,
			isAuth: true
		}
		var user = self.users_mgr.addUser(userData);
		if(user){
			var info = user.getInfo();
			console.log('user: ' + info.username + ' is connected');
			socket.emit('send redirect messaging', user.getInfo());
		}
		return user;
	}
	self.notifyAllNewUser = function(socket, user){
		if(user){
			var info = user.getInfo();
			console.log('notifying to all connected user, new new user : ' + info.username);
			socket.broadcast.emit('send new user', user.getInfo());
		}
	}
	self.processNewMessage = function(socket, message){
		self.users_mgr.findUser(socket.id, function(user){
			if(user){
				var data = {
					user: user.getInfo(), 
					message: message
				};
				console.log('notifying all connected users, new message from ' + data.user.username);
				socket.broadcast.emit('send new message', data);
			}
		});
	}
	self.processUserLogout = function(socket){
		self.users_mgr.findUser(socket.id, function(user){
			if(user){
				var info = user.getInfo();
				console.log('user: ' + info.username + ' is disconnected');
				self.users_mgr.removeUser(info.username);
			}
		});
	}
	self.notifyAllUserLogout = function(socket, user){
		self.users_mgr.findUser(socket.id, function(user){
			if(user){
				console.log('notifying all connected users, user ' + info.username + ' is disconnected');
				socket.broadcast.emit('send user disconnect', user.getInfo());
			}
		});
	}

	self.globalSocketLog = function(){
		self.users_mgr.getOnlineUsers(function(online_users){
			console.log('------------------');
			console.log(online_users);
			console.log('------------------');
		});
	}
}

module.exports = Chat;

var User 		= require('./user');
var _ 			= require('lodash');
var _collection	= require('lodash/collection');
var _object		= require('lodash/object');
var _lang		= require('lodash/lang');

function Users(){
	var self = this;

	users = [];
}
Users.prototype.addUser = function(data){
	var self = this;

	var user = undefined;
	if(data instanceof User){
		user = _lang.clone(data);
	}else{
		data.isAuth = true;
		user = new User(data);
	}
	if(user && user.isAuthorized()){
		users.push(user);
		return user;
	}
	return false;
}
Users.prototype.removeUser = function(session){
	var self = this;

	if(session){
		_.remove(users, function(u){
			var _u = u.getAllInfo();
			return _u.session == session;
		});
	}
	return false;
}
Users.prototype.getOnlineUsers = function(callback){
	var online_users = [];
	console.log(users.length);
	users.forEach(function(user, i){
		online_users.push(user.getInfo());
		if(users.length-1 >= i){
			if(callback)
				callback(online_users);
		}
	});
}
Users.prototype.findUser = function(session, callback){
	var self = this;
	var found = null;
	users.forEach(function(user, i){
		var _u = user.getAllInfo();
		if(_u.session == session){
			callback(user);
			return true;
		}
		if(users.length-1 >= i){
			callback(undefined);
			return true;
		}
	});
}

module.exports = Users;
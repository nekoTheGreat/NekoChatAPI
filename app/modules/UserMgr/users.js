var User 		= require('./user');
var _ 			= require('lodash');
var _collection	= require('lodash/collection');
var _object		= require('lodash/object');

function Users(){
	var self = this;

	self.users = [];
}
Users.prototype.addUser = function(data){
	var self = this;

	var user = undefined;
	if(data instanceof User){
		user = _object.clone(data);
	}else{
		data.isAuth = true;
		user = new User(data);
	}
	if(user && user.isAuthorized()){
		self.users.push(user);
		return user;
	}
	return false;
}
Users.prototype.removeUser = function(user){
	var self = this;

	if(user){
		var result = _.remove(self.users, function(u){
			return u.session = user.session;
		});

		return result;
	}
	return false;
}
Users.prototype.getOnlineUsers = function(){
	var online_users = [];
	_collection.forEach(function(user){
		online_users.push(user.getInfo());
	});
	return online_users;
}
Users.prototype.findUser = function(session){
	var self = this;

	for(var i in self.users){
		var user = self.users[i];
		if(user){
			_user = user.getAllInfo();
			if(_user.session == session){
				return user;
			}
		}
	}

	return false;
}

module.exports = Users;
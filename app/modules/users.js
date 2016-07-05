var User = require('./user');

function Users(){
	var self = this;

	self.users = [];
}
Users.prototype.addUser = function(user){
	var self = this;

	if(user && user.isAuth){
		self.users.push(user);
		return true;
	}
	return false;
}
Users.prototype.removeUser = function(user){
	var self = this;

	var found = self.find(user);
	if(found){
		delete self.users[found.index];
		return true;
	}
	return false;
}
Users.prototype.findUser = function(user){
	var self = this;
	
	var f_indx = -1;
	var f_user = undefined;
	for(var i in self.users){
		var _user = self.users[i];
		if(_user._id == user._id){
			f_indx = i;
			f_user = _user;
		}
	}

	if(f_indx == -1) return undefined;
	return {index: f_indx, user: f_user};
}

module.exports = Users;
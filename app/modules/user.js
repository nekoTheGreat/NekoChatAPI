function User(username, password){
	var self = this;

	var username = username;
	var password = password;
	var session = '';
	var isAuth  = false;	

	self.setAuthenticated = function(isAuth){
		isAuth = isAuth;
	}
	self.isAuthenticated = function(){
		return isAuth;
	}

	self.getCredentials = function(){
		return {uname: username, pwd: password};
	}
}

module.exports = User;

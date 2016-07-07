var _ = require('lodash');
var _object = require('lodash/object');
var _lang = require('lodash/lang');

function User(obj){

	var user = {
		username: '',
		password: '',
		session: '',
		isAuth: false
	}

	_object.merge(user, obj);

	this.getAllInfo = function(){
		return user;
	}

	this.getInfo = function(){
		var info = _lang.clone(user);
		_object.unset(info, 'session');
		_object.unset(info, 'isAuth');
		_object.unset(info, 'password');

		return info;
	}

	this.isAuthorized = function(){
		return user.isAuth;
	}
}

module.exports = User;
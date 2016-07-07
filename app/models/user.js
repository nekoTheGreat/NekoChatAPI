var _ = require('lodash');
var _object = require('lodash/object');
var _lang = require('lodash/lang');

function User(obj){

	var user = {
		username: '',
		password: '',
		session: ''
	}

	_object.merge(user, obj);

	this.getUser = function(){
		return user;
	}

	this.getUserInfo = function(){
		var info = _lang.clone(user);
		_object.unset(info, session);

		return info;
	}

	this.delete = function(){
		this = undefined;
	}
}

module.exports = User;
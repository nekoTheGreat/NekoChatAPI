var crypto = require('crypto');

function Auth(db){
	var self = this;
	self.user_collection = db.collection('Users');
}
Auth.prototype.authenticate = function(credential, callback){
	var self = this;

	var search = {uname: credential.username, pwd: credential.password}
	self.user_collection.find(search).toArray(function(err, items){
		var found_user = undefined;
		if(items.length){
			found_user = items[0];
			found_user.session = Math.ceil(Math.random(0, 1) * 10000000000);
			found_user.isAuth = true;
		}
		callback(found_user);
	});
}

module.exports = Auth;

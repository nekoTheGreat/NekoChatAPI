var MongoClient = require('mongodb').MongoClient;

function DbClient(URL, credentials){
	var self = this;

	var db = undefined,
		credentials = credentials,
		errors = [];

	self.connect = function(callback){
		MongoClient.connect(URL, function(err, _db){
			if(err){
				errors.push(err);
			}else{
				db = _db;
			}
			if(callback){
				callback(db, err);
				self.close();
			}
		});
	}
	self.close = function(){
		if(db){
			db.close()
		}
	}
	self.getConnection = function(){
		return db;
	}
	self.getErrors = function(){
		return errors;
	}
}

module.exports = DbClient;


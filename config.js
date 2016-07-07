var fs			= require('fs');
var _ 			= require('lodash');
var _object		= require('lodash/object');

var config = {};
config.api_port 		= 8082;
config.app_dir 			= __dirname + '/app';
config.modules_dir 		= config.app_dir + '/modules';
config.models_dir 		= config.app_dir + '/models';
config.views_dir		= config.app_dir + '/views';
config.public_dir		= __dirname + '/public';
config.mongodb_url		= "mongodb://localhost:27017/nekochat";

// check if there's a custom config file to override the main config
var custom_config_path = './user.config.js';
if(fs.existsSync(custom_config_path)){
	var custom_config = require(custom_config_path);
	_object.merge(config, custom_config);
}

module.exports = config; 
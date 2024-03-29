var chat = {
	socket: undefined,
	user: undefined,
	window_focussed: true,
};
chat.init = function(){
	var self = this;

	self.socket = io();

	self.socket.on('send redirect messaging', function(user){
		self.user = user;
		self.switchPage('messaging');
	});
	self.socket.on('send redirect join', function(){
		self.switchPage('join');
	});
	self.socket.on('send new message', function(data){
		self.displayMessage(data.user, data.message);
	});
	self.socket.on('send new user', function(user){
		self.displayNewUser(user);
	});
	self.socket.on('send online users', function(users){
		self.displayOnlineUsers(users);
	});
	self.socket.on('send user disconnect', function(user){
		self.displayUserLogout(user);
	});

	$('#join_form').submit(function(e){
		//e.preventDefault();
		self.join();
	});
	$('#message_form').submit(function(e){
		e.preventDefault();
		self.sendMessage();
	});

	$(window).on('focus', function(){
		self.window_focussed = true;
	});
	$(window).on('blur', function(){
		self.window_focussed = false;
	});

	setInterval(function(){
		self.socket.emit('get online users');
	}, 1000);
}
chat.switchPage = function(page){
	$('.page').hide();
	if(page == 'messaging'){
		$('#messaging_page').show();
	}else{
		$('#join_page').show();
	}
}
chat.join = function(){
	var self = this;

	var name = $('#chatname').prop('value');
	if(name){
		self.socket.emit('join', name);
	}
}
chat.sendMessage = function(){
	var self = this;

	var msg = $('#message').prop('value');
	self.socket.emit('send message', msg);
	self.displayMessage(self.user, msg, true);
	$('#message').prop('value', '');
}
chat.displayMessage = function(user, message, owned){
	var self = this;

	if(user && message){
		var attr = 'style="background: rgba(211, 240, 241, 0.21);"';
		if(owned){
			attr = '';
		}
		var msg_panel = $('#message_panel');
		var msg_tpl = [
			'<dl '+attr+'>',
			  '<dt>'+user.username+'</dt>',
			  '<dd>'+message+'</dd>',
			'</dl>',
		];	
		msg_panel.append(msg_tpl.join(''));

		if(self.window_focussed){
			var height = $('#message_panel')[0].scrollHeight;
			$('#message_panel').scrollTop(height);
		}
	}
}
chat.displayNewUser = function(user){
	console.log(user);
}
chat.displayOnlineUsers = function(users){
	var list_el = $('#online_users > ul');
	list_el.html('');

	$.each(users, function(i, v){
		list_el.append('<li class="list-group-item">'+v.username+'</li>');
	});
}
chat.displayUserLogout = function(user){
	console.log(user);
}

$(function(){
	chat.init();
});
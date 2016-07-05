var chat = {
	socket: undefined
};
chat.init = function(){
	var self = this;

	self.socket = io();

	$('#join_form').submit(function(e){
		e.preventDefault();
		var name = $('#chatname').prop('value');
		if(name){
			self.socket.emit('join', name);
		}
	});
}

$(function(){
	chat.init();
});
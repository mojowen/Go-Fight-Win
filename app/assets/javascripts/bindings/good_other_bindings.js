function good_other_bindings (argument) {
	// Bindings that don't deploy with the knockout app
	$('#msg #container .clear').live('click',function(e) {
		var $this = $(this);
		$this.parent().find('p').text('')
		$this.hide();
	});
	
}

$.fn.msg = function(msg,speed) {
	// should append the msg
	var $this = $(this);
	$this.text(msg);
	$this.parent().find('.clear').show();
}

function notify(msg, speed) {
	var speed = typeof speed != 'undefined' ? 'slow' : speed;
	$('.notice').msg(msg, speed);
};
function warn(msg, speed) {
	var speed = typeof speed != 'undefined' ? 'slow' : speed;
	$('.alert').msg(msg, speed);
};
function clear() {
	$('.notice, .alert').text('');
	$('.clear').hide();
};

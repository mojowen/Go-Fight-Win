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
	var $this = $(this), $clear = $this.parent().find('.clear');
	$this.text(msg).show();
	$clear.text('x').show();
	setTimeout(function() { $this.slideUp('slow');  $clear.text(''); }, 1400);
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

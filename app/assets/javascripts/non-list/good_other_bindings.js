function good_other_bindings (argument) {
	// Bindings that don't deploy with the knockout app
	$('#msg #container .clear').live('click',function(e) {
		var $this = $(this);
		$this.parent().find('p').text('')
		$this.hide();
	});
	$('.overlayer').live('click', function() {
		var $this = $(this);
		$('#overlay, #overlay div:visible').hide();
		if( !$this.hasClass('on') ) {
			$('#'+$(this).attr('id')+'_overlay').show().parent().show();
			$('#header, #footer').css('position','absolute');
		} else {
			$('#header, #footer').css('position','fixed');
		}
		$this.toggleClass('on');
	});
	$('.overlay_close').live('click', function() {
		$('.overlayer').removeClass('on');
		$('#overlay, #overlay div:visible').remove();
		$('#header, #footer').css('position','fixed');
	});
	
	$('#bug_form').live('submit',function(e){
		$this = $(this);
		$.post(
			'https://docs.google.com/spreadsheet/formResponse?formkey=dHRzYnZYUUd2Zy1yMHRWNGxBa0RwMkE6MQ&ifq',
			{
				'entry.0.single': $('#email',$this).val(),
				'entry.1.single':  $('#bug_msg',$this).val(),
				'entry.5.single': $('#session_data',$this).val(),
				'entry.2.single':  $('#current_user',$this).val(),
				'entry.4.single': ko.toJSON(rows),
				'entry.3.single': views().map(function(el) { return el._flatten('json')  }),
				'entry.6.single': JSON.stringify($.browser),
				'submit': 'Submit'
			},
			function(){}
		);
		notify('THANKS! Get back atcha soon');
		$('.overlayer').removeClass('on');
		$('#overlay, #overlay div:visible').hide();
		$('#header, #footer').css('position','fixed');
		e.preventDefault();
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

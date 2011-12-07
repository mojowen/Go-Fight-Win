function fields_template (argument) {
	function num_change(val,change) {
		if( val == '' || val == undefined ) { val = 0; }
		if( !isNaN(parseInt(val)) ) { 
			return parseInt(val) + change;
		} else {
			warn('not a number chief');
			return val;
		}
		
	}
	$('.number').live({
		change: function(e) {
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.name]();
			if( !isNaN(parseInt(val)) ) { row[field.name]( parseInt(val) ); }
		},
		keydown: function(e){
			var $number = $(this).parent().find('.number_controls')
			switch(e.keyCode){
				case 38:
					$number.find('.number_up').css('color','#747474');
					break;
				case 40: 
					$number.find('.number_down').css('color','#747474');
					break;
			}
		
		},
		keyup: function(e){
			var ctx = ko.contextFor(this);
			var row = ctx.$parent, field = ctx.$data;
			var val = row[field.name]();
			var $number = $(this).parent().find('.number_controls')
			switch(e.keyCode){
				case 38:
					row[field.name]( num_change(val,1) );
					$number.find('.number_up').css('color','black');
					break;
				case 40: 
					row[field.name]( num_change(val,-1) );
					$number.find('.number_down').css('color','black');
					break;
			}
		
		}
	});
	$('.number_controls .number_up').live('click',function(e) {
		e.preventDefault();
		clearSelection();
		var ctx = ko.contextFor(this);
		var row = ctx.$parent, field = ctx.$data;
		var val = row[field.name]();
		row[field.name]( num_change(val,1) );
	});
	$('.number_controls .number_down').live('click',function(e) {
		e.preventDefault();
		clearSelection();
		var ctx = ko.contextFor(this);
		var row = ctx.$parent, field = ctx.$data;
		var val = row[field.name]();
		row[field.name]( num_change(val,-1) );
	});
}


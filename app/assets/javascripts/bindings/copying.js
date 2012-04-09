appDataModel.copying = function(argument) {

	// This is to keep track of when we're dragging to select
	$(document).mouseup( function(e) {
		appDataModel.clicking = false;
	});
	// This function is used to cleanup after a copy event
	function fix() {
		$('#ideal').remove(); 
		$('.copying').removeClass('copying');
	}
	// Function to select elements for copying
	function selectElementContents(el) {
		var body = document.body, range, sel;
		if (body.createTextRange) {
			range = body.createTextRange();
			range.moveToElementText(el);
			range.select();
		} else if (document.createRange && window.getSelection) {
			range = document.createRange();
			range.selectNodeContents(el);
			sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
		var t = setTimeout(function() { fix(); },200);
	}
	// Function used to select things
	appDataModel.grabem = function($begin, $end) {
		if( $begin.length == 0 || $end.length == 0 ) { return false; }
		$('td').removeClass('addselected');
		// Probably could make this into a single object or something
		var $this_y = $('tr', $begin.parents('tbody')).index($begin.parents('tr')),
			$this_x = $('td.cell', $begin.parent()).index($begin),
			$selected_y = $('tr', $end.parents('tbody')).index($end.parents('tr')),
			$selected_x = $('td.cell', $end.parent()).index($end);
		var $start_y = $selected_y > $this_y ? $this_y : $selected_y,
			$end_y = $selected_y < $this_y ? $this_y : $selected_y,
			$start_x = $selected_x > $this_x ? $this_x : $selected_x,
			$end_x = $selected_x < $this_x ? $this_x : $selected_x;
	// Grabs everything inbetween the selected cell and the newly clicked cell
		for( var y = $start_y; y < $end_y+1; y++) {
			for( var x = $start_x; x < $end_x+1; x++) {
				$('tbody#edit_rows tr:eq('+y+') td.cell:eq('+x+')').addClass('addselected');
			}
		}
	}

	// Binding for cut and copy
	$(document).bind('cut copy', function(e) {
		$('body').append('<div id="ideal" style="top: 9999px; position: absolute;"></div>');
		var $selected = $('.addselected, .selected').addClass('copying'),
			rows = $selected.parent().length,
			columns = $selected.length / rows,
			copy = "";
		for (var i=0; i < $selected.length; i++) {
			var value = '',
				$this = $($selected[i]);
			if( $this.hasClass('multiselect') || $this.hasClass('select') ) {
				value = $('select.data',$this).val();
				value;
			} else if ( $this.hasClass('children') ) {
				value = $('.data',$this).text(); 
			} else {
				value = $('.data',$this).val();
			}
			if( value == null || value == '' ) { value = '--'; }
			if( (i+1) % columns === 0 ) {
				copy += value+"\n\r"
			} else {
				copy += value+"\t"
			}
		}
		$('#ideal').text(copy);
		selectElementContents(document.getElementById('ideal'));
	});
	// Used to add select. 
	function selectMe( $target, event) {
		var $selected = $('.selected');
		window.getSelection().removeAllRanges();
		if( event.shiftKey ) {
			appDataModel.grabem($target, $selected);
		} else {
			$selected.removeClass('selected');
			$('.addselected').removeClass('addselected');
			$target.addClass('selected');
		}
	}


	// Document wide MouseDown functionality, Used for selecting
	$(document).mousedown(function(e){
		var $target = $(e.target);

		if( $target.is('td.cell') ) {
			selectMe( $target, e);
		} else if ( $target.parents('td.cell').length > 0 ) {
			selectMe( $target.parents('td.cell'), e )
		} else {
			$('.selected, .addselected, .last').removeClass('selected').removeClass('addselected').removeClass('last');
		}

	});

}
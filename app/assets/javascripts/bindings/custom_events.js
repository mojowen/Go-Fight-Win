appDataModel.custom_events = function(argument) {
	$(document).on(
		'selectCell',
		'.grid td.cell, .grid .data',
		function(e,data) {
			var data = typeof data != 'undefined' ? data.data : new Object, 
				shift = typeof data.parentEvent != 'undefined' ? data.parentEvent.shiftKey : false,
				extra = typeof data.parentEvent != 'undefined' ? data.parentEvent.ctrlKey || data.parentEvent.metaKey : false,
				$selected = typeof data.selected != 'undefined' ? data.selected : null,
				$cell = $(this).is('td.cell') ? $(this) : $(this).parents('td.cell'),
				$data = $(this).is('.data') ? $(this) : $(this).find('.data')

			if( $cell.hasClass('selected') ) {
				$data.trigger('openCell')
			} else { // Clicking on this for the first time
				if( shift ) { //If shift is being held
					$cell.addClass('last'); 
					appDataModel.grabem($cell,$selected);
				} else {
					$('.addselected, .selected').removeClass('addselected').removeClass('selected')
					$cell.addClass('selected')
					$data.trigger('closeCell').attr('disabled',true);
					setTimeout(function(){ $data.attr('disabled',false)},1);
				}
				return false;
			}
		}
	);
	$(document).on(
		'closeCell',
		'.grid td.cell, .grid .data',
		function(e,data) {
			var $cell = $(this).is('td.cell') ? $(this) : $(this).parents('td.cell'),
				$data = $(this).is('.data') ? $(this) : $(this).find('.data')
				
			$data.removeClass('open').blur()
		}
	);
	$(document).on(
		'openCell',
		'.grid td.cell, .grid .data',
		function(e,data) {
			appDataModel.clicking = false;
			var $cell = $(this).is('td.cell') ? $(this) : $(this).parents('td.cell'),
				$data = $(this).is('.data') ? $(this) : $(this).find('.data')

			$cell.addClass('selected')
			$data.attr('disabled',false).addClass('open').trigger('open').focus();
		}
	);
}

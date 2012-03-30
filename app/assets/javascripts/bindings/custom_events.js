appDataModel.custom_events = function(argument) {
	$(document).on(
		'select',
		'.grid td.cell, .grid .data',
		function(e,data) {

			var data = data.data || new Object, 
				shift = typeof data.parentEvent != 'undefined' ? data.parentEvent.shiftKey : false,
				extra = typeof data.parentEvent != 'undefined' ? data.parentEvent.ctrlKey || data.parentEvent.metaKey : false,
				$selected = typeof data.selected != 'undefined' ? data.selected : null,
				$cell = $(this).is('td.cell') ? $(this) : $(this).parents('td.cell'),
				$data = $(this).is('.data') ? $(this) : $(this).find('.data')

			appDataModel.clicking = false;

			if( shift ) { //If shift is being held
				$cell.addClass('last'); 
				appDataModel.grabem($cell,$selected);
			} else {
				$('.addselected, .selected').removeClass('addselected').removeClass('selected')
				$cell.addClass('selected')
				$data.trigger('close').attr('disabled',true)
			}

		}
	);
	$(document).on(
		'close',
		'.grid td.cell, .grid .data',
		function(e,data) {
			$(this).blur();
		}
	);
}

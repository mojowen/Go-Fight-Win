jQuery.fn.extend({  
	dateMaker: function(observable) {
		var $this = this.is('textarea') ? this : this.prev('textarea'),
			$cell = $this.parent(),
			$datepicker = $this.next('.date_controller').datepicker({ 
				dateFormat: 'D M dd yy',
				altField: $this,
				showButtonPanel: true,
				closeText: 'Close',
				onSelect: function(dateText, inst) { observable(dateText); $datepicker.datepicker('destroy') }
			}).datepicker('setDate', new Date( observable() ) ).prepend('<div class="close">X</div>')

		$(document).bind('mousedown.dateMaker', function(e) {
			if( !$.contains( $cell[0], e.target) && e.target !== $this[0] && !$(e.target).is($datepicker) ||  $(e.target).is('.close') ) {
				$datepicker.datepicker('destroy')
				$cell.removeClass('open')
			}
			$(this).unbind('click.dateMaker');
		});
		return $this
	}
})
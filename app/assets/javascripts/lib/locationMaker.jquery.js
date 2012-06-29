jQuery.fn.extend({  
	locationMaker: function(observable) {
		var $this = this.is('textarea') ? this : this.prev('textarea'),
			$cell = $this.parent(),
			$locationpicker = $this.next('.location_controller')

		$(document).bind('mousedown.locationMaker', function(e) {
			if( !$.contains( $cell[0], e.target) && e.target !== $this[0] && !$(e.target).is($locationpicker) ||  $(e.target).is('.close') ) {
				$locationpicker
				$cell.removeClass('open')
			}
			$(this).unbind('click.locationMaker');
		});
		return $this
	}
})
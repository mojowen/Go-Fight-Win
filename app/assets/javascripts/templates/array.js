// Array
$(document).on({
	click: function(e) {
		var $this = $(this).addClass('open')
		$(document).bind('mousedown.array', function(e) {
			if( !$.contains( $this[0], e.target) && e.target !== $this[0] && !$(e.target).is($this) ||  $(e.target).is('.close') ) {
				$this.removeClass('open')
			}
			$(this).unbind('mousedown.array');
		});

	} 
},'.entry.array')
tableModel.__addTemplate('array','<div class="array" data-bind="template: { foreach: $parent[$data.{data_field}], name:\'arrayItem\'}"><div style="clear:both;"></div></div>',160);
tableModel.__addTemplate('arrayItem','<a data-bind="text:  $data.name || $data , attr: { href: $data.link  }"></a>');
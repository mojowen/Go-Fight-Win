appDataModel.keyboard_shortcuts = function(argument) {

	$(document).keydown(function(e){

			appDataModel.clicking = false;

			var $selected = $('.selected'),
				pos = $('td.cell', $selected.parent() ).index($selected),
				extra = e.ctrlKey || e.metaKey,
				shift = e.shiftKey,
				$obj = $selected,
				$last = $('.last').removeClass('last');

			if( shift ) { 
				if( $last.length == 0 ) $last = $selected;
				pos = $('td.cell', $last.parent() ).index($last);
				$obj = $last;
			}
			var data = {
				parentEvent: e,
				selected: $selected,
				$last: $last
			}

			if( [37, 38, 39, 40 ].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 && $('.open').length < 1 ) {  // If move keycode AND there's a selected cell AND there's no open cells
				$('.hovered').removeClass('hovered'); // When we scroll, no hovered
				e.preventDefault();
				appDataModel.clicking = false;
				switch(e.keyCode){
					case 37: // Left
						if( extra ) $obj.parent().find('td.cell:first').trigger('selectCell',{data:data})
						else $obj.prev('td.cell').trigger('selectCell',{data:data}) 
						appDataModel.rowScroll();
						break;
					case 38: // Up
						if( extra ) {
							data.parentEvent.shiftKey = false // Setting to false as we don't let jump + select happen for up or down
							dataModel.current.view().jump('top', { callback: function() { $('.grid tbody').find('tr:first td.cell:eq('+pos+')').trigger('selectCell',{data:data}) }});
						} else $obj.parent().prev('tr').find('td.cell:eq('+pos+')').trigger('selectCell',{data:data}) 
						break;
					case 39: // Right
						if( extra ) $obj.parent().find('td.cell:last').trigger('selectCell',{data:data})
						else $selected.next('td.cell').trigger('selectCell',{data:data})
						appDataModel.rowScroll();
						break;
					case 40: // Down
						if( extra ) {
							data.parentEvent.shiftKey = false // Setting to false as we don't let jump + select happen for up or down
							dataModel.current.view().jump('bottom', { callback: function() { $('.grid tbody').find('tr:last td.cell:eq('+pos+')').trigger('selectCell',{data:data})  }}); 
						} else $obj.parent().next('tr').find('td.cell:eq('+pos+')').trigger('selectCell',{data:data}) 
						break;
					}
				} 

				if (  e.keyCode == 9 && $('.grid .selected').length > 0   ) {
					e.preventDefault(); 
						if( e.shiftKey ) {
							if( pos == 0 ) {
								$selected.parent().prev('tr').find('td.cell:eq('+($selected.parent().find('td.cell').length-1)+')').find('.data').mousedown();
							} else {
								$selected.prev('td.cell').find('.data').mousedown();
							}
						} else {
							if( pos +1 == $selected.parent().find('td.cell').length ) {
								$selected.parent().next('tr').find('td.cell:eq(0)').find('.data').mousedown();
							} else {
								$selected.next('td.cell').find('.data').mousedown();
							}
						}
				}

				if (  e.keyCode == 13 && $('.grid .selected').length > 0  ) {
						if( $selected.find('textarea, select').hasClass('open') ) {
							if( !e.shiftKey || !$selected.find('textarea, select').hasClass('block') ) {
								e.preventDefault(); 
								$selected.find('textarea, select').removeClass('open').blur().trigger('close');
							}
						} else {
							e.preventDefault(); 
							var actionable = $selected.find('textarea, select, button');
							actionable.trigger('open');
							if( actionable.is('button') ) {
								actionable.addClass('open').click().nextAll('button:first').click();
							} else {
								actionable.addClass('open').focus().trigger('open');
							}
						}
				}

			// keypress's regardless of whether something is highlighted or not
			switch(e.keyCode) {
				case 83:
					if( extra) { // Saving if extra is pressed
						e.preventDefault(); 
						saveAll({once: true});}
					break;
			}
	// }).keyup( function(e) {
	// 	switch(e.keyCode) {
	// 		case 191: //forward slash
	// 			if( $(':focus').length == 0 && !dataModel.current.view().groups.on()) { 
	// 				$('.search_bar').find('select:first')
	// 			}
	// 			break;
	// 		default:
	// 			// console.log(e.keyCode);
	// 	}
	});

	appDataModel.clicking = false;

	$('#edit_rows td.cell, .grid .data').live({
		mousedown: function(e) { // Default behavior when clicking on a cell
			appDataModel.clicking = true;
			var $this = $(this);
			$(this).trigger('selectCell',{ data: {selected: $('.selected'), parentEvent: e} });
		},
		mouseover: function(e) { // Default behaivor when hovering plus when dragging
			$(this).parent('td').addClass('hovered').parents('tr').addClass('hovered');
			if( appDataModel.clicking && !e.shiftKey ) {
				var $this = $('td.hovered'),
					$selected = $('.selected');
				appDataModel.grabem($this,$selected);
			}
		}, 
		mouseout: function(e) { // Removing the hover 
			$(this).parent('td').removeClass('hovered').parents('tr').removeClass('hovered');
		},
		dblclick: function(e) { 
			$(this).trigger('openCell')
		},
		focusout: function(e) {
		},
		keypress: function(e) {
			switch(e.keyCode) {
				case 13:
					$this = $(this);
					if( $this.hasClass('multiselect') ) {
						$this.trigger('openCell')
					}
					if( !e.shiftKey || !$this.hasClass('block') ) {
						$this.val( $this.val().replace(/\n/g,'') ).blur().trigger('close').parent().addClass('selected');
					}
					// remove cal
					$this.next('.date_controls').find('.date_picker').datepicker("destroy").prev('.cal').removeClass('on');
					break;
			}
		}
	});
	$(document).on({
		click: function(e) {
			$(this).trigger('open')
			e.preventDefault();
		},
		focusin: function() {
//			$(this).trigger('open')
		}
	},'.form .data');


	$(document).mousedown(function(e){
		var $target = $(e.target), 
			$open = $('.open'),
			$prev = $open.parent()
		
		if( !$target.is($prev) && $open.length != 0 && !$.contains($prev[0],$target[0] ) ) {
			$open.trigger('closeCell');
		}


		if( $target.parents('.hasDatepicker').length < 1 && !$target.hasClass('cal') ) {
			$('.hasDatepicker').datepicker('destroy').prev('.cal').removeClass('on');
		}
	});

}
appDataModel.keyboard_shortcuts = function(argument) {

	function selectMe( $target, event) {

	window.onbeforeunload = function() { 
	  if ( dataModel.savingRows().length + dataModel.savingViews().length > 0 ) {
	    return "Woah woah woah woah, you have "+dataModel.savingState().prefix+" "+dataModel.savingState().text+'.';
	  }
	}
	function checkScroll(pos) {
		dataModel.current.view().now(pos);
		var view = ko.toJS(dataModel.current.view);
		var bottom = pos + 17 ,
			top = pos - 3 ;

			var $selected = $('.selected'),
				pos = $('td.cell', $selected.parent() ).index($selected),
				extra = e.ctrlKey || e.metaKey,
				shift = e.shiftKey;
			if( shift ) {
				$last = $('.last').removeClass('last');
				if( $last.length == 0 ) { $last = $selected;}
				pos = $('td.cell', $last.parent() ).index($last);
			}
			// need to do a check when this is ok
			if( [37, 38, 39, 40 ].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 && $('.open').length < 1 ) { 
				$('.hovered').removeClass('hovered');
				e.preventDefault(); 
				switch(e.keyCode){
					case 37:
						// Left
						if( shift ) {
							if( extra ) { $last = $last.parent().find('td.cell:first').addClass('last'); clicking = false; }
							else { $last = $last.prev('td.cell').addClass('last'); }
						 	grabem($last,$selected);
						} else {
							if( extra ) { $selected.parent().find('td.cell:first').find('.data').mousedown(); clicking = false; }
							else { $selected.prev('td.cell').find('.data').mousedown(); clicking = false; }
						}
						rowScroll();
						break;
					case 38:
						// Up
						if( extra ) { 
							dataModel.current.view().jump('top', { callback: function() { $('.grid tbody').find('tr:first td.cell:eq('+pos+')').find('.data').mousedown(); clicking = false; }}); 
						} else { 
							if( shift )  { $last = $last.parent().prev('tr').find('td.cell:eq('+pos+')').addClass('last'); grabem($last,$selected); rowScroll(); }
							else {$selected.parent().prev('tr').find('td.cell:eq('+pos+')').find('.data').mousedown(); clicking = false; rowScroll(); }
						}
						break;
					case 39: 
						// Right
						if( shift) {
							if( extra ) { $last = $last.parent().find('td.cell:last').addClass('last'); }
							else { $last = $last.next('td.cell').addClass('last'); }
							grabem($last,$selected);
						} else {
							if( extra ) { $selected.parent().find('td.cell:last').find('.data').mousedown(); clicking = false; }
							else { $selected.next('td.cell').find('.data').mousedown();  clicking = false; }
						}
						rowScroll();
						break;
					case 40:
						// Down
						if( extra ) {
							dataModel.current.view().jump('bottom', { callback: function() { $('.grid tbody').find('tr:last td.cell:eq('+pos+')').find('.data').mousedown(); clicking = false; }}); 
						} else { 
							if( shift ) { $last = $last.parent().next('tr').find('td.cell:eq('+pos+')').addClass('last'); grabem($last,$selected); rowScroll(); }
							else { $selected.parent().next('tr').find('td.cell:eq('+pos+')').find('.data').mousedown(); clicking = false; rowScroll(); } 
						}
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

	$('.grid td.cell .data').live({
		mousedown: function(e) {
			appDataModel.clicking = true;
		},
		mouseover: function(e) {
			$(this).parent('td').addClass('hovered').parents('tr').addClass('hovered');
			if( appDataModel.clicking && !e.shiftKey ) {
				var $this = $('td.hovered'),
					$selected = $('.selected');
				appDataModel.grabem($this,$selected);
			}
		}, 
		mouseout: function(e) {
			$(this).parent('td').removeClass('hovered').parents('tr').removeClass('hovered');
		},
		focus: function(e) {
			$(this).not(".open").blur().trigger('close').parent('td').addClass('selected');
		},
		dblclick: function(e) {
			$(this).addClass('open').focus().trigger('open').parent('td').addClass('selected');
		},
		focusout: function(e) {
			$(this).removeClass('open');
		},
		keypress: function(e) {
			switch(e.keyCode) {
				case 13:
					$this = $(this);
					if( $this.hasClass('multiselect') ) {

					} else if( !e.shiftKey || !$this.hasClass('block') ) {
						$this.val( $this.val().replace(/\n/g,'') ).blur().trigger('close').parent().addClass('selected');
					}
					// remove cal
					$this.next('.date_controls').find('.date_picker').datepicker("destroy").prev('.cal').removeClass('on');
					break;
			}
		}
	
	});



}
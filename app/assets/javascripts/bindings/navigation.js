function keyboardShortcuts (argument) {
	$(document).mouseup( function(e) {
		clicking = false;
	});
	function fix() {
		$('#ideal').remove(); 
		$('.copying').removeClass('copying');
	}
	
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
	$(document).bind('cut copy', function(e) {
		$('body').append('<div id="ideal"></div>');
		var $selected = $('.addselected, .selected').addClass('copying'),
			rows = $selected.parent().length,
			columns = $selected.length / rows,
			copy = "";

		for (var i=0; i < $selected.length; i++) {
			var value = '';
			if( typeof $selected.find('.data')[i].value == 'undefined' ) {
				value = $( $selected.find('.data')[i] ).text();
			} else {
				value = $selected.find('.data')[i].value;
			}
			if( value == "" ) { value = "--"; }

			if( (i+1) % columns === 0 ) {
				copy += value+"\n\r"
			} else {
				copy += value+"\t"
			}

		}

		$('#ideal').text(copy);
		selectElementContents(document.getElementById('ideal'));
	});

	function selectMe( $target, event) {
		var $selected = $('.selected');
		window.getSelection().removeAllRanges();
		if( event.shiftKey ) {
			grabem($target, $selected);
		} else {
			$selected.removeClass('selected');
			$('.addselected').removeClass('addselected');
			$target.addClass('selected');
		}
	}
	$(document).mousedown(function(e){
		var $target = $(e.target);

		if( $target.is('td.cell') ) {
			selectMe( $target, e);
		} else if ( $target.parents('td.cell').length > 0 ) {
			selectMe( $target.parents('td.cell'), e )
		} else {
			$('.selected, .addselected, .last').removeClass('selected').removeClass('addselected').removeClass('last');
		}
		//  removes datpicker if so
		if( $target.parents('.hasDatepicker') && !$target.is('.hasDatepicker') && !$target.is('textarea.date') && !$target.is('.cal') ) {
			$('.hasDatepicker').datepicker('destroy').prev('.cal').removeClass('on');
		}
	});

	window.onbeforeunload = function() { 
	  if ( dataModel.savingRows().length + dataModel.savingViews().length > 0 ) {
	    return "Woah woah woah woah, you have "+dataModel.savingState().prefix+" "+dataModel.savingState().text+'.';
	  }
	}
	function checkScroll(pos) {
		currentView().now(pos);
		var view = ko.toJS(currentView);
		var bottom = pos + 17 ,
			top = pos - 3 ;

		if( bottom > view.end - 40 ) {
			var add = bottom - view.end < 0 ? 1 : bottom - view.end;
			var end = view.end + add < viewModel.filteredRows().length ?  view.end + add : viewModel.filteredRows().length;
			currentView().end( end )
		}
		if( top < view.start + 10 ) {
			var move = top - view.start > 0 ? -1 : top - view.start;
			var start = view.start + move > 0 ? view.start + move  : 0;
			currentView().start( start );
			currentView().end( view.end - move )
		}
	}
	function rowScroll() {
		var $scroll = $('#scrolling'),
			position = Math.round( ( $('.selected').position().top - $scroll.position().top + $scroll.scrollTop() ) / 26 )+ 1,
			view = ko.toJS( currentView ),
			now =  view.now < 3 ? 3 : view.now;
			bottom = now + 17,
			tiptop = now - 2;
			if( position < tiptop  + 1 ) {
				$scroll.scrollTop( $scroll.scrollTop() - 26 *(tiptop-position+1) )
			}
			if( position > bottom - 1 ) {
				$scroll.scrollTop( $scroll.scrollTop() + 26 * (position-bottom+1)  )
			}
	}
	
	$(document).keydown(function(e){
			clicking = false;
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
			if( [37, 38, 39, 40, 13, 9].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 && $('.open').length < 1 ) { 
				$('.hovered').removeClass('hovered');
				e.preventDefault(); 
				switch(e.keyCode){
					case 37:
						// Left
						if( shift ) {
							if( extra ) { $last = $last.parent().find('td.cell:first').addClass('last'); }
							else { $last = $last.prev('td.cell').addClass('last'); }
						 	grabem($last,$selected);
						} else {
							if( extra ) { $selected.parent().find('td.cell:first').find('.data').mousedown(); }
							else { $selected.prev('td.cell').find('.data').mousedown(); }
						}
						rowScroll();
						break;
					case 38:
						// Up
						if( extra ) {  
							currentView().jump('top', {callback: function() { $('.grid tbody').find('tr:first td.cell:eq('+pos+')').find('.data').mousedown(); }}); 
						} else { 
							if( shift )  { $last = $last.parent().prev('tr').find('td.cell:eq('+pos+')').addClass('last'); grabem($last,$selected); rowScroll(); }
							else {$selected.parent().prev('tr').find('td.cell:eq('+pos+')').find('.data').mousedown(); rowScroll(); }
						}
						break;
					case 39: 
						// Right
						if( shift) {
							if( extra ) { $last = $last.parent().find('td.cell:last').addClass('last'); }
							else { $last = $last.next('td.cell').addClass('last'); }
							grabem($last,$selected);
						} else {
							if( extra ) { $selected.parent().find('td.cell:last').find('.data').mousedown(); }
							else { $selected.next('td.cell').find('.data').mousedown(); }
						}
						rowScroll();
						break;
					case 40:
						// Down
						if( extra ) { 
							currentView().jump('bottom', {callback: function() { $('.grid tbody').find('tr:last td.cell:eq('+pos+')').find('.data').mousedown(); }}); 
						} else { 
							if( shift ) { $last = $last.parent().next('tr').find('td.cell:eq('+pos+')').addClass('last'); grabem($last,$selected); rowScroll(); }
							else { $selected.parent().next('tr').find('td.cell:eq('+pos+')').find('.data').mousedown(); rowScroll(); } 
						}
						break;
					}
				} 
				if (  [13, 9].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 ) {
					e.preventDefault(); 
					switch(e.keyCode){
					case 9:
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
						break;
					case 13:
						if( $selected.find('textarea, select').hasClass('open') ) {
							$selected.find('textarea, select').removeClass('open').blur();
						} else {
							$selected.find('textarea, select').addClass('open').focus();
						}
						break;
				}
			}
			// keypress's regardless of whether something is highlighted or not
			switch(e.keyCode) {
				case 83:
					if( extra) { e.preventDefault(); saveAll({once: true});}
					break;
				default:
					// console.log(e.keyCode);
			}
	}).keyup( function(e) {
		switch(e.keyCode) {
			case 191:
				if( $(':focus').length == 0 && !currentView().groups.on()) { 
					$('.search_bar').find('select:first')
				}
				break;
			default:
				// console.log(e.keyCode);
		}
	});
	var clicking = false;
	$('.grid td.cell .data').live({
		mousedown: function(e) {
			clicking = true;
		},
		mouseover: function(e) {
			$(this).parent('td').addClass('hovered').parents('tr').addClass('hovered');
			if( clicking && !e.shiftKey ) {
				var $this = $('td.hovered'),
					$selected = $('.selected');
				grabem($this,$selected);
			}
		}, 
		mouseout: function(e) {
			$(this).parent('td').removeClass('hovered').parents('tr').removeClass('hovered');
		},
		focus: function(e) {
			$(this).not(".open").blur().parent('td').addClass('selected');
		},
		dblclick: function(e) {
			var $this = $(this);
			$this.addClass('open').focus().parent('td').addClass('selected');
		},
		focusout: function(e) {
			$(this).removeClass('open');
		},
		keypress: function(e) {
			switch(e.keyCode) {
				case 13:
					$this = $(this);
					$this.val( $this.val().replace(/\n/g,'') ).blur().parent().addClass('selected');
					// remove cal
					$this.next('.date_controls').find('.date_picker').datepicker("destroy").prev('.cal').removeClass('on');
					break;
			}
		}
	});

	$('#switch').live('click',function() {
		currentView().groups.on( currentView().groups.on() ? false : true );
	});
	$('#xls').live('click',function() {
		window.open( 	$(this).attr('url'),'_blank','toolbar=1,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1'); 
	});
	$('.goal_clear').live('click',function(){
		currentView().goal().value(undefined);
		currentView().goal().field(undefined);
	});

// Scrolling experiment	
	$('#scrolling').scroll(function(e) {
		$('.hovered').removeClass('hovered');
		var $this = $('#scrolling')
		var pos = Math.round( ( $this.scrollTop() + $this.height() ) / 26 -17 );
		checkScroll(pos);
	});
	
	function grabem($begin, $end) {
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
				$('tbody tr:eq('+y+') td.cell:eq('+x+')').addClass('addselected');
			}
		}
	}
}
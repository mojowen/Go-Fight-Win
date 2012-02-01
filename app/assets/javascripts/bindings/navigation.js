function keyboardShortcuts (argument) {
	$(document).click(function(e){
		var $target = $(e.target);
		$('.selected').removeClass('selected')
		if( $target.is('.grid td.cell') ) {
			$target.addClass('selected');
		} else if ( $target.parents('.grid td.cell').length > 0 ) {
			$target.parents('td.cell').addClass('selected');
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
			var $selected = $('.selected'),
				pos = $('td.cell', $selected.parent() ).index($selected),
				extra = e.ctrlKey || e.metaKey;
				
			// need to do a check when this is ok
			if( [37, 38, 39, 40, 13, 9].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 && $('.open').length < 1 ) { 
				$('.hovered').removeClass('hovered');
				e.preventDefault(); 
				switch(e.keyCode){
					case 37:
						// Left
						if( extra ) { $selected.parent().find('td.cell:first').find('.data').click(); }
						else { $selected.prev('td.cell').find('.data').click(); }
						rowScroll();
						break;
					case 38:
						// Up
						if( extra ) {  currentView().jump('top', {callback: function() { $('.grid tbody').find('tr:first td.cell:eq('+pos+')').find('.data').click(); }}); }
						else { $selected.parent().prev('tr').find('td.cell:eq('+pos+')').find('.data').click(); rowScroll(); }
						break;
					case 39: 
						// Right
						if( extra ) { $selected.parent().find('td.cell:last').find('.data').click(); }
						else { $selected.next('td.cell').find('.data').click(); }
						rowScroll();
						break;
					case 40:
						// Down
						if( extra ) { currentView().jump('bottom', {callback: function() { $('.grid tbody').find('tr:last td.cell:eq('+pos+')').find('.data').click(); }}); }
						else { $selected.parent().next('tr').find('td.cell:eq('+pos+')').find('.data').click(); rowScroll(); }
						break;
					}
				} 
				if (  [13, 9].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 ) {
					e.preventDefault(); 
					switch(e.keyCode){
					case 9:
						if( e.shiftKey ) {
							if( pos == 0 ) {
								$selected.parent().prev('tr').find('td.cell:eq('+($selected.parent().find('td.cell').length-1)+')').find('.data').click();
							} else {
								$selected.prev('td.cell').find('.data').click();
							}
						} else {
							if( pos +1 == $selected.parent().find('td.cell').length ) {
								$selected.parent().next('tr').find('td.cell:eq(0)').find('.data').click();
							} else {
								$selected.next('td.cell').find('.data').click();
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
	
	$('.grid td.cell .data').live({
		click: function(e) {
			var $this = $(this);
			$('.selected').removeClass('selected');
			$this.parent('td').toggleClass('selected');
		},
		focus: function(e) {
			$('.selected').removeClass('selected');
			$(this).not(".open").blur().parent().toggleClass('selected');
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
		},
		mouseover: function(e) {
			// if( $('.selected').length == 0 ) {  }
			$(this).parents('tr').addClass('hovered');
		}, 
		mouseout: function(e) {
			$(this).parents('tr').removeClass('hovered');
		}
	});

	$('#switch').live('click',function() {
		notify('Loading...');
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
}
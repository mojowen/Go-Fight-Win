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
		if( $target.parents('.hasDatepicker').length < 1 && !$target.is('.hasDatepicker') ) {
			$('.hasDatepicker').datepicker('destroy').prev('.cal').removeClass('on');
		}
	});

	window.onbeforeunload = function() { 
	  if ( dataModel.savingRows().length + dataModel.savingViews().length > 0 ) {
	    return "Woah woah woah woah, you have "+dataModel.savingState().prefix+" "+dataModel.savingState().text+'.';
	  }
	}

	function rowScroll() {
		var top = $(window).scrollTop(),
			height = $(window).height(),
			bottom = top + height,
			$selected = $('.selected'),
			$parent = $selected.parent('tr'),
			$tbody = $parent.parent('tbody')
			position = $selected.position().top+$('.selected').height();

		if( position > bottom-200 ) {  $(window).scrollTop( position - height + 200); }
		if( position < top+200 ) {  $(window).scrollTop( position - 200); }

		if( $tbody.find('tr').index( $parent ) == $tbody.find('tr').length -1 ) {
			currentView().page(currentView().paged() +1 );
		} else if ( $tbody.find('tr').index( $parent ) == 0 ) {
			currentView().page(currentView().paged() -1 );
		}

	}
	$(document).keydown(function(e){
			var $selected = $('.selected'),
				pos = $('td.cell', $selected.parent() ).index($selected),
				extra = e.ctrlKey || e.metaKey;
				
			// need to do a check when this is ok
			if( [37, 38, 39, 40, 13, 9].indexOf(e.keyCode) !== -1 && $('.grid .selected').length > 0 ) { 
				e.preventDefault(); 
				switch(e.keyCode){
					// add hotkeys for command / control
					// select to copy many?
					// exit to exit out of row mode
					case 37:
						if( extra ) { $selected.parent().find('td.cell:first').find('textarea, select').focus(); }
						else { $selected.prev('td.cell').find('textarea, select').focus(); }
						rowScroll();
						break;
					case 38:
						if( extra ) { $selected.parents('tbody').find('tr:first td.cell:eq('+pos+')').find('textarea, select').focus(); }
						else { $selected.parent().prev('tr').find('td.cell:eq('+pos+')').find('textarea, select').focus(); }
						rowScroll();
						break;
					case 39: 
						if( extra ) { $selected.parent().find('td.cell:last').find('textarea, select').focus(); }
						else { $selected.next('td.cell').find('textarea, select').focus(); }
						rowScroll();

						break;
					case 40:
						if( extra ) { $selected.parents('tbody').find('tr:last td.cell:eq('+pos+')').find('textarea, select').focus(); }
						else { $selected.parent().next('tr').find('td.cell:eq('+pos+')').find('textarea, select').focus(); }
						rowScroll();

						break;
					case 9:
						if( e.shiftKey ) {
							if( pos == 0 ) {
								$selected.parent().prev('tr').find('td.cell:eq('+($selected.parent().find('td.cell').length-1)+')').find('textarea, select').focus();
							} else {
								$selected.prev('td.cell').find('textarea, select').focus();
							}
						} else {
							if( pos +1 == $selected.parent().find('td.cell').length ) {
								$selected.parent().next('tr').find('td.cell:eq(0)').find('textarea, select').focus();
							} else {
								$selected.next('td.cell').find('textarea, select').focus();
							}
						}

						break;
					case 13:
						console.log('asdfas');
						if( $selected.find('textarea, select').hasClass('open') ) {
							// $selected.find('textarea, select').removeClass('open').blur();
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
	});
	$('.grid td.cell textarea, .grid td.cell select').live({
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
			$this.addClass('open').focus();
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
	
	
}
appDataModel.scrolling = function(argument) {
	function checkScroll(pos) {
		dataModel.current.view().now(pos);
		var view = ko.toJS(dataModel.current.view);
		var bottom = pos + 17 ,
			top = pos - 3 ;

		if( bottom > view.end - 40 ) {
			var add = bottom - view.end < 0 ? 1 : bottom - view.end;
			var end = view.end + add < viewModel.filteredRows().length ?  view.end + add : viewModel.filteredRows().length;
			dataModel.current.view().end( end )
		}
		if( top < view.start + 10 ) {
			var move = top - view.start > 0 ? -1 : top - view.start;
			var start = view.start + move > 0 ? view.start + move  : 0;
			dataModel.current.view().start( start );
			dataModel.current.view().end( view.end - move )
		}
	}

	appDataModel.rowScroll = function() {
		var $scroll = $('#scrolling'),
			position = Math.round( ( $('.selected').position().top - $scroll.position().top + $scroll.scrollTop() ) / 26 )+ 1,
			view = ko.toJS( dataModel.current.view ),
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

	// Scrolling
	$('#scrolling').scroll(function(e) {
		$('.hovered').removeClass('hovered');
		var $this = $('#scrolling')
		var pos = Math.round( ( $this.scrollTop() + $this.height() ) / 26 -17 );
		checkScroll(pos);
	});
	
}
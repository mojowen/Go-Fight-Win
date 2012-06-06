appDataModel.scrolling = function(argument) {
	function checkScroll(pos) {
		var pos =  pos > 0 ? pos : 0,
			view = ko.toJS(dataModel.current.view)


		if( view.now == pos ) return false // If position hasn't changed, end

		var scrollV = dataModel.current.height.scroll(),
			bottom = pos + 10,
			top = pos - 10 ;

		var l = new Date();
		if( bottom > view.end - 40 ) {
			var add = bottom - view.end < 0 ? 1 : bottom - view.end;
			var end = view.end + add < viewModel.filteredRows().length ?  view.end + add : viewModel.filteredRows().length;
			dataModel.current.view().end( end )
		}

		if( top < view.start + 10 && top > 0 ) {
			var move = top - view.start > 0 ? -1 : top - view.start;
			var start = view.start + move > 0 ? view.start + move  : 0;
			dataModel.current.view().start( start );
			dataModel.current.view().end( view.end - move )
		}

		dataModel.current.view().now(pos);

		
	}

	appDataModel.rowScroll = function() {
		var $scroll = $('#scrolling'),
			position = $('.selected').parent('tr').index('tr', $scroll),
			scrollV = dataModel.current.height.scroll(),
			view = ko.toJS( dataModel.current.view ),
			now =  view.now < 3 ? 3 : view.now;
			bottom = now + scrollV-2, //Finds the bottom and goes up by 2 (the actual bottom)
			tiptop = now - 2
			if( position < tiptop  + 1 ) {
				$scroll.scrollTop( $scroll.scrollTop() - 33 *(tiptop-position+1) )
			}
			if( position > bottom - 1 ) {
				$scroll.scrollTop( $scroll.scrollTop() + 33 * (position-bottom+1)  )
			}
	}

	// Scrolling
	$('#scrolling').scroll(function(e) {
		$('.hovered').removeClass('hovered');
		var $this = $('#scrolling')
		var pos = Math.round( ( $this.scrollTop() + $this.height() ) / 33 - dataModel.current.height.scroll() + 2); // position = scroll of top scroll + possible height of top scroll ~ converted to row number - rows that can fit + 2 or so off the top
		checkScroll(pos);
	}).scrollTop(0)

	$('#scrolling, .scroll_head').scrollsync({targetSelector: '#scrolling', axis : 'x'});
	$(window).resize(function(e){
		dataModel.current.height( $(window).height() - 200 )
	})
}
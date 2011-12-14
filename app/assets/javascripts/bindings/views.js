function views_template() {
	$('.view').live('click', function(e) {
		var $this = $(this), view = ko.dataFor(this);
		if( view != currentView() ) {
			setCurrentView(view);
			try { window.history.pushState('', "Title", _url+'/'+view.to_param()); } catch(e) { }
			document.title = view.name()+' of '+_list+' | Go. Fight. Win';
		}
		e.preventDefault();
	});
	$('.new_view').live('click', function() {
		var new_view = new viewModel();
		views.push(new_view);
		setCurrentView(new_view);
		window.history.pushState('', "Title", _url);
		$('#current_view_name').select();
		
	});
	$('.remove_view').live('click',function() { 
		var view = ko.dataFor(this);
		views.destroy(view);
		setCurrentView(new viewModle() );
		try { window.history.pushState('', "Title", _url); } catch(e) { }
		document.title = _list+' | Go. Fight. Win';
	});
	$('.clear_view').live('click',function() { 
		setCurrentView(new viewModel());
		try { window.history.pushState('', "Title", _url); } catch(e) { }
		document.title = _list+' | Go. Fight. Win';
	});

	$('.remove_group').live('click',function() { 
		var group = ko.dataFor(this);
		currentView().groups.remove(group);
		var sort = currentView().sorts().filter(function(elem) {return elem.field == group.field;})
		currentView().sorts.remove(sort);
	});

	$('.add_view').live('click',function() {
		var new_view = ko.dataFor(this);
		views.push(new_view);
	});
	$('.left').live('click',function() {
		currentView().move('left');
	});
	$('.right').live('click',function() {
		currentView().move('right');
	});
	$('.far_left').live('click',function() {
		currentView().move('start');
	});
	$('.far_right').live('click',function() {
		currentView().move('end');
	});
	$('.save_ready').live('click', function() {
		saveAll({once: true});
	});
	$('.title').live('click',function() {
		setCurrentView(new viewModel());
		try { window.history.pushState('', "Title", _url); } catch(e) { }
		document.title = _list+' | Go. Fight. Win';
	});
}
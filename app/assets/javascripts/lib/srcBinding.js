ko.bindingHandlers.src = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var all = allBindingsAccessor(),
			src = all.src
		if( src == null ) $(element).hide()
		$(element).attr('src',src).show().error( function() { $(this).hide().parent().addClass('no-photo') });
	}
}
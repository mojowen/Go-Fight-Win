function groups_template (argument) {
	$('.add_group').live('click',function(e) {
		// if no group()[0] create a new group
		// probably something to add / change a sort as well. maybe wrap all this in one function setGroup or something
		var $this = $(this), field = ko.dataFor(this);
		notify('Grouping, may take a sec...');
		var sorting = currentView().groups().map( function(elem) { return {field: elem.field, direction: 'ASC'}; } );
		sorting.push( {field: field.to_param, direction: 'ASC'} )
		currentView().addSort(field.to_param);
		currentView().sortRows();
		currentView().addGroup(field.to_param);
	});
	$('.remove_group').live('click', function(event) {
		var group = ko.dataFor(this);
		currentView().groups.remove(group);
		var sort = currentView().sorts().filter(function(elem) { return elem.field == group.filed })[0];
		currentView().sorts.remove(sort);
	});
	$('.swap').live('click', function(event) {
		currentView().groups.reverse();
	});
	$('.pivot').live('click', function(event) {
		currentView().groups.pivot(true)
	});
	$('.unpivot').live('click', function(event) {
		currentView().groups.pivot(false)
	});
}
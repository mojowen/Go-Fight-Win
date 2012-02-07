appDataModel.groups_template = function(argument) {
	$('.add_group').live('click',function(e) {
		// if no group()[0] create a new group
		// probably something to add / change a sort as well. maybe wrap all this in one function setGroup or something
		var $this = $(this), field = ko.dataFor(this);
		notify('Grouping, may take a sec...');
		var sorting = dataModel.current.view().groups().map( function(elem) { return {field: elem.field, direction: 'ASC'}; } );
		sorting.push( {field: field.to_param, direction: 'ASC'} )
		dataModel.current.view().addSort(field.to_param);
		dataModel.current.view().sortRows();
		dataModel.current.view().addGroup(field.to_param);
	});
	$('.remove_group').live('click', function(event) {
		var group = ko.dataFor(this);
		dataModel.current.view().groups.remove(group);
		var sort = dataModel.current.view().sorts().filter(function(elem) { return elem.field == group.field })[0];
		dataModel.current.view().sorts.remove(sort);
	});
	$('.swap').live('click', function(event) {
		dataModel.current.view().groups.reverse();
	});
	$('.pivot').live('click', function(event) {
		dataModel.current.view().groups.pivot(true)
	});
	$('.unpivot').live('click', function(event) {
		dataModel.current.view().groups.pivot(false)
	});
}
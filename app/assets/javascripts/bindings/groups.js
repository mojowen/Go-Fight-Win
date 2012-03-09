appDataModel.groups_template = function(argument) {
	$('.add_group').live('click',function(e) {
		var $this = $(this), 
			context = ko.contextFor(this),
			field = context.$data,
			grouping = context.$parent;

			if( grouping.groups().length < 2 ) { grouping.groups.push( new groupModel(field.to_param) ); }

		// notify('Grouping, may take a sec...');
		// var sorting = dataModel.current.view().groups().map( function(elem) { return {field: elem.field, direction: 'ASC'}; } );
		// sorting.push( {field: field.to_param, direction: 'ASC'} )
		// dataModel.current.view().addSort(field.to_param);
		// dataModel.current.view().sortRows();
		// dataModel.current.view().addGroup(field.to_param);
	});
	$('.remove_group').live('click', function(event) {
		var context = ko.contextFor(this),
			grouped = context.$data,
			grouping = context.$parent;
		grouping.groups.remove(grouped);
	});
	$('.group .remove').live('click', function(event) {
		var context = ko.contextFor(this),
			grouping = context.$data,
			view = context.$parent;
		view.groupings.remove(grouping);
	});
}
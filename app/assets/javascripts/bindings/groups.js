function groups_template (argument) {
	$('.group_field').live('click',function(e) {
		// if no group()[0] create a new group
		// probably something to add / change a sort as well. maybe wrap all this in one function setGroup or something
		var $this = $(this), field = ko.dataFor(this);
		currentView().addGroup(field.name);
		currentView().addSort(field.name);
	});
	$('.remove_group').live('click', function(event) {
		var group = ko.dataFor(this);
		currentView().groups.remove(group);
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
function groups_template (argument) {
	$('.group_field').live('click',function(e) {
		// if no group()[0] create a new group
		// probably something to add / change a sort as well. maybe wrap all this in one function setGroup or something
		var $this = $(this), field = ko.dataFor(this);
		currentView().addGroup(field.name);
		currentView().addSort(field.name);
	});
}
appDataModel.analyze_template = function() {
	$(document).on('click', '.add_filter', function(e) {
		dataModel.current.view().addFilter();
	});
	$(document).on('click', '.add_grouping', function(e) {
		var filter = ko.dataFor(this);
		dataModel.current.view().addGrouping();
	});
	$(document).on('click', '.add_goal', function(e) {
		var filter = ko.dataFor(this);
		dataModel.current.view().addGoal();
	});
	$(document).on('click', '.filter .remove', function(e) {
		var filter = ko.dataFor(this);
		dataModel.current.view().removeFilter( filter );
	});
	$(document).on('click', '.add_map', function(e) {
		dataModel.current.view().addMap();
	});
	$(document).on('click', '.map .remove', function(e) {
		var map = ko.dataFor(this);
		dataModel.current.view().maps.remove( map );
	});
	$(document).on('click', '.goal .remove', function(e) {
		var goal = ko.dataFor(this);
		dataModel.current.view().goals.remove( goal );
	});
	$(document).on('click', '.goal .add_subgoal', function(e) {
		var ctx = ko.contextFor(this);
		ctx.$data.subgoals.push( new subGoal() )
	});
	$(document).on('click', '.goal .subgoals .remove', function(e) {
		var ctx = ko.contextFor(this);
		ctx.$parent.subgoals.remove( ctx.$data )
	});
}
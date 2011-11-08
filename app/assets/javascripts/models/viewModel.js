function appViewModel() {
	self.rows = ko.observableArray([]);
	self.fields = ko.observableArray([]);
}
var viewModel = new appViewModel();
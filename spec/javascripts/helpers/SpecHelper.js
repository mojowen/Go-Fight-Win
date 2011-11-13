beforeEach(function() {
	currentView = new viewModel();
	rows.removeAll();
	fields.removeAll();
	views.removeAll();
	factoryfields =[]
	factoryrows =[]
});

function bl (argument) {
	console.log(ko.toJS(argument));
}
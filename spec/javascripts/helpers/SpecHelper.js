beforeEach(function() {
	currentView = new viewModel();
	rows.removeAll();
	fields.removeAll();
	views.removeAll();
	factoryfields =[]
	factoryrows =[]
	_list = 'Test';
});

function bl (argument) {
	console.log(ko.toJS(argument));
}
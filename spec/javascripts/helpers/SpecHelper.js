var _size = 0, _list = 'Test', _url = document.location.href;

dev = true

beforeEach(function() {
	dataModel.current.view(new viewModel());
	rows.removeAll();
	newRows.removeAll();
	fields.removeAll();
	views.removeAll();
	factoryfields =[];
	factoryrows =[];
	saving = ko.observable(true);
	dataModel.current.state('explore');
});

function bl (argument) {
	try { 
		ko.toJS(argument); 
		console.log(ko.toJS(argument)); 
	} catch(e) { 
		console.log(argument); 
	};
}

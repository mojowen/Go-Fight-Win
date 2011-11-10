describe("Rows after a filter has been applied", function() {
	var field_1, field_2, field_3
  beforeEach(function() {
	factoryList();

	field_1 = fields()[0].name
	field_2 = fields()[1].name
	field_3 = fields()[2].name


	rows()[0][ field_1 ]('a');
	rows()[1][ field_1 ]('z');
	rows()[2][ field_1 ]('z');
	rows()[2][ field_1 ]('a');
	
	rows()[0][ field_2 ](1);
	rows()[1][ field_2 ](2);
	rows()[2][ field_2 ](5);
	rows()[2][ field_2 ](1);
	
	rows()[0][ field_3 ]('aa');
	rows()[1][ field_3 ]('ab');
	rows()[2][ field_3 ]('ba');
	rows()[3][ field_3 ]('bb');
  });
  it("returns rows when nothing has been passed to the currentView.filters", function() {
     expect( viewModel.filteredRows() ).toEqual(rows());
   });
  it("filters rows with is not", function() {	
	currentView.addFilter(field_1+' is not a')
	for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
		expect( viewModel.filteredRows()[i][field_1]() ).not.toEqual('a');
	};
  });
	  it("filters rows with is", function() {	
	currentView.addFilter(field_1+' is a')
	for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
		expect( viewModel.filteredRows()[i][field_1]() ).toEqual('a');
	};
	  });
	  it("filters rows starts with", function() {	
	currentView.addFilter(field_3+' starts with a')
	for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
		expect( viewModel.filteredRows()[i][field_3]()[0] ).toEqual('a');
	};
	  });
	  	it("filters rows ends with", function() {	
		currentView.addFilter(field_3+' is a')
		for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
			expect( viewModel.filteredRows()[i][field_3]().slice(-1) ).toEqual('a');
		};
	  	});
	it("filters rows with greater than", function() {	
		currentView.addFilter(field_2+' greater than 2')
		for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
			expect( viewModel.filteredRows()[i][field_2]() ).toBeGreaterThan(2);
		};
	});
	it("filters rows with greater than or equal", function() {	
		currentView.addFilter(field_2+' greater than or equal to 2')
		for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
			expect( viewModel.filteredRows()[i][field_2]() ).toBeGreaterThan(1);
		};
	});
	it("filters rows with less than", function() {	
		currentView.addFilter(field_2+' less than 2')
		for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
			expect( viewModel.filteredRows()[i][field_2]() ).toBeLessThan(2);
		};
	});
	
	it("filters rows with is less than or equal to", function() {	
		currentView.addFilter(field_2+' less than or equal to 3')
		for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
			expect( viewModel.filteredRows()[i][field_2]() ).toBeLessThan(3);
		};
	});
	it("filters rows can accept multiple filters", function() {	
		currentView.addFilter(field_1+' is a');
		currentView.addFilter(field_1+' is z');
		for ( var i=0; i < viewModel.filteredRows().length; i++ ) {
			expect( viewModel.filteredRows()[i][field_1]() ).not.toEqual('');
		};
	});
});
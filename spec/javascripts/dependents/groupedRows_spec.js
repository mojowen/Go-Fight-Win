describe("rows for editing after a single or double grouping", function() {
	var field_1, field_2, field_3
	beforeEach(function() {
		currentView().groups.on(true);
		factoryList();

		field_1 = fields()[0].to_param;
		field_2 = fields()[1].to_param;
		field_3 = fields()[2].to_param;
		
		rows()[0][ field_1 ]('a');
		rows()[1][ field_1 ]('z');
		rows()[2][ field_1 ]('z');
		rows()[3][ field_1 ]('a');

		rows()[0][ field_2 ](1);
		rows()[1][ field_2 ](2);
		rows()[2][ field_2 ](5);
		rows()[3][ field_2 ](1);

		rows()[0][ field_3 ]('aa');
		rows()[1][ field_3 ]('ab');
		rows()[2][ field_3 ]('ba');
		rows()[3][ field_3 ]('bb');
	});
	it("returns uniques when grouped by one", function() {
		currentView().addGroup(field_1);
		field_1_vals = ['a','z','']
		for (var i=0; i < viewModel.groupedRows()._uniques[0].length; i++) {
			field_1_vals[i] = field_1_vals[i] == '' ? '--blank' : field_1_vals[i];
			expect( viewModel.groupedRows()._uniques[0][i].value ).toEqual( field_1_vals[i] );
		};
	});
	it("returns uniques when grouped by two fields", function() {
		currentView().addGroup(field_1);
		currentView().addGroup(field_2)
		field_1_vals = ['a','z','']
		field_2_vals = [1,2,5,'']
		for (var i=0; i < viewModel.groupedRows()._uniques[0].length; i++) {
			field_1_vals[i] = field_1_vals[i] == '' ? '--blank' : field_1_vals[i];
			field_2_vals[i] = field_2_vals[i] == '' ? '--blank' : field_2_vals[i];
			expect( viewModel.groupedRows()._uniques[0][i].value ).toEqual( field_1_vals[i] );
			expect( viewModel.groupedRows()._uniques[1][i].value ).toEqual( field_2_vals[i] );
		};
	
	});
	it("returns uniques when grouped by one field", function() {
		currentView().addGroup(field_1);
		expect( viewModel.groupedRows().rows.length ).toEqual(3);
	});
	// it("returns count when grouped by one field", function() {
	// 	currentView().addGroup(field_1);
	// 	expect( viewModel.groupedRows().rows[0].rows.length ).toEqual(2);
	// });
	it("returns sum when grouped by one field", function() {
		currentView().addGroup(field_1);
		expect( viewModel.groupedRows().rows[0][field_2].sum ).toEqual(2);
	});
	it("returns average when grouped by one field", function() {
		currentView().addGroup(field_1);
		expect( viewModel.groupedRows().rows[1][field_2].average ).toEqual(3.5);
	});
	it("returns average when grouped by two fields", function() {
		currentView().addGroup(field_1);
		currentView().addGroup(field_2);
		expect( viewModel.groupedRows().rows[1][field_2].average ).toEqual(3.5);
		expect( viewModel.groupedRows().rows[1].rows[1][field_2].average ).toEqual(2);
	});
	it("returns average when grouped by three fields", function() {
		currentView().addGroup(field_1);
		currentView().addGroup(field_2);
		currentView().addGroup(field_3);
		expect( viewModel.groupedRows().rows[1][field_2].average ).toEqual(3.5);
		expect( viewModel.groupedRows().rows[1].rows[1][field_2].sum ).toEqual(2);
		expect( viewModel.groupedRows().rows[1].rows[1].rows[1][field_2].average ).toEqual(2);
	});
});
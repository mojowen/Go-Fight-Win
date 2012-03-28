describe("rows for editing after a single or double grouping", function() {
	var field_1, field_2, field_3
	beforeEach(function() {
		dataModel.current.state('analyze');
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
		dataModel.current.view().addGrouping();
		grouping = dataModel.current.view().groupings()[0];
	});
	it("returns uniques when grouped by one", function() {
		grouping.groups.push( new groupModel(field_1 ) );
		field_1_vals = ['a','z','']
		for (var i=0; i < grouping.grouped()._uniques[0].length; i++) {
			field_1_vals[i] = field_1_vals[i] == '' ? '--' : field_1_vals[i];
			expect( grouping.grouped()._uniques[0][i].value ).toEqual( field_1_vals[i] );
		};
	});
	it("returns uniques when grouped by two fields", function() {
		grouping.groups.push( new groupModel(field_1 ) );
		grouping.groups.push( new groupModel(field_2 ) );
		field_1_vals = ['a','z','']
		field_2_vals = [1,2,5,'']
		for (var i=0; i < grouping.grouped()._uniques[0].length; i++) {
			field_1_vals[i] = field_1_vals[i] == '' ? '--' : field_1_vals[i];
			field_2_vals[i] = field_2_vals[i] == '' ? '--' : field_2_vals[i];
			expect( grouping.grouped()._uniques[0][i].value ).toEqual( field_1_vals[i] );
			expect( grouping.grouped()._uniques[1][i].value ).toEqual( field_2_vals[i] );
		};
	});
	it("returns uniques when grouped by one field", function() {
		grouping.groups.push( new groupModel(field_1 ) );
		expect( grouping.grouped().rows.length ).toEqual(3);
	});
	// it("returns count when grouped by one field", function() {
	// 	grouping.groups.push( new groupModel(field_1 ) );
	// 	expect( grouping.grouped().rows[0].rows.length ).toEqual(2);
	// });
	it("returns sum when grouped by one field", function() {
		grouping.groups.push( new groupModel(field_1 ) );
		expect( grouping.grouped().rows[0][field_2].sum ).toEqual(2);
	});
	it("returns average when grouped by one field", function() {
		grouping.groups.push( new groupModel(field_1 ) );
		expect( grouping.grouped().rows[1][field_2].average ).toEqual(3.5);
	});
	it("returns average when grouped by two fields", function() {
		grouping.groups.push( new groupModel(field_1 ) );
		grouping.groups.push( new groupModel(field_2 ) );
		expect( grouping.grouped().rows[1][field_2].average ).toEqual(3.5);
		expect( grouping.grouped().rows[1].rows[1][field_2].average ).toEqual(2);
	});
	// it("returns average when grouped by three fields", function() {
	// 	grouping.groups.push( new groupModel(field_1 ) );
	// 	grouping.groups.push( new groupModel(field_2 ) );
	// 	grouping.groups.push( new groupModel(field_3 ) );
	// 	expect( grouping.grouped().rows[1][field_2].average ).toEqual(3.5);
	// 	expect( grouping.grouped().rows[1].rows[1][field_2].sum ).toEqual(2);
	// 	expect( grouping.grouped().rows[1].rows[1].rows[1][field_2].average ).toEqual(2);
	// });
});
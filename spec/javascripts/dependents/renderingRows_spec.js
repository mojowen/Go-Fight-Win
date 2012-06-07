describe("Rows that are dataModel.currently being displated, representing the list's dataModel.current condition", function() {
	var field_1, field_2, field_3
	beforeEach(function() {
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
	it("returns rows normally if no parameters are set and rows are less than visible and paged", function() {
		waits(20)
		runs( function() { expect(viewModel.renderingRows()).toEqual(rows()) });
    });
	it("slices rows if visible set to lower value", function() {
		runs(function() { dataModel.current.view().end(1) })
		waits(20)
		runs(function() {expect( viewModel.renderingRows().length ).toEqual(1); })
	});
	it("pages rows successfully", function() {
	   runs( function() { 
		dataModel.current.view().end(2);
		dataModel.current.view().start(1);
	   })
		waits(20)
	   runs(function(){expect( ko.toJS(viewModel.renderingRows()[0] ) ).toEqual( ko.toJS(rows()[1]) );})
	});
	it("pages rows when filtered", function() {
		runs( function() { 
			dataModel.current.view().end(2);
			dataModel.current.view().start(1);
			dataModel.current.view().addFilter(field_1+' not z')
		})
		waits(20)
	   runs( function() {expect( ko.toJS(viewModel.renderingRows()[0] ) ).toEqual( ko.toJS(rows()[3]) );});
	});
	// it("pages rows when grouped", function() {
	//    dataModel.current.view().visible(1);
	//    dataModel.current.view().paged(1);
	//    dataModel.current.view().addGroup(field_1);
	//    expect( ko.toJS(viewModel.renderingRows()[0]._value ) ).toEqual( 'z' );
	// });
});
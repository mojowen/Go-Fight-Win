describe("Rows that are currently being displated, representing the list's current condition", function() {
	var field_1, field_2, field_3
	beforeEach(function() {
		factoryList();

		field_1 = fields()[0].name
		field_2 = fields()[1].name
		field_3 = fields()[2].name

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
		expect(viewModel.renderingRows()).toEqual(rows());
    });
	it("slices rows if visible set to lower value", function() {
		currentView().visible(1)
		expect( viewModel.renderingRows().length ).toEqual(1);
	});
	it("pages rows successfully", function() {
	   currentView().visible(1);
	   currentView().paged(1);
	   expect( ko.toJS(viewModel.renderingRows()[0] ) ).toEqual( ko.toJS(rows()[1]) );
	});
	it("pages rows when filtered", function() {
	   currentView().visible(1);
	   currentView().paged(1);
	   currentView().addFilter(field_1+' not z')
	   expect( ko.toJS(viewModel.renderingRows()[0] ) ).toEqual( ko.toJS(rows()[3]) );
	});
	// it("pages rows when grouped", function() {
	//    currentView().visible(1);
	//    currentView().paged(1);
	//    currentView().addGroup(field_1);
	//    expect( ko.toJS(viewModel.renderingRows()[0]._value ) ).toEqual( 'z' );
	// });
});
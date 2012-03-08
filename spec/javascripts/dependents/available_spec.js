describe("description", function() {
	var field_1, field_2, field_3, grouping
	beforeEach(function() {
		factoryList();
		field_1 = fields()[0].to_param;
		field_2 = fields()[1].to_param;
		field_3 = fields()[2].to_param;
		dataModel.current.view().addGrouping()
		grouping = dataModel.current.view().groupings()[0]
	});
  it("returns all fields if no grouping is set", function() {
	expect( grouping.available().length ).toEqual(4);
  });
  it("successfully removes grouped field", function() {
	grouping.groups.push( new groupModel(field_1 ) );
	expect( grouping.available()[0]).not.toEqual(field_1);
  });
  it("successfully removes second grouped field", function() {
	grouping.groups.push( new groupModel(field_1) );
	grouping.groups.push( new groupModel(field_3) );
	for (var i=0; i < viewModel.availableGroups().length; i++) {
		expect( grouping.available()[i]).not.toEqual(field_1);
		expect( grouping.available()[i]).not.toEqual(field_3);
	};
  });
});
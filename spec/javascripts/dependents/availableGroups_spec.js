describe("description", function() {
	var field_1, field_2, field_3
	beforeEach(function() {
		factoryList();
		field_1 = fields()[0].to_param;
		field_2 = fields()[1].to_param;
		field_3 = fields()[2].to_param;
	});
  it("returns all fields if no grouping is set", function() {
	expect( viewModel.availableGroups().length ).toEqual(4);
  });
  it("successfully removes grouped field", function() {
	dataModel.current.view().addGroup(field_1);
	expect(viewModel.availableGroups()[0]).not.toEqual(field_1);
  });
  it("successfully removes second grouped field", function() {
	dataModel.current.view().addGroup(field_1);
	dataModel.current.view().addGroup(field_3);
	for (var i=0; i < viewModel.availableGroups().length; i++) {
		expect(viewModel.availableGroups()[i]).not.toEqual(field_1);
		expect(viewModel.availableGroups()[i]).not.toEqual(field_3);
	};
  });
});
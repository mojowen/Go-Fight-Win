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
	it("returns rows normally if no parameters are set", function() {
		expect(viewModel.renderingRows()).toEqual(rows())
  });
});
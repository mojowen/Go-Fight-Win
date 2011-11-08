describe("savingRows", function() {
	beforeEach(function() {
		fields.removeAll();
		rows.removeAll();
		for (var i=0; i < 4; i++) {
			fields.push(factoryField());
		};
		for (var i=0; i < 10; i++) {
			rows.push(factoryRow());
		};
	});
  	it("collects all the rows with a dirty flag", function() {
		for (var i=0; i < 10; i += 3) {
			rows()[i][ fields()[0].name ]('different');
		};
		expect( viewModel.savingRows().length ).toEqual(4);
  	});
  	it("collects all the rows with a delete flag", function() {
		for (var i=0; i < 10; i += 5) {
			rows.destroy(rows()[i]);
		};
		expect( viewModel.savingRows().length ).toEqual(2);
  	});
  	it("collects all the rows with both a dirty and delete flag", function() {
		for (var i=0; i < 10; i += 5) {
			rows.destroy(rows()[i+1]);
			rows()[i][ fields()[0].name ]('different');
		};		
		expect( viewModel.savingRows().length ).toEqual(4);
  	});
});
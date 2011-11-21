describe("savingRows", function() {
	beforeEach(function() {
		factoryList();
	});
  	it("collects all the rows with a dirty flag", function() {
		for (var i=0; i < 10; i += 3) {
			rows()[i][ fields()[0].name ]('different');
		};
		expect( dataModel.savingRows().length ).toEqual(4);
  	});
  	it("collects all the rows with a delete flag", function() {
		for (var i=0; i < 10; i += 5) {
			rows.destroy(rows()[i]);
		};
		expect( dataModel.savingRows().length ).toEqual(2);
  	});
  	it("collects all the rows with both a dirty and delete flag", function() {
		for (var i=0; i < 10; i += 5) {
			rows.destroy(rows()[i+1]);
			rows()[i][ fields()[0].name ]('different');
		};		
		expect( dataModel.savingRows().length ).toEqual(4);
  	});
	it("adds a new row and shows up ", function() {
	  	addRow( new rowModel({key: 'new', list: _list}) );
		expect( dataModel.savingRows().length ).toEqual( 1 );
	});

});
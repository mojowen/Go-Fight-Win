describe("Setting up the rowModel", function() {
	it("creates a new row from a basic object", function() {
		var row = new rowModel({key: 123, list:'test'});
		expect(row.constructor.name).toEqual('rowModel');
	});
	it("can create a row if row data is inside row object", function() {
		var row_data = { Row: {key: 123, list:'test'} }
		var row = new rowModel( row_data );
		expect(row.constructor.name).toEqual('rowModel');
	});
	it("cannot create a row without a key", function() {
		expect( function() { var row = new rowModel( { list:'test' } ); } ).toThrow();
	});
	it("ignors non-field data", function() {
	  var row = new rowModel( { list:'Test', key: 123, bullshit: 'more' } );
	  expect( row.bullshit ).toBeUndefined();
	});
	it("initializes a new row with a tempkey", function() {
	  var row = new rowModel({ list: 'Test', key: 'new'});
	  expect(row._tempkey).toBeDefined();
	});
});
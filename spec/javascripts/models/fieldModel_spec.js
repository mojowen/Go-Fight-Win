describe("fieldModel", function() {
  it("can create new fields", function() {
	field = new fieldModel({ list: 'Test', field_type: 'text', id: 9, name: 'name' });
    expect(field).toBeDefined();
  });
	it("throws an error when forgetting name", function() {
	  expect(function() { var field = new fieldModel( { id: 9, list: 'name' } ); }).toThrow();
	});
	it("throws an error when forgetting id", function() {
	  expect(function() { var field = new fieldModel( { list: 'text', id: 9 } ); }).toThrow();
	});
	it("sets the correct name", function() {
		var field =  new fieldModel( { list: 'Test', id: 9, name: 'Named_it' } );
	  	expect(field.name).toEqual('Named_it');
	});

});